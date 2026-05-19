const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const net = require('net');

const PORT = 3001;
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const tokens = new Map(); // token -> { status: 'waiting' | 'uploaded', images: string[] }

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// Get local IP address for mobile access
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const LOCAL_IP = getLocalIp();
console.log(`\n[Server] Local IP detected: ${LOCAL_IP}`);

const server = http.createServer((req, res) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // 1. Generate Token (PC)
    if (pathname === '/api/token/generate' && req.method === 'GET') {
        const token = Math.random().toString(36).substring(7);
        tokens.set(token, { status: 'waiting', images: [] });
        
        const mobileUrl = `http://${LOCAL_IP}:${PORT}/mobile/${token}`;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ token, mobileUrl }));
        console.log(`[PC] Token generated: ${token}`);
    }

    // 2. Serve Mobile Page (Mobile)
    else if (pathname.startsWith('/mobile/') && req.method === 'GET') {
        const token = pathname.split('/')[2];
        if (!tokens.has(token)) {
            res.writeHead(404);
            res.end('Invalid Token');
            return;
        }

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
            <title>样品批量拍照</title>
            <style>
                body { font-family: sans-serif; background: #f8fafc; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; }
                .header { text-align: center; margin-bottom: 20px; }
                .header h2 { margin: 0; color: #1e293b; }
                .header p { color: #64748b; font-size: 14px; }
                
                .upload-actions {
                    display: flex; gap: 12px; width: 100%; max-width: 340px; margin-bottom: 24px;
                }
                .btn-action { 
                    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
                    gap: 8px; padding: 20px 10px; border-radius: 12px; font-weight: bold; font-size: 14px;
                    transition: all 0.2s; cursor: pointer;
                }
                .btn-action.primary { background: #1890ff; color: white; box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2); }
                .btn-action.secondary { background: white; color: #1890ff; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
                .btn-action:active { transform: scale(0.95); }
                
                .preview-grid { 
                    display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; width: 100%; 
                    margin-bottom: 80px;
                }
                .preview-item { 
                    aspect-ratio: 1; background: #fff; border-radius: 8px; overflow: hidden; 
                    position: relative; border: 1px solid #e2e8f0;
                }
                .preview-item img { width: 100%; height: 100%; object-fit: cover; }
                .preview-item .status-tag { 
                    position: absolute; bottom: 0; left: 0; width: 100%; 
                    background: rgba(34, 197, 94, 0.9); color: white; font-size: 10px; 
                    text-align: center; padding: 4px 0;
                }
                
                .footer-actions {
                    position: fixed; bottom: 0; left: 0; width: 100%; padding: 16px;
                    background: white; box-shadow: 0 -4px 12px rgba(0,0,0,0.05);
                    display: flex; justify-content: center; box-sizing: border-box;
                }
                .finish-btn {
                    width: 100%; max-width: 300px; padding: 14px; background: #1e293b;
                    color: white; border: none; border-radius: 10px; font-weight: 600;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>样品批量拍照</h2>
                <p>已同步上传 <span id="count">0</span> 张照片</p>
            </div>

            <div class="upload-actions">
                <label class="btn-action primary">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd"/></svg>
                    开始拍照
                    <input type="file" id="cameraInput" accept="image/*" capture="environment" style="display:none">
                </label>
                <label class="btn-action secondary">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.06zM20.25 5.25a.75.75 0 00-.75.75v3a.75.75 0 001.5 0V6a.75.75 0 00-.75-.75z" clip-rule="evenodd"/></svg>
                    相册选择
                    <input type="file" id="albumInput" accept="image/*" multiple style="display:none">
                </label>
            </div>

            <div id="previewGrid" class="preview-grid"></div>

            <div class="footer-actions">
                <button class="finish-btn" onclick="window.close(); alert('上传完成，请在电脑端查看')">完成拍摄</button>
            </div>

            <script>
                const cameraInput = document.getElementById('cameraInput');
                const albumInput = document.getElementById('albumInput');
                const previewGrid = document.getElementById('previewGrid');
                const countSpan = document.getElementById('count');
                let count = 0;

                const handleFiles = (e) => {
                    const files = Array.from(e.target.files);
                    if (files.length === 0) return;
                    for (const file of files) {
                        uploadFile(file);
                    }
                    e.target.value = '';
                };

                cameraInput.onchange = handleFiles;
                albumInput.onchange = handleFiles;

                async function uploadFile(file) {
                    const item = document.createElement('div');
                    item.className = 'preview-item';
                    const img = document.createElement('img');
                    img.src = URL.createObjectURL(file);
                    item.appendChild(img);
                    
                    const tag = document.createElement('div');
                    tag.className = 'status-tag';
                    tag.style.background = '#94a3b8';
                    tag.innerText = '正在上传...';
                    item.appendChild(tag);
                    
                    previewGrid.insertBefore(item, previewGrid.firstChild);

                    const formData = new FormData();
                    formData.append('image', file);

                    try {
                        const res = await fetch('/api/upload/${token}', { method: 'POST', body: formData });
                        if (res.ok) {
                            tag.innerText = '✓ 已同步';
                            tag.style.background = '#22c55e';
                            count++;
                            countSpan.innerText = count;
                        } else {
                            tag.innerText = '✕ 失败';
                            tag.style.background = '#ef4444';
                        }
                    } catch (err) {
                        tag.innerText = '✕ 出错';
                        tag.style.background = '#ef4444';
                    }
                }
            </script>
        </body>
        </html>
        `;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(html);
    }

    // 3. Upload Image (Mobile)
    else if (pathname.startsWith('/api/upload/') && req.method === 'POST') {
        const token = pathname.split('/')[3];
        if (!tokens.has(token)) {
            res.writeHead(404);
            res.end('Invalid Token');
            return;
        }

        let body = Buffer.alloc(0);
        req.on('data', chunk => { body = Buffer.concat([body, chunk]); });
        req.on('end', () => {
            const filename = `img_${token}_${Date.now()}.jpg`;
            const filePath = path.join(UPLOADS_DIR, filename);
            
            const boundary = req.headers['content-type']?.split('boundary=')[1];
            if (boundary) {
                const parts = body.toString('binary').split('--' + boundary);
                for (let part of parts) {
                    if (part.includes('Content-Type: image')) {
                        const content = part.split('\r\n\r\n')[1];
                        const data = Buffer.from(content.split('\r\n--')[0], 'binary');
                        fs.writeFileSync(filePath, data);
                        break;
                    }
                }
            } else {
                fs.writeFileSync(filePath, body);
            }

            const state = tokens.get(token);
            const imageUrl = `http://${LOCAL_IP}:${PORT}/uploads/${filename}`;
            state.images.push(imageUrl);
            state.status = 'uploaded';

            res.writeHead(200);
            res.end('OK');
            console.log(`[Mobile] Image added to token ${token}. Total: ${state.images.length}`);
        });
    }

    // 4. Check Status (PC)
    else if (pathname.startsWith('/api/status/') && req.method === 'GET') {
        const token = pathname.split('/')[3];
        if (!tokens.has(token)) {
            res.writeHead(404);
            res.end('Invalid Token');
            return;
        }

        const state = tokens.get(token);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: state.status,
            images: state.images
        }));
    }

    // 5. Serve Uploaded Images
    else if (pathname.startsWith('/uploads/') && req.method === 'GET') {
        const filename = pathname.split('/')[2];
        const filePath = path.join(UPLOADS_DIR, filename);
        if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath).toLowerCase();
            const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
            res.writeHead(200, { 'Content-Type': contentType });
            fs.createReadStream(filePath).pipe(res);
        } else {
            res.writeHead(404);
            res.end('Not Found');
        }
    }

    // 6. Network Printing (Direct to POSTEK G-3106 at 192.168.100.202)
    else if (pathname === '/api/print/network' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { tasks } = JSON.parse(body);
                const PRINTER_IP = '192.168.100.202';
                const PRINTER_PORT = 9100;

                console.log(`[Printer] Received ${tasks.length} print tasks. Sending to ${PRINTER_IP}...`);

                // 构造 TSPL 指令流 (针对 50mm * 30mm 标签)
                let commands = '';
                tasks.forEach(task => {
                    commands += `SIZE 50 mm, 30 mm\r\n`;
                    commands += `GAP 2 mm, 0\r\n`;
                    commands += `DIRECTION 1\r\n`;
                    commands += `CLS\r\n`;
                    // 绘制标题和边框线
                    commands += `TEXT 20,20,"TSS24.BF2",0,1,1,"开发样标签"\r\n`;
                    commands += `TEXT 340,22,"TSS16.BF2",0,1,1,"${task.sampleNo}"\r\n`;
                    commands += `BAR 20,55,460,2\r\n`;
                    // 绘制内容 (限制名称长度避免重叠)
                    const shortName = task.sampleName.substring(0, 15);
                    commands += `TEXT 20,75,"TSS20.BF2",0,1,1,"名称:${shortName}"\r\n`;
                    commands += `TEXT 20,115,"TSS16.BF2",0,1,1,"PM:${task.productManager}"\r\n`;
                    commands += `TEXT 20,145,"TSS16.BF2",0,1,1,"日期:${task.receiveDate}"\r\n`;
                    // 绘制二维码
                    commands += `QRCODE 340,80,L,4,A,0,"${task.sampleNo}"\r\n`;
                    // 页脚
                    commands += `TEXT 120,205,"TSS16.BF2",0,1,1,"* 请妥善保管样品 *"\r\n`;
                    commands += `PRINT 1\r\n`;
                });

                const client = new net.Socket();
                // 设置超时
                client.setTimeout(3000);

                client.connect(PRINTER_PORT, PRINTER_IP, () => {
                    console.log(`[Printer] Connected to ${PRINTER_IP}`);
                    // 注意：大部分标签打印机默认使用 GBK 编码处理中文
                    // 这里直接发送字符串，如果乱码则需要使用 Buffer 处理编码
                    client.write(commands, 'utf8', () => {
                        console.log(`[Printer] Data sent successfully.`);
                        client.end();
                    });
                });

                client.on('error', (err) => {
                    console.error(`[Printer] Connection failed: ${err.message}`);
                    if (!res.writableEnded) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, message: `无法连接打印机: ${err.message}` }));
                    }
                });

                client.on('timeout', () => {
                    console.error(`[Printer] Connection timeout.`);
                    client.destroy();
                    if (!res.writableEnded) {
                        res.writeHead(408, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, message: '连接打印机超时' }));
                    }
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: '指令已送达打印机' }));

            } catch (err) {
                console.error('[Printer] Server error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: err.message }));
            }
        });
    }

    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Running at http://localhost:${PORT}`);
    console.log(`[Server] Mobile Upload Entry: http://${LOCAL_IP}:${PORT}/mobile/YOUR_TOKEN`);
    console.log(`[Server] Keep this terminal open while testing.`);
});
