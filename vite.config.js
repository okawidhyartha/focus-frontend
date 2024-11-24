import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,json,mp3,webp,woff2,woff,wav}",
        ],
        maximumFileSizeToCacheInBytes: 10000000,
      },
    }),
  ],
});
