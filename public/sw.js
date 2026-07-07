/*
 * WK Learning service worker — minimal offline support.
 * - App shell: cache-first with background refresh on navigation.
 * - Pulse data (data/*.json): network-first, cached copy as offline fallback.
 * - Built assets are content-hashed by Vite, so cache-first is safe.
 */

const CACHE = "wk-learning-v2";

// Hashed build assets accumulate across deploys; keep only the newest few.
const MAX_ASSET_ENTRIES = 24;

async function trimAssets() {
  const cache = await caches.open(CACHE);
  const keys = await cache.keys();
  const assets = keys.filter((req) => new URL(req.url).pathname.includes("/assets/"));
  // Cache keys are ordered oldest-first; drop from the front.
  for (const req of assets.slice(0, Math.max(0, assets.length - MAX_ASSET_ENTRIES))) {
    await cache.delete(req);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isData = url.pathname.includes("/data/");
  const isNavigation = request.mode === "navigate";

  if (isData || isNavigation) {
    // Network-first: always try for fresh content, fall back to cache offline.
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request, { ignoreSearch: isNavigation })),
    );
    return;
  }

  // Static assets: cache-first.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ??
        fetch(request).then((res) => {
          const copy = res.clone();
          caches
            .open(CACHE)
            .then((c) => c.put(request, copy))
            .then(trimAssets);
          return res;
        }),
    ),
  );
});
