import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ✅ Using the Vite plugin for Tailwind v4
  ],
  base: "/",
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://awladna-api-1017471338215.us‑west1.run.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
