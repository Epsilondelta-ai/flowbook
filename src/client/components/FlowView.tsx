import type { FlowEntry } from "../../types";
import { MermaidRenderer } from "./MermaidRenderer";

interface FlowViewProps {
  flow: FlowEntry;
}

export function FlowView({ flow }: FlowViewProps) {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Title + Category badge */}
      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--fb-text-primary)' }}>
          {flow.title}
        </h1>
        <span
          className="px-2.5 py-0.5 rounded-md text-xs font-medium"
          style={{
            background: 'rgba(99, 102, 241, 0.12)',
            color: '#818cf8',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          {flow.category}
        </span>
      </div>

      {/* Description */}
      {flow.description && (
        <p className="text-sm mb-4" style={{ color: 'var(--fb-text-secondary)' }}>
          {flow.description}
        </p>
      )}

      {/* Tags */}
      {flow.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {flow.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc',
                border: '1px solid rgba(99, 102, 241, 0.25)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

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
