/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */
import { clientsClaim } from "workbox-core";
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import {
  StaleWhileRevalidate,
  NetworkFirst,
  NetworkOnly,
  CacheFirst,
} from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { BackgroundSyncPlugin } from "workbox-background-sync";

declare let self: ServiceWorkerGlobalScope & { __WB_MANIFEST: any };

// Take control immediately
self.skipWaiting();
clientsClaim();

// Precache app shell and assets injected by VitePWA
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Enable navigation preload for faster SSR-like navigations
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      if ("navigationPreload" in self.registration) {
        // @ts-ignore
        await self.registration.navigationPreload.enable();
      }
    })(),
  );
});

// SPA navigation: serve index.html from precache
const handler = createHandlerBoundToURL("/index.html");
registerRoute(
  new NavigationRoute(handler, {
    denylist: [/^\/api\//],
  }),
);

// Image caching: fast load, background update
registerRoute(
  ({ request }) => request.destination === "image",
  new StaleWhileRevalidate({
    cacheName: "images-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 120,
        maxAgeSeconds: 60 * 60 * 24 * 7,
      }),
    ],
  }),
);

// Static assets: CSS/JS/Fonts
registerRoute(
  ({ request }) => ["style", "script", "font"].includes(request.destination),
  new StaleWhileRevalidate({ cacheName: "assets-cache" }),
);

// API: online-first for freshness
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 5,
  }),
);

// Background Sync for Logs and Grocery edits
const logsQueue = new BackgroundSyncPlugin("logs-queue", {
  maxRetentionTime: 24 * 60,
});
const groceryQueue = new BackgroundSyncPlugin("grocery-queue", {
  maxRetentionTime: 24 * 60,
});

registerRoute(
  ({ url, request }) =>
    url.pathname.startsWith("/api/logs") &&
    ["POST", "PUT", "PATCH"].includes(request.method),
  new NetworkOnly({ plugins: [logsQueue] }),
  "POST",
);
registerRoute(
  ({ url, request }) =>
    url.pathname.startsWith("/api/grocery") &&
    ["POST", "PUT", "PATCH"].includes(request.method),
  new NetworkOnly({ plugins: [groceryQueue] }),
  "POST",
);

// Debug: observe Background Sync events to verify replay
self.addEventListener("sync", (event: any) => {
  // @ts-ignore
  const tag = event?.tag || "";
  // eslint-disable-next-line no-console
  console.log("[sw] sync event:", tag);
});

// Offline fallback for images
self.addEventListener("fetch", (event: FetchEvent) => {
  const req = event.request;
  if (req.destination === "image") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(req);
        } catch {
          return caches.match("/placeholder.svg") as Promise<Response>;
        }
      })(),
    );
  }
});
