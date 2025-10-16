import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Cấu hình Vite hợp nhất cho cả local dev & GitHub Pages
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    base: '/tao-anh/', // ⚠️ Tên repo trên GitHub, KHÔNG đổi nếu repo là 'tao-anh'
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  }
})
