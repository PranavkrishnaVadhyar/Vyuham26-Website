import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "next/link": path.resolve(__dirname, "src/shims/next-link.tsx"),
      "next/image": path.resolve(__dirname, "src/shims/next-image.tsx"),
      "next/navigation": path.resolve(__dirname, "src/shims/next-navigation.tsx"),
      "next/dynamic": path.resolve(__dirname, "src/shims/next-dynamic.tsx"),
      "next/font/google": path.resolve(__dirname, "src/shims/next-font.tsx"),
    },
  },
});
