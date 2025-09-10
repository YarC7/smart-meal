import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    allowedHosts: ["localhost", "127.0.0.1", "4a94e373af0e.ngrok-free.app"],
    port: 8080,
    fs: {
      allow: [
        "./client",
        "./shared",
        "./", // add this line for root, or use absolute path to your project root
      ],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "injectManifest",
      srcDir: "client",
      filename: "sw.ts",
      injectRegister: null,
      includeAssets: ["placeholder.svg", "robots.txt"],
      workbox: {
        navigateFallback: "/index.html",
      },
      devOptions: {
        enabled: false,
      },
      manifest: {
        name: "SmartMeal — Personalized Meal Plans",
        short_name: "SmartMeal",
        description:
          "Eat smarter with science‑backed, personalized meal plans and budget‑aware grocery lists.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#0ea5a0",
        theme_color: "#10b981",
        icons: [
          {
            src: "/placeholder.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: "/placeholder.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
        shortcuts: [
          { name: "Open Planner", url: "/planner" },
          { name: "Open Grocery", url: "/grocery" },
        ],
      },
      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
          handler: "NetworkFirst",
          options: {
            cacheName: "api-cache",
            networkTimeoutSeconds: 5,
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: ({ request }) => request.destination === "image",
          handler: "StaleWhileRevalidate",
          options: { cacheName: "images-cache" },
        },
        {
          urlPattern: ({ request }) =>
            ["style", "script", "font"].includes(request.destination),
          handler: "StaleWhileRevalidate",
          options: { cacheName: "assets-cache" },
        },
      ],
    }),
    expressPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
