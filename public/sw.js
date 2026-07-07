/*
 * Self-destructing service worker.
 *
 * Earlier versions cached built assets and, during a deploy, cached a
 * transient 404 for a brand-new hashed file — permanently blanking the
 * app until site data was cleared. For a personal, always-online,
 * local-first app the offline benefit is not worth that failure mode, so
 * the service worker is retired: this version clears every cache,
 * unregisters itself, and reloads any open windows. After it runs once,
 * the app is a plain, always-fresh page served straight from GitHub Pages.
 *
 * It deliberately has no fetch handler, so every request goes to the
 * network — no cache can ever be served, poisoned or otherwise.
 */

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch {
        /* best effort */
      }
      try {
        await self.registration.unregister();
      } catch {
        /* best effort */
      }
      try {
        const clients = await self.clients.matchAll({ type: "window" });
        for (const client of clients) {
          client.navigate(client.url);
        }
      } catch {
        /* best effort */
      }
    })(),
  );
});
