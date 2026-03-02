import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";


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

  // 1. Install flowbook as devDependency
  const pm = detectPackageManager(cwd);
  const installCmd = getInstallCommand(pm);
  console.log(`  Installing flowbook via ${pm}...`);
  try {
    execSync(installCmd, { cwd, stdio: "ignore" });
    console.log("  ✓ Installed flowbook as a dev dependency");
  } catch {
    console.error(`  ✗ Failed to run '${installCmd}'. Please install manually.`);
  }

  // 2. Add scripts to package.json
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

  // 3. Create example flow file
  const flowsDir = resolve(cwd, "flows");
  const examplePath = resolve(flowsDir, "example.flow.md");

  if (!existsSync(examplePath)) {
    mkdirSync(flowsDir, { recursive: true });
    writeFileSync(examplePath, EXAMPLE_FLOW);
    console.log("  ✓ Created flows/example.flow.md");
  } else {
    console.log("  ✓ Example flow already exists");
  }

  // 4. Add flowbook-static to .gitignore
  const gitignorePath = resolve(cwd, ".gitignore");
  if (existsSync(gitignorePath)) {
    const gitignore = readFileSync(gitignorePath, "utf-8");
    if (!gitignore.includes("flowbook-static")) {
      writeFileSync(gitignorePath, gitignore.trimEnd() + "\nflowbook-static\n");
      console.log("  ✓ Added flowbook-static to .gitignore");
    }
  }

  const run = pm === "yarn" ? "yarn" : `${pm} run`;
  console.log("");
  console.log("  Next steps:");
  console.log(`    ${run} flowbook              Start the dev server`);
  console.log(`    ${run} build-flowbook         Build static site`);
  console.log(`    flowbook skill <agent> [-g]   Install AI skill & /flowbook command`);
  console.log("");
}

function detectPackageManager(cwd: string): "npm" | "yarn" | "pnpm" | "bun" {
  if (existsSync(resolve(cwd, "bun.lockb")) || existsSync(resolve(cwd, "bun.lock"))) return "bun";
  if (existsSync(resolve(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(resolve(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

function getInstallCommand(pm: string): string {
  switch (pm) {
    case "bun": return "bun add -D flowbook";
    case "pnpm": return "pnpm add -D flowbook";
    case "yarn": return "yarn add -D flowbook";
    default: return "npm install -D flowbook";
  }
}
