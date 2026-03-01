export interface FlowEntry {
  id: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  order: number;
  filePath: string;
  mermaidBlocks: string[];
}

export interface FlowbookData {
  flows: FlowEntry[];
}

export interface FlowbookPluginOptions {
  include?: string[];
  ignore?: string[];
  cwd?: string;
}
