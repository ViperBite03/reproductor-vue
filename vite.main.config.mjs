// vite.renderer.config.js
import { defineConfig } from "vite";
import path, { dirname } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@/": `${path.resolve(__dirname, "src")}/`,
    },
  },
});
