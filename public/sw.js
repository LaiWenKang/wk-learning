/*
 * WK Learning service worker — minimal offline support.
 * - App shell: network-first with cached copy as offline fallback.
 * - Pulse data (data/*.json): network-first, cached copy as offline fallback.
 * - Built assets are content-hashed by Vite, so cache-first is safe.
 *
 * Only successful (ok) responses are ever cached: during a Pages deploy
 * the CDN can briefly 404 brand-new hashed assets, and caching that
 * failure would poison the cache and blank the app permanently. A cached
 * non-ok response from an older worker version is deleted on sight.
 * Bumping CACHE discards every previous cache on activation.
 */

const CACHE = "wk-learning-v3";

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

/** Cache a response only if it is a real success. */
async function putIfOk(request, response) {
  if (response && response.ok) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
    await trimAssets();
  }
}

/** Read from cache, discarding any poisoned (non-ok) entry. */
async function cachedOk(request, options) {
  const hit = await caches.match(request, options);
  if (hit && !hit.ok) {
    const cache = await caches.open(CACHE);
    await cache.delete(request);
    return undefined;
  }
  return hit;
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
        .then(async (res) => {
          await putIfOk(request, res);
          return res;
        })
        .catch(() => cachedOk(request, { ignoreSearch: isNavigation })),
    );
    return;
  }

  // Static assets: cache-first, but a failed fetch is never cached and a
  // previously poisoned entry is dropped and refetched.
  event.respondWith(
    cachedOk(request).then(
      (cached) =>
        cached ??
        fetch(request).then(async (res) => {
          await putIfOk(request, res);
          return res;
        }),
    ),
  );
});
