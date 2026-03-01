import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/node/cli.ts"],
  format: ["esm"],
  target: "node18",
  clean: true,
  outDir: "dist",
  splitting: false,
  banner: { js: "#!/usr/bin/env node" },
  external: ["vite", "@vitejs/plugin-react", "@tailwindcss/vite"],
});
