import { useEffect, useRef, useState, useId } from "react";
import mermaid from "mermaid";

let initialized = false;

function ensureInit() {
  if (initialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    securityLevel: "loose",
    fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
    themeVariables: {
      darkMode: true,
      background: "#131a2b",
      mainBkg: "#1e2740",
      primaryColor: "#6366f1",
      primaryTextColor: "#e2e8f0",
      primaryBorderColor: "#4f46e5",
      secondaryColor: "#1e293b",
      secondaryTextColor: "#cbd5e1",
      secondaryBorderColor: "#334155",
      tertiaryColor: "#1e2740",
      tertiaryTextColor: "#94a3b8",
      tertiaryBorderColor: "#334155",
      lineColor: "#6366f1",
      textColor: "#e2e8f0",
      nodeTextColor: "#e2e8f0",
      nodeBorder: "#4f46e5",
      clusterBkg: "#0f172a",
      clusterBorder: "#1e293b",
      edgeLabelBackground: "#131a2b",
    },
  });
  initialized = true;
}

interface Props {
  code: string;
  className?: string;
}

export function MermaidRenderer({ code, className }: Props) {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const safeId = "mermaid" + rawId.replace(/:/g, "-");

  useEffect(() => {
    ensureInit();

    let cancelled = false;

    mermaid
      .render(safeId, code)
      .then(({ svg: rendered }) => {
        if (!cancelled) {
          setSvg(rendered);
          setError("");
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message ?? "Failed to render diagram");
          setSvg("");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code, safeId]);

  if (error) {
    return (
      <div
        className={`rounded-lg p-4 border ${className ?? ""}`}
        style={{
          background: 'rgba(239, 68, 68, 0.08)',
          borderColor: 'rgba(239, 68, 68, 0.2)',
        }}
      >
        <p className="text-sm font-medium mb-2" style={{ color: '#f87171' }}>
          Render error
        </p>
        <p className="text-xs font-mono mb-3" style={{ color: 'rgba(248, 113, 113, 0.7)' }}>{error}</p>
        <pre className="text-xs overflow-x-auto whitespace-pre-wrap" style={{ color: 'var(--fb-text-muted)' }}>
          {code}
        </pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div
        className={`flex items-center justify-center py-12 ${className ?? ""}`}
      >
        <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99, 102, 241, 0.3)', borderTopColor: '#6366f1' }} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`flowbook-mermaid overflow-x-auto ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
