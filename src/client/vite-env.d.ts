/// <reference types="vite/client" />

declare module "virtual:flowbook-data" {
  interface FlowEntry {
    id: string;
    title: string;
    category: string;
    tags: string[];
    description: string;
    order: number;
    filePath: string;
    mermaidBlocks: string[];
  }

  interface FlowbookData {
    flows: FlowEntry[];
  }

  const data: FlowbookData;
  export default data;
}
