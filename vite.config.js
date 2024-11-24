import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,json,mp3,webp,woff2,woff,wav}",
        ],
        maximumFileSizeToCacheInBytes: 10000000,
      },
      manifest: {
        name: "Focus Sphere",
        short_name: "Focus Sphere",
        description: "Focus your mind be more productive",
        theme_color: "#E9BE61",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "/screenshots/narrow-1.jpg",
            sizes: "1080x1920",
            type: "image/jpg",
            form_factor: "narrow",
          },
          {
            src: "/screenshots/narrow-2.jpg",
            sizes: "1080x1920",
            type: "image/jpg",
            form_factor: "narrow",
          },
          {
            src: "/screenshots/wide-1.jpg",
            sizes: "1920x1920",
            type: "image/jpg",
            form_factor: "wide",
          },
          {
            src: "/screenshots/wide-2.jpg",
            sizes: "1920x1920",
            type: "image/jpg",
            form_factor: "wide",
          },
        ],
      },
    }),
  ],
});
