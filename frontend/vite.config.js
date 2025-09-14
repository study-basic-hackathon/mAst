import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 開発サーバー用のプロキシ設定
    proxy: {
      // /apiで始まるリクエストをバックエンドへ転送
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // /staticで始まるリクエストもバックエンドへ転送
      '/static': {
        target: 'http://backend:8000',
        changeOrigin: true,
      }
    }
  }
})
