interface EmptyStateProps {
  flowCount: number;
}

export function EmptyState({ flowCount }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-lg px-4">
        <svg
          className="w-16 h-16 text-zinc-800 mx-auto mb-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="8" y="14" width="7" height="7" rx="1" />
          <path d="M6.5 10v1.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V10" />
          <path d="M11.5 12.5V14" />
        </svg>
        <h2 className="text-xl font-semibold text-zinc-400 mb-2">
          {flowCount > 0 ? "Select a flow" : "No flows found"}
        </h2>
        <p className="text-zinc-600 text-sm leading-relaxed">
          {flowCount > 0
            ? "Choose a flow from the sidebar to view its diagram."
            : "Create .flow.md or .flowchart.md files with mermaid diagrams to get started."}
        </p>
        {flowCount === 0 && (
          <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-left">
            <p className="text-xs text-zinc-500 mb-3 font-medium">
              Example: <code>auth/login.flow.md</code>
            </p>
            <pre className="text-xs text-zinc-400 font-mono leading-relaxed whitespace-pre overflow-x-auto">
              {`---
title: Login Flow
category: Authentication
tags: [auth, login]
description: User login process
---

\`\`\`mermaid
flowchart TD
    A[User] --> B{Authenticated?}
    B -->|Yes| C[Dashboard]
    B -->|No| D[Login Page]
\`\`\``}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
