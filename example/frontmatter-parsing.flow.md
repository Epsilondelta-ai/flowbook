---
title: Frontmatter Parsing
category: Core Pipeline
tags: [parser, gray-matter, frontmatter, mermaid]
order: 2
description: How each .flow.md file is parsed into structured FlowEntry data
---

```mermaid
flowchart TD
    A[Raw .flow.md file path] --> B["`**parseFlowFile(filePath, cwd)**`"]
    B --> C[Read file contents via fs.readFileSync]
    C --> D["`**gray-matter(content)**
    Extracts YAML frontmatter`"]
    D --> E[Extract frontmatter fields]
    E --> F{title provided?}
    F -->|Yes| G[Use title as-is]
    F -->|No| H[Derive from filename]
    E --> I{category provided?}
    I -->|Yes| J[Use category as-is]
    I -->|No| K["Default: 'Uncategorized'"]
    D --> L["`**Regex extraction**
    /\`\`\`mermaid([\\s\\S]*?)\`\`\`/g`"]
    L --> M{Mermaid blocks found?}
    M -->|Yes| N[Collect all diagram strings]
    M -->|No| O[Empty diagrams array]
    G --> P["`**Build FlowEntry**
    { id, title, category, tags,
      order, description, diagrams,
      filePath }`"]
    J --> P
    K --> P
    H --> P
    N --> P
    O --> P
    P --> Q[Return to virtual module]

    style B fill:#6366f1,color:#fff
    style D fill:#8b5cf6,color:#fff
    style L fill:#a78bfa,color:#fff
    style P fill:#10b981,color:#fff
```
