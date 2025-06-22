// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";  // ⬅️ Make sure this is imported

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // ✅ Alias @ to src directory
      "@/api": path.resolve(__dirname, "./src/api"),
    },
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
