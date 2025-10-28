import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Lắng nghe tất cả interface
    port: 3000,       // Port mặc định
    strictPort: true, // Bắt buộc dùng port này
    allowedHosts: 'all'  // Cho phép TẤT CẢ host và subdomain
  }
})
