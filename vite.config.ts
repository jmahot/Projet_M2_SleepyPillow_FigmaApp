import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Ajout de la configuration du serveur et du proxy
  server: {
    proxy: {
      '/api-render': {
        target: 'https://projet-m2-sleepypillow.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-render/, ''),
        secure: true,
      },
    },
  },
})