import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

// Register the service worker for basic offline support (production only —
// it would interfere with Vite's dev server).
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  // If an updated worker takes over mid-session (e.g. right after a
  // deploy, or after recovering from a bad cache), reload once so the
  // page runs against the fresh worker instead of a stale state.
  const hadController = !!navigator.serviceWorker.controller;
  let refreshed = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController || refreshed) return;
    refreshed = true;
    window.location.reload();
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker
      // updateViaCache: "none" makes the browser bypass the HTTP cache
      // when checking sw.js for updates — without it, GitHub Pages'
      // 10-minute max-age delays every worker update (and every fix).
      .register(`${import.meta.env.BASE_URL}sw.js`, { updateViaCache: "none" })
      .then((reg) => reg.update().catch(() => {}))
      .catch((err) => console.warn("SW registration failed", err));
  });
}
