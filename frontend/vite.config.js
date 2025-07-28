import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs',
  },
  server: {
    port: 5173,
    strictPort: true, // Don't try another port if 5173 is taken
    host: 'localhost',
  },
})
