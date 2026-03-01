import { createServer, build, type InlineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { flowbookPlugin } from "./plugin";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getClientDir(): string {
  // dist/cli.js  →  ../src/client
  return resolve(__dirname, "..", "src", "client");
}

function createConfig(options: {
  port?: number;
  cwd?: string;
  outDir?: string;
}): InlineConfig {
  const cwd = options.cwd ?? process.cwd();
  const clientDir = getClientDir();

  return {
    configFile: false,
    root: clientDir,
    plugins: [
      react(),
      tailwindcss(),
      flowbookPlugin({
        include: ["**/*.flow.md", "**/*.flowchart.md"],
        ignore: ["node_modules/**", ".git/**", "dist/**"],
        cwd,
      }),
    ],
    server: {
      port: options.port ?? 6200,
    },
    build: {
      outDir: resolve(cwd, options.outDir ?? "flowbook-static"),
      emptyOutDir: true,
    },
  };
}

export async function startDevServer(options: { port?: number }) {
  const config = createConfig({ port: options.port });
  const server = await createServer(config);
  await server.listen();
  server.printUrls();
}

export async function buildStatic(options: { outDir?: string }) {
  const config = createConfig({ outDir: options.outDir });
  await build(config);
  console.log(`\n  Static site built to ${options.outDir ?? "flowbook-static"}/\n`);
}
