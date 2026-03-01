import { useMemo, useState } from "react";
import type { FlowEntry } from "../../types";

interface SidebarProps {
  flows: FlowEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function Sidebar({ flows, selectedId, onSelect }: SidebarProps) {
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set(),
  );

  const categories = useMemo(() => {
    const map = new Map<string, FlowEntry[]>();
    for (const flow of flows) {
      const cat = flow.category;
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(flow);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [flows]);

  function toggleCategory(cat: string) {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  return (
    <aside className="w-64 border-r border-zinc-800 overflow-y-auto shrink-0 bg-zinc-950/50">
      <nav className="p-3 space-y-1">
        {categories.map(([category, items]) => {
          const isCollapsed = collapsedCategories.has(category);

          return (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider hover:text-zinc-300 transition-colors"
              >
                <svg
                  className={`w-3 h-3 transition-transform ${isCollapsed ? "" : "rotate-90"}`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5l8 7-8 7z" />
                </svg>
                {category}
                <span className="ml-auto text-zinc-600 font-normal normal-case">
                  {items.length}
                </span>
              </button>
              {!isCollapsed && (
                <ul className="ml-2 space-y-0.5">
                  {items.map((flow) => (
                    <li key={flow.id}>
                      <button
                        onClick={() => onSelect(flow.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors truncate ${
                          selectedId === flow.id
                            ? "bg-violet-500/15 text-violet-300 font-medium"
                            : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                        }`}
                        title={flow.title}
                      >
                        {flow.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        {categories.length === 0 && (
          <p className="text-sm text-zinc-600 px-2 py-4 text-center">
            No flows match your search
          </p>
        )}
      </nav>
    </aside>
  );
}
