// vite.renderer.config.js
import { defineConfig } from 'vite'
import path, { dirname } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['@vreden/youtube_scraper', 'images-scraper', 'puppeteer'],
    },
  },
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
})
