---
title: Password Reset
category: Authentication
tags: [auth, password, email, reset]
order: 3
description: Forgot password flow — email verification, token validation, and password update
---

```mermaid
flowchart TD
    A([POST /auth/forgot-password]) --> B[/Email Input/]
    B --> C[(Find User by Email)]
    C -->|Not Found| D[\200 OK]
    C -->|Found| E[Generate Reset Token]
    E --> F[(Store Token with Expiry)]
    F --> G[[Send Reset Email]]
    G --> H[/User Clicks Link/]
    H --> I([POST /auth/reset-password])
    I --> J{{"Validate Token & Expiry"}}
    J -->|Expired| K[\400 Token Expired/]
    J -->|Valid| L{{Check Password Strength}}
    L -->|Weak| M[\400 Weak Password/]
    L -->|Strong| N[(Update Password Hash)]
    N --> O[Invalidate All Sessions]
    O --> P[\200 Password Updated/]

    classDef entry fill:#6366f1,stroke:#818cf8,color:#fff
    classDef ui fill:#06b6d4,stroke:#22d3ee,color:#fff
    classDef data fill:#3b82f6,stroke:#60a5fa,color:#fff
    classDef external fill:#8b5cf6,stroke:#a78bfa,color:#fff
    classDef validation fill:#f59e0b,stroke:#fbbf24,color:#000
    classDef error fill:#ef4444,stroke:#f87171,color:#fff
    classDef success fill:#10b981,stroke:#34d399,color:#fff

    class A,I entry
    class B,H ui
    class C,F,N data
    class G external
    class J,L validation
    class K,M error
    class D,E,O,P success
```
