import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  base: "hostr-portal",
  plugins: [svelte()],
  build: {
    target: "esnext",
  },
});
