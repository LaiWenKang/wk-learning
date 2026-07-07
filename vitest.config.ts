import { defineConfig } from "vitest/config";

// Pure-logic tests run in a Node environment (no DOM needed). Component
// behaviour is covered by the Playwright smoke runs.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
  },
});
