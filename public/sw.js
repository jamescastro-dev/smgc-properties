// Minimal service worker for the Broker Shella admin PWA.
// Purpose: make the app installable + show a graceful screen when offline.
// It deliberately does NOT cache Supabase (auth/REST) or Next data requests, so
// the admin never displays stale leads or listings — those always hit the network.

const CACHE = "shella-admin-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add(OFFLINE_URL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only intercept top-level page navigations. Everything else (Supabase calls,
  // static assets, images) goes straight to the network.
  if (request.mode !== "navigate") return;

  event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
});
