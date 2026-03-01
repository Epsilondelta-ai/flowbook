import type { Plugin } from "vite";
import { discoverFlowFiles } from "./discovery";
import { parseFlowFile } from "./parser";
import type { FlowbookPluginOptions, FlowbookData } from "../types";

const VIRTUAL_MODULE_ID = "virtual:flowbook-data";
const RESOLVED_ID = "\0" + VIRTUAL_MODULE_ID;

export function flowbookPlugin(options: FlowbookPluginOptions = {}): Plugin {
  const cwd = options.cwd ?? process.cwd();

  async function loadFlows(): Promise<FlowbookData> {
    const files = await discoverFlowFiles({ ...options, cwd });
    const flows = files.map((f) => parseFlowFile(f, cwd));
    flows.sort((a, b) => {
      if (a.category !== b.category)
        return a.category.localeCompare(b.category);
      return a.order - b.order;
    });
    return { flows };
  }

  return {
    name: "flowbook",

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_ID;
    },

    async load(id) {
      if (id === RESOLVED_ID) {
        const data = await loadFlows();
        return `export default ${JSON.stringify(data)}`;
      }
    },

    handleHotUpdate({ file, server }) {
      if (file.endsWith(".flow.md") || file.endsWith(".flowchart.md")) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: "full-reload" });
        }
      }
    },
  };
}
