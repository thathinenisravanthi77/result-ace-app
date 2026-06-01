import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Standalone SPA build config for Vercel (no SSR / no TanStack Start)
export default defineConfig({
  base: "/",
  plugins: [tsConfigPaths({ projects: ["./tsconfig.json"] }), react(), tailwindcss()],
  build: {
    outDir: resolve(import.meta.dirname, "dist-vercel"),
    emptyOutDir: true,
  },
});
