import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Standalone SPA build config for GitHub Pages (no SSR / no TanStack Start)
export default defineConfig({
  base: "/result-ace-app/",
  plugins: [tsConfigPaths({ projects: ["./tsconfig.json"] }), react(), tailwindcss()],
  build: {
    outDir: resolve(import.meta.dirname, "dist-gh-pages"),
    emptyOutDir: true,
  },
});
