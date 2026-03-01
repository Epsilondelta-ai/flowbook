import { useEffect, useRef, useState, useId } from "react";
import mermaid from "mermaid";

let initialized = false;

function ensureInit() {
  if (initialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    securityLevel: "loose",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
    themeVariables: {
      darkMode: true,
      background: "#18181b",
      mainBkg: "#27272a",
      primaryColor: "#7c3aed",
      primaryTextColor: "#f4f4f5",
      primaryBorderColor: "#6d28d9",
      secondaryColor: "#3f3f46",
      secondaryTextColor: "#d4d4d8",
      secondaryBorderColor: "#52525b",
      tertiaryColor: "#27272a",
      tertiaryTextColor: "#a1a1aa",
      tertiaryBorderColor: "#3f3f46",
      lineColor: "#71717a",
      textColor: "#e4e4e7",
      nodeTextColor: "#f4f4f5",
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
        className={`bg-red-500/10 border border-red-500/20 rounded-lg p-4 ${className ?? ""}`}
      >
        <p className="text-red-400 text-sm font-medium mb-2">
          Render error
        </p>
        <p className="text-red-300/70 text-xs font-mono mb-3">{error}</p>
        <pre className="text-xs text-zinc-500 overflow-x-auto whitespace-pre-wrap">
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
        <div className="w-5 h-5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
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
