import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'sounds/*.mp3'],
      manifest: {
        name: 'LoveSpace - Không Gian Yêu Thương',
        short_name: 'LoveSpace',
        description: 'Ứng dụng chăm sóc, kết nối cảm xúc & lưu giữ kỷ niệm tình yêu',
        theme_color: '#fff1f2',
        background_color: '#fff1f2',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
