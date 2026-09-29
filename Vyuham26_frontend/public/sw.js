/**
 * VYUHAM'26 Offline Service Worker
 * Caches core shell, schedule, events, and ticket assets for seamless campus offline access.
 */

const CACHE_NAME = "vyuham26-v1";
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/VYUHAM26_logo.svg",
  "/logo-original.png"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("Pre-caching incomplete, will cache on demand:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network-First with Cache Fallback for navigation, Stale-While-Revalidate for static assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore cross-origin non-GET requests
  if (request.method !== "GET") return;

  // For HTML navigation requests: Network first, fall back to cached index.html
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match("/index.html") || caches.match("/");
          });
        })
    );
    return;
  }

  // For static assets: Cache first, then network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
          return networkResponse;
        }
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        return networkResponse;
      }).catch(() => {
        // Offline fallback - return valid Response instead of null to prevent TypeError
        return new Response("", { status: 503, statusText: "Offline Service Unavailable" });
      });
    })
  );
});
