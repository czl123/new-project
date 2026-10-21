import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import fs from 'fs'

function localJsonStorePlugin(): Plugin {
  const storeFilePath = path.resolve(__dirname, './src/api/sku-kanban-store.json')
  return {
    name: 'local-json-store-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api/local-store/sku-kanban')) {
          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            if (fs.existsSync(storeFilePath)) {
              const content = fs.readFileSync(storeFilePath, 'utf-8')
              res.end(content || '{}')
            } else {
              res.end('{}')
            }
            return
          } else if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk) => { body += chunk })
            req.on('end', () => {
              try {
                fs.writeFileSync(storeFilePath, body, 'utf-8')
                res.setHeader('Content-Type', 'application/json; charset=utf-8')
                res.end(JSON.stringify({ success: true }))
              } catch (err: any) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: err.message }))
              }
            })
            return
          }
        }
        next()
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    localJsonStorePlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 9001,
    watch: {
      ignored: ['**/src/api/sku-kanban-store.json']
    },
    proxy: {
      '/api/print': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/bsc-cloud-product': {
        target: 'http://jcerp.jcintergl.com',
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/theme/variables.scss" as *;`
      }
    }
  }
})
