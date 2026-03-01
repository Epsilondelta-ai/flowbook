import matter from "gray-matter";
import { readFileSync } from "node:fs";
import { relative } from "node:path";
import type { FlowEntry } from "../types";

const MERMAID_BLOCK_RE = /```mermaid\n([\s\S]*?)```/g;

export function parseFlowFile(filePath: string, cwd: string): FlowEntry {
  const raw = readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const mermaidBlocks: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = MERMAID_BLOCK_RE.exec(content)) !== null) {
    mermaidBlocks.push(match[1].trim());
  }
  // Reset regex lastIndex for next call
  MERMAID_BLOCK_RE.lastIndex = 0;

  const relPath = relative(cwd, filePath);
  const id = relPath
    .replace(/[/\\]/g, "-")
    .replace(/\.flow(chart)?\.md$/, "");

  const fileName = relPath
    .replace(/\.flow(chart)?\.md$/, "")
    .split("/")
    .pop();

  return {
    id,
    title: typeof data.title === "string" ? data.title : fileName ?? "Untitled",
    category:
      typeof data.category === "string" ? data.category : "Uncategorized",
    tags: Array.isArray(data.tags) ? data.tags : [],
    description: typeof data.description === "string" ? data.description : "",
    order: typeof data.order === "number" ? data.order : 999,
    filePath: relPath,
    mermaidBlocks,
  };
}
