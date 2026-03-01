import fg from "fast-glob";
import type { FlowbookPluginOptions } from "../types";

export async function discoverFlowFiles(
  options: FlowbookPluginOptions,
): Promise<string[]> {
  const patterns = options.include ?? ["**/*.flow.md", "**/*.flowchart.md"];
  const ignore = options.ignore ?? [
    "node_modules/**",
    ".git/**",
    "dist/**",
  ];
  const cwd = options.cwd ?? process.cwd();

  return fg(patterns, { cwd, ignore, absolute: true });
}
