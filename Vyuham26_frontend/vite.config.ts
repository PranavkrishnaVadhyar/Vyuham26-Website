import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type PluginOption } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { visualizer } from "rollup-plugin-visualizer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  const apiProxyTarget = (env.API_URL || env.VITE_API_URL || "").replace(/\/+$/, "");
  const isSplit = mode === "split" || mode === "analyze";
  const isAnalyze = mode === "analyze";

  return {
    server: {
      port: 5173,
      ...(apiProxyTarget
        ? {
            proxy: {
              "/api": {
                target: apiProxyTarget,
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/api/, ""),
              },
            },
          }
        : {}),
    },
    plugins: [
      react(),
      tailwindcss(),

      (!isSplit ? viteSingleFile() : null) as PluginOption,
      (isAnalyze
        ? visualizer({
            filename: "dist/stats.html",
            open: false,
            gzipSize: true,
            brotliSize: true,
          })
        : null) as PluginOption,
    ].filter(Boolean),
    build: {
      rollupOptions: isSplit
        ? {
            output: {
              manualChunks: {
                "vendor-react": ["react", "react-dom"],
                "vendor-three": ["three"],
                "vendor-motion": ["framer-motion", "gsap"],
              },
            },
          }
        : {},
    },
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
  };
});
