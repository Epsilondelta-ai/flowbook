import { initFlowbook } from "./init";
import { startDevServer, buildStatic } from "./server";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "init":
      await initFlowbook();
      break;

    case "dev": {
      const port = Number(getFlag(args, "--port", "6200"));
      await startDevServer({ port });
      break;
    }

    case "build": {
      const outDir = String(getFlag(args, "--out-dir", "flowbook-static"));
      await buildStatic({ outDir });
      break;
    }

    default:
      printUsage();
      break;
  }
}

function getFlag(
  args: string[],
  flag: string,
  fallback: string,
): string {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return fallback;
  return args[idx + 1];
}

function printUsage() {
  console.log(`
  flowbook — Storybook for flowcharts

  Usage:
    flowbook init                Set up Flowbook in your project
    flowbook dev  [--port 6200]  Start the dev server
    flowbook build [--out-dir d] Build a static site

  Options:
    --port <number>    Dev server port (default: 6200)
    --out-dir <path>   Build output directory (default: flowbook-static)
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
