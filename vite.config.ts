// front_end/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/api": path.resolve(__dirname, "./src/api")  // ✅ Ensure this matches your folder structure
    }
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  }
});