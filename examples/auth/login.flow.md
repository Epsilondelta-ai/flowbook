---
title: Login Flow
category: Authentication
tags: [auth, login, oauth]
order: 1
description: User authentication flow with session management
---

```mermaid
flowchart TD
    A[User] --> B{Auth?}
    B -->|Yes| C[Dashboard]
    B -->|No| D[Login]
    B --> E[[API Call]]
    B --> F[[Cache]]

    classDef success fill:#2d5a3f,stroke:#3d7a4f,color:#a7f3d0
    classDef danger fill:#5c2040,stroke:#7a3d5c,color:#fca5a5
    class C success
    class D danger
```
