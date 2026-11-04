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
  const configuredApiOrigin = (() => {
    if (!env.VITE_API_URL) return "'self'";
    try {
      const parsed = new URL(env.VITE_API_URL);
      if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && ["localhost", "127.0.0.1"].includes(parsed.hostname))) {
        throw new Error("VITE_API_URL must use HTTPS outside local development");
      }
      if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) {
        throw new Error("VITE_API_URL must be an origin without credentials, path, query, or fragment");
      }
      if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) {
        throw new Error("VITE_API_URL must be an origin without credentials, path, query, or fragment");
      }
      if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) {
        throw new Error("VITE_API_URL must be an origin without credentials, path, query, or fragment");
      }
      return parsed.origin;
    } catch (error) {
      throw new Error(`Invalid VITE_API_URL: ${String(error)}`);
    }
  })();
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
      {
        name: "vyuham-security-csp",
        transformIndexHtml: {
          order: "pre" as const,
          handler(html) {
            const policy = [
              "default-src 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https://fonts.gstatic.com",
              `connect-src 'self' https://cnbnhfwvldgskpzfmifj.supabase.co wss://cnbnhfwvldgskpzfmifj.supabase.co ${configuredApiOrigin}`,
              "media-src 'self' data: blob: https:",
            ].join("; ");
            return html.replace("<head>", `<head>\n    <meta http-equiv="Content-Security-Policy" content="${policy}">`);
          },
        },
      },

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
