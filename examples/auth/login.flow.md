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
    B --> E[API Call]
    B --> F[Cache]
```
