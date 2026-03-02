import { useState, useMemo } from "react";
import data from "virtual:flowbook-data";
import { Sidebar } from "./components/Sidebar";
import { FlowView } from "./components/FlowView";
import { EmptyState } from "./components/EmptyState";

export function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFlows = useMemo(() => {
    if (!searchQuery) return data.flows;
    const q = searchQuery.toLowerCase();
    return data.flows.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q)) ||
        f.description.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const selectedFlow = useMemo(
    () => data.flows.find((f) => f.id === selectedId) ?? null,
    [selectedId],
  );

  return (
    <div className="h-screen flex items-center justify-center p-6" style={{ background: 'var(--fb-bg-outer)' }}>
      <div className="w-full max-w-6xl rounded-xl overflow-hidden shadow-2xl" style={{ background: 'var(--fb-bg-window)', border: '1px solid var(--fb-border)' }}>
        {/* macOS-style title bar */}
        <div className="flex items-center px-4 py-3 border-b" style={{ background: 'var(--fb-bg-titlebar)', borderColor: 'var(--fb-border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
          <span className="ml-4 text-sm font-mono" style={{ color: 'var(--fb-text-muted)' }}>
            flowbook — localhost:6200
          </span>
          <span className="ml-auto text-sm font-mono" style={{ color: 'var(--fb-text-muted)' }}>
            {data.flows.length} flows
          </span>
        </div>
        {/* Content area */}
        <div className="flex" style={{ height: '520px' }}>
          <Sidebar
            flows={filteredFlows}
            selectedId={selectedId}
            onSelect={setSelectedId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <main className="flex-1 overflow-auto" style={{ background: 'var(--fb-bg-content)' }}>
            {selectedFlow ? (
              <FlowView flow={selectedFlow} />
            ) : (
              <EmptyState flowCount={data.flows.length} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
