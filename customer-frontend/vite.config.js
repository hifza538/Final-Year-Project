import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ["icon-192.png", "icon-512.png"],
    manifest: {
        name: "LocalBites - Food Delivery",
        short_name: "LocalBites",
        description: "Order delicious food from your favorite local restaurants in Gujranwala.",
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
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/customer/restaurants"),
            handler: "NetworkFirst",
            options: {
              cacheName: "restaurants-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5174,  
  },
  preview: {
    port: 5174, 
  }
})
