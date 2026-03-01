import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const EXAMPLE_FLOW = `---
title: Example Flow
category: Getting Started
tags: [example]
order: 1
description: An example flowchart to get you started
---

\`\`\`mermaid
flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action A]
    B -->|No| D[Action B]
    C --> E[End]
    D --> E
\`\`\`
`;

export async function initFlowbook() {
  const cwd = process.cwd();
  const pkgPath = resolve(cwd, "package.json");

  if (!existsSync(pkgPath)) {
    console.error("  No package.json found. Run 'npm init' first.");
    process.exit(1);
  }

  // 1. Add scripts to package.json
  const raw = readFileSync(pkgPath, "utf-8");
  const pkg = JSON.parse(raw);
  pkg.scripts = pkg.scripts ?? {};

  let scriptsAdded = false;

  if (!pkg.scripts.flowbook) {
    pkg.scripts.flowbook = "flowbook dev";
    scriptsAdded = true;
  }
  if (!pkg.scripts["build-flowbook"]) {
    pkg.scripts["build-flowbook"] = "flowbook build";
    scriptsAdded = true;
  }

  if (scriptsAdded) {
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    console.log('  ✓ Added "flowbook" and "build-flowbook" scripts to package.json');
  } else {
    console.log("  ✓ Scripts already exist in package.json");
  }

  // 2. Create example flow file
  const flowsDir = resolve(cwd, "flows");
  const examplePath = resolve(flowsDir, "example.flow.md");

  if (!existsSync(examplePath)) {
    mkdirSync(flowsDir, { recursive: true });
    writeFileSync(examplePath, EXAMPLE_FLOW);
    console.log("  ✓ Created flows/example.flow.md");
  } else {
    console.log("  ✓ Example flow already exists");
  }

  console.log("");
  console.log("  Next steps:");
  console.log("    npm run flowbook       Start the dev server");
  console.log("    npm run build-flowbook  Build static site");
  console.log("");
}
