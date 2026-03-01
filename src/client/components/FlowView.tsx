import type { FlowEntry } from "../../types";
import { MermaidRenderer } from "./MermaidRenderer";

interface FlowViewProps {
  flow: FlowEntry;
}

export function FlowView({ flow }: FlowViewProps) {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs font-medium text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded-full">
            {flow.category}
          </span>
          {flow.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-zinc-50 tracking-tight">
          {flow.title}
        </h2>
        {flow.description && (
          <p className="mt-2 text-zinc-400 leading-relaxed">
            {flow.description}
          </p>
        )}
        <p className="mt-2 text-xs text-zinc-600 font-mono">{flow.filePath}</p>
      </div>

      {/* Diagrams */}
      <div className="space-y-6">
        {flow.mermaidBlocks.map((block, i) => (
          <div
            key={i}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm"
          >
            <MermaidRenderer code={block} />
          </div>
        ))}

        {flow.mermaidBlocks.length === 0 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
            <p className="text-zinc-500">
              No mermaid diagrams found in this file.
            </p>
            <p className="text-zinc-600 text-sm mt-1">
              Add a <code className="text-violet-400">```mermaid</code> code
              block to see it rendered here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
