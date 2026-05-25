import { defineConfig } from "vitest/config";

// Minimal config: run unit tests under Node. App code is verified by `tsc` +
// `next build`; vitest covers the pure helper logic in lib/.
export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts", "**/*.test.tsx"],
  },
});
