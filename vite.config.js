import { defineConfig } from "vite";

// Relative base so the build works on GitHub Pages project sites
// (e.g. https://watasiwa-art.github.io/<repo>/) as well as root domains.
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
