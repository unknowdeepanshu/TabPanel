import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import manifest from "./manifest.json";
import { crx } from "@crxjs/vite-plugin";

export default defineConfig({
  plugins: [tailwindcss(), react(), crx({ manifest })],

  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
