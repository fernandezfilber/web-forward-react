import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType:  'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name:             'Forward Vision',
        short_name:       'ForwardVision',
        description:      'Internet de fibra óptica de alta velocidad',
        theme_color:      '#22d3ee',
        background_color: '#030712',
        display:          'standalone',
        start_url:        '/',
        icons: [
          { src: '/icono.png', sizes: '192x192', type: 'image/png' },
          { src: '/icono.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns:        ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        navigateFallbackDenylist: [/^\/api/], // Evitar que el Service Worker intercepte peticiones al backend
        runtimeCaching: [
          {
            // Cache API media calls (gallery)
            urlPattern: /^https?:\/\/.*\/api\/media/,
            handler:    'NetworkFirst',
            options: {
              cacheName:            'api-media-cache',
              expiration:           { maxEntries: 50, maxAgeSeconds: 300 },
              networkTimeoutSeconds: 5,
            },
          },
          {
            // Cache Cloudinary images
            urlPattern: /^https:\/\/res\.cloudinary\.com\//,
            handler:    'CacheFirst',
            options: {
              cacheName:  'cloudinary-images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 7 días
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target:     'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Separate chunks for better caching
        manualChunks: {
          vendor:   ['react', 'react-dom', 'react-router-dom'],
          three:    ['three', '@react-three/fiber', '@react-three/drei'],
          motion:   ['framer-motion'],
          ui:       ['lucide-react'],
        }
      }
    }
  }
})
