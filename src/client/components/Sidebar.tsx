import { useMemo, useState } from "react";
import type { FlowEntry } from "../../types";

interface SidebarProps {
  flows: FlowEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Sidebar({ flows, selectedId, onSelect, searchQuery, onSearchChange }: SidebarProps) {
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

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  function toggleCategory(category: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  return (
    <aside
      className="w-64 overflow-y-auto shrink-0 border-r flex flex-col"
      style={{
        background: 'var(--fb-bg-sidebar)',
        borderColor: 'var(--fb-border)',
      }}
    >
      {/* Search */}
      <div className="p-3 border-b" style={{ borderColor: 'var(--fb-border)' }}>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--fb-text-muted)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search flows..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--fb-text-primary)',
              border: '1px solid var(--fb-border)',
            }}
          />
        </div>
      </div>

      {/* Categories */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {categories.map(([category, items]) => {
          const isCollapsed = collapsed.has(category);
          return (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-1.5 px-2 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                style={{ color: 'var(--fb-text-muted)' }}
              >
                <svg
                  className="w-3 h-3 transition-transform"
                  style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="flex-1 text-left">{category}</span>
                <span
                  className="text-xs font-medium tabular-nums"
                  style={{ color: 'var(--fb-text-muted)', opacity: 0.7 }}
                >
                  {items.length}
                </span>
              </button>
              {!isCollapsed && (
                <div className="space-y-0.5 mt-0.5">
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
                          paddingLeft: '1.75rem',
                        }}
                      >
                        {flow.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {categories.length === 0 && (
          <p className="text-sm px-2 py-4 text-center" style={{ color: 'var(--fb-text-muted)' }}>
            No flows found
          </p>
        )}
      </nav>
    </aside>
  );
}
