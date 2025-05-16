import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";
dotenv.config();
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      'socialix-6vkj.onrender.com',
      'localhost',
      '127.0.0.1'
    ],
    host: "0.0.0.0", // Listen on all addresses
    port: process.env.PORT || 3000,
    proxy: {
      "/api/news": {
        target: "https://newsapi.org",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(
            /^\/api\/news/,
            `/v2/top-headlines?category=technology&language=en&pageSize=2&apiKey=${process.env.VITE_NEWS_API}`
          ),
      },
    },
  },
});
