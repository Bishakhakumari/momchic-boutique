import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      devOptions: {
  enabled: true,
},

      manifest: {
        name: 'MOMCHIC Boutique',
        short_name: 'MOMCHIC',
        description: 'MOMCHIC Boutique - Girls Styling Station',
        theme_color: '#ec4899',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',

        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],

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