interface EmptyStateProps {
  flowCount: number;
}

export function EmptyState({ flowCount }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-lg px-4">
        <svg
          className="w-16 h-16 mx-auto mb-6"
          style={{ color: '#1e293b' }}
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
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--fb-text-secondary)' }}>
          {flowCount > 0 ? "Select a flow" : "No flows found"}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--fb-text-muted)' }}>
          {flowCount > 0
            ? "Choose a flow from the sidebar to view its diagram."
            : "Create .flow.md or .flowchart.md files with mermaid diagrams to get started."}
        </p>
        {flowCount === 0 && (
          <div
            className="mt-8 rounded-xl p-5 text-left border"
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderColor: 'var(--fb-border)',
            }}
          >
            <p className="text-xs mb-3 font-medium" style={{ color: 'var(--fb-text-muted)' }}>
              Example: <code style={{ color: 'var(--fb-accent-violet)' }}>auth/login.flow.md</code>
            </p>
            <pre className="text-xs font-mono leading-relaxed whitespace-pre overflow-x-auto" style={{ color: 'var(--fb-text-secondary)' }}>
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
