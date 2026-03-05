import node from '@astrojs/node'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  build: { inlineStylesheets: 'auto' },
  integrations: [react()],
  output: 'server',
  security: {
    checkOrigin: true
  },
  vite: {
    plugins: [tailwindcss()],
    css: { devSourcemap: false },
    build: { cssCodeSplit: false },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    }
  }
})
