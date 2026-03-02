import { useMemo } from "react";
import type { FlowEntry } from "../../types";

interface SidebarProps {
  flows: FlowEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function Sidebar({ flows, selectedId, onSelect }: SidebarProps) {
  const categories = useMemo(() => {
    const map = new Map<string, FlowEntry[]>();
    for (const flow of flows) {
      const cat = flow.category;
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(flow);
    }
    for (const items of map.values()) {
      items.sort((a, b) => a.order - b.order);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [flows]);

  return (
    <aside
      className="w-64 overflow-y-auto shrink-0 border-r"
      style={{
        background: 'var(--fb-bg-sidebar)',
        borderColor: 'var(--fb-border)',
      }}
    >
      <nav className="p-5 space-y-4">
        {categories.map(([category, items]) => (
          <div key={category}>
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-2 px-2"
              style={{ color: 'var(--fb-text-muted)' }}
            >
              {category}
            </h3>
            <div className="space-y-0.5">
              {items.map((flow) => {
                const isActive = selectedId === flow.id;
                return (
                  <button
                    key={flow.id}
                    onClick={() => onSelect(flow.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                      isActive ? 'font-medium' : 'hover:bg-white/5'
                    }`}
                    style={{
                      color: isActive ? 'var(--fb-accent-green)' : 'var(--fb-text-secondary)',
                      background: isActive ? 'rgba(74, 222, 128, 0.08)' : undefined,
                    }}
                  >
                    {flow.title}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm px-2 py-4 text-center" style={{ color: 'var(--fb-text-muted)' }}>
            No flows found
          </p>
        )}
      </nav>
    </aside>
  );
}
