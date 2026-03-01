import { useState, useMemo } from "react";
import data from "virtual:flowbook-data";
import { Sidebar } from "./components/Sidebar";
import { FlowView } from "./components/FlowView";
import { Header } from "./components/Header";
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
    <div className="h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        flowCount={data.flows.length}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          flows={filteredFlows}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <main className="flex-1 overflow-auto">
          {selectedFlow ? (
            <FlowView flow={selectedFlow} />
          ) : (
            <EmptyState flowCount={data.flows.length} />
          )}
        </main>
      </div>
    </div>
  );
}
