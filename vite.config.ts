import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: '/index.html'
      }
    }
  },
  base: '/' // Change this to '/wheel-of-fortune/' if deploying to a subdirectory
})