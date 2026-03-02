import { useEffect, useRef, useState, useId, useCallback } from "react";
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
      primaryColor: "#4f46e5",
      primaryTextColor: "#e2e8f0",
      primaryBorderColor: "#6366f1",
      secondaryColor: "#1e293b",
      secondaryTextColor: "#cbd5e1",
      secondaryBorderColor: "#334155",
      tertiaryColor: "#1e2740",
      tertiaryTextColor: "#94a3b8",
      tertiaryBorderColor: "#334155",
      lineColor: "#6366f1",
      textColor: "#e2e8f0",
      nodeTextColor: "#e2e8f0",
      nodeBorder: "#6366f1",
      clusterBkg: "#0f172a",
      clusterBorder: "#1e293b",
      edgeLabelBackground: "#131a2b",
    },
  });
  initialized = true;
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;
const ZOOM_SPEED = 0.002;

/**
 * Post-process SVG to add CSS classes based on node shape type.
 * - polygon → node-decision (diamond, hexagon, etc.)
 * - 2+ rects → node-subroutine (double-bordered)
 * - path with arc commands → node-database (cylinder)
 * - circle → node-circle
 */
function classifyNodes(svgString: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svg = doc.documentElement;

    svg.querySelectorAll(".node").forEach((node) => {
      if (node.querySelector("polygon")) {
        node.classList.add("node-decision");
      } else if (node.querySelectorAll("rect").length >= 2) {
        node.classList.add("node-subroutine");
      } else if (node.querySelector("circle")) {
        node.classList.add("node-circle");
      } else {
        const paths = node.querySelectorAll("path");
        let hasArcs = false;
        paths.forEach((p) => {
          const d = p.getAttribute("d") || "";
          if (/[Aa]\s*[\d.]/.test(d)) hasArcs = true;
        });
        if (hasArcs) {
          node.classList.add("node-database");
        }
      }
    });

    return new XMLSerializer().serializeToString(svg);
  } catch {
    return svgString;
  }
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

  // Zoom & pan state
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragOrigin = useRef({ x: 0, y: 0, px: 0, py: 0 });

  // Render mermaid diagram
  useEffect(() => {
    ensureInit();
    let cancelled = false;

    mermaid
      .render(safeId, code)
      .then(({ svg: rendered }) => {
        if (!cancelled) {
          setSvg(classifyNodes(rendered));
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

  // Wheel zoom (non-passive to allow preventDefault)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !svg) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      setScale((prev) => {
        const next = Math.min(
          MAX_ZOOM,
          Math.max(MIN_ZOOM, prev * (1 - e.deltaY * ZOOM_SPEED)),
        );
        const ratio = next / prev;
        setPos((p) => ({
          x: cx - (cx - p.x) * ratio,
          y: cy - (cy - p.y) * ratio,
        }));
        return next;
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [svg]);

  // Mouse drag to pan
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      dragging.current = true;
      dragOrigin.current = {
        x: e.clientX,
        y: e.clientY,
        px: pos.x,
        py: pos.y,
      };
    },
    [pos],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({
        x: dragOrigin.current.px + (e.clientX - dragOrigin.current.x),
        y: dragOrigin.current.py + (e.clientY - dragOrigin.current.y),
      });
    };
    const onUp = () => {
      dragging.current = false;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  // Double-click to reset
  const onDoubleClick = useCallback(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, []);

  if (error) {
    return (
      <div
        className={`rounded-lg p-4 border ${className ?? ""}`}
        style={{
          background: "rgba(239, 68, 68, 0.08)",
          borderColor: "rgba(239, 68, 68, 0.2)",
        }}
      >
        <p className="text-sm font-medium mb-2" style={{ color: "#f87171" }}>
          Render error
        </p>
        <p
          className="text-xs font-mono mb-3"
          style={{ color: "rgba(248, 113, 113, 0.7)" }}
        >
          {error}
        </p>
        <pre
          className="text-xs overflow-x-auto whitespace-pre-wrap"
          style={{ color: "var(--fb-text-muted)" }}
        >
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
        <div
          className="w-5 h-5 border-2 rounded-full animate-spin"
          style={{
            borderColor: "rgba(99, 102, 241, 0.3)",
            borderTopColor: "#6366f1",
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`flowbook-zoom-container ${className ?? ""}`}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <div
        className="flowbook-mermaid"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          transformOrigin: "0 0",
        }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
