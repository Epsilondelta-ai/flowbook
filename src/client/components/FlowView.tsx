import type { FlowEntry } from "../../types";
import { MermaidRenderer } from "./MermaidRenderer";

interface FlowViewProps {
  flow: FlowEntry;
}

export function FlowView({ flow }: FlowViewProps) {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Diagrams */}
      <div className="space-y-6">
        {flow.mermaidBlocks.map((block, i) => (
          <div
            key={i}
            className="flex items-center justify-center min-h-[400px]"
          >
            <MermaidRenderer code={block} />
          </div>
        ))}

        {flow.mermaidBlocks.length === 0 && (
          <div
            className="rounded-xl p-12 text-center border"
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderColor: 'var(--fb-border)',
            }}
          >
            <p style={{ color: 'var(--fb-text-muted)' }}>
              No mermaid diagrams found in this file.
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--fb-text-muted)' }}>
              Add a <code style={{ color: 'var(--fb-accent-violet)' }}>```mermaid</code> code
              block to see it rendered here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
