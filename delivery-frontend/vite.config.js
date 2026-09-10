import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ["icon-192.png", "icon-512.png"],
    manifest: {
        name: "LocalBites - Delivery App",
        short_name: "LocalBites Delivery",
        description: "Accept and deliver orders on the go with LocalBites.",
        theme_color: "#E8590C",
        background_color: "#FFF1E6",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        runtimeCaching: []
      },
    }),
  ],
  server: {
    port: 5175, 
  },
  preview: {
    port: 5175, 
  }
})
