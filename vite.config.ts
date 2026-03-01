import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { flowbookPlugin } from "./src/node/plugin";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    flowbookPlugin({
      include: ["**/*.flow.md", "**/*.flowchart.md"],
      ignore: ["node_modules/**", ".git/**", "dist/**"],
    }),
  ],
  server: {
    port: 6200,
  },
});
