interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  flowCount: number;
}

export function Header({
  searchQuery,
  onSearchChange,
  flowCount,
}: HeaderProps) {
  return (
    <header className="h-14 border-b border-zinc-800 flex items-center px-4 gap-4 shrink-0 bg-zinc-950">
      <div className="flex items-center gap-2.5">
        <svg
          className="w-6 h-6 text-violet-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="8" y="14" width="7" height="7" rx="1" />
          <path d="M6.5 10v1.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V10" />
          <path d="M11.5 12.5V14" />
        </svg>
        <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
          Flowbook
        </h1>
        <span className="text-xs text-zinc-500 bg-zinc-800/80 px-2 py-0.5 rounded-full font-medium">
          {flowCount}
        </span>
      </div>
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search flows…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 transition-all"
        />
      </div>
    </header>
  );
}
