import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/", // Ensures proper paths in production
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",        // Vercel expects this
    emptyOutDir: true,
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
});
