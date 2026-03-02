---
title: State Management
category: State Management
tags: [state, store, redux]
order: 1
description: Application state management flow
---

```mermaid
flowchart TD
    A[Component] --> B[Dispatch Action]
    B --> C[Middleware]
    C --> D[Reducer]
    D --> E[Store Update]
    E --> F[Re-render]
    F --> A
```
