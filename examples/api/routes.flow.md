---
title: API Routes
category: API Routes
tags: [api, rest, routes]
order: 1
description: REST API endpoint routing and middleware chain
---

```mermaid
flowchart TD
    A[Request] --> B[Router]
    B --> C{Auth Middleware}
    C -->|Pass| D[Controller]
    C -->|Fail| E[401 Response]
    D --> F[Service Layer]
    F --> G[Response]
```
