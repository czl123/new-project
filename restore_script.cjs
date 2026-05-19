const fs = require('fs');
const path = require('path');

const backupPath = 'F:\\project\\jcerp\\new-project\\src\\views\\product\\settings\\index.vue.bak';
const targetPath = 'F:\\project\\jcerp\\new-project\\src\\views\\product\\settings\\index.vue';

try {
    console.log(`Reading from ${backupPath}`);
    let content = fs.readFileSync(backupPath, 'utf8');
    
    // Strip BOM if present
    if (content.charCodeAt(0) === 0xFEFF) {
        console.log('Stripping BOM');
        content = content.slice(1);
    }
    
    const data = JSON.parse(content);
    
    console.log(`Extracted ${data.output.length} characters`);
    
    fs.writeFileSync(targetPath, data.output, 'utf8');
    
    console.log('Successfully wrote to index.vue');
} catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
}
