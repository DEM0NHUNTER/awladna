# vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
  react(),
  tailwindcss(),
	],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  define: {
    __APP_ENV__: JSON.stringify(process.env.VITE_API_URL)
  }
})