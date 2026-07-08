import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./styles/global.css";

// Signal to the in-HTML boot guard that the bundle executed. If this never
// runs, the guard knows the failure was loading the bundle (cache/CDN/
// network), not a code error, and reloads with a cache-buster.
(window as unknown as { __wkLoaded?: boolean }).__wkLoaded = true;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

// The service worker has been retired (it could cache a transient deploy
// 404 and blank the app). On every load, proactively unregister any worker
// still installed from an earlier version and clear its caches, so the app
// always runs fresh from the network. This never re-registers a worker.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((regs) => regs.forEach((reg) => reg.unregister()))
    .catch(() => {});
  if (typeof caches !== "undefined") {
    caches
      .keys()
      .then((keys) => keys.forEach((k) => caches.delete(k)))
      .catch(() => {});
  }
}
