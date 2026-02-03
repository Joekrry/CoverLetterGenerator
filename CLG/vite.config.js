import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/CoverLetterGenerator/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'pdf-vendor': ['jspdf', 'html2canvas'],
          'docx-vendor': ['docx', 'file-saver']
        }
      }
    }
  },
  server: {
    port: 3000,
    allowedHosts: ['obvolutive-impecuniously-rena.ngrok-free.dev']
  }
})
