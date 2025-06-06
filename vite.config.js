import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: ".",         // ensures working from front_end folder
  base: "/",         // ensure proper asset paths
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
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
    historyApiFallback: true,
  },
});
