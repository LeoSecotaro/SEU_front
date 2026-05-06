import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Specific rule for admin routes: /api/admin/... -> http://localhost:3000/admin/...
      '/api/admin': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/admin/, '/admin')
      },
      // Proxy any other request starting with /api to the Rails backend on :3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // keep the /api prefix so Rails receives /api/v1/... routes correctly
        // no rewrite
      },
      // Proxy Devise routes mounted at root (e.g. /users/sign_in)
      '/users': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  }
})
