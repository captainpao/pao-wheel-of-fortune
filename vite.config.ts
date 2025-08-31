import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './src/main.ts',
      formats: ['es'],
      fileName: 'main'
    },
    rollupOptions: {
      external: /^lit/
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})