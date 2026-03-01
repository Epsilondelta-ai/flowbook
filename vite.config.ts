import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { flowbookPlugin } from "./src/node/plugin";

export default defineConfig({
  root: "src/client",
  plugins: [
    react(),
    tailwindcss(),
    flowbookPlugin({
      include: ["**/*.flow.md", "**/*.flowchart.md"],
      ignore: ["node_modules/**", ".git/**", "dist/**"],
      cwd: process.cwd(),
    }),
  ],
  server: {
    port: 6200,
  },
});
