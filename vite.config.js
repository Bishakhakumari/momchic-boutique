import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'esbuild', // ✅ Safe and fast — no terser issues
    chunkSizeWarningLimit: 900,
    target: 'esnext',
    assetsInlineLimit: 4096, // ✅ speeds up small images/fonts inline
    cssCodeSplit: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
