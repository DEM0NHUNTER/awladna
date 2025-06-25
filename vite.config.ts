// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/api": path.resolve(__dirname, "./src/api"),
      "@/context": path.resolve(__dirname, "./src/context"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://awladna-api-1017471338215.us-west1.run.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    port: 3000,
  },
});
