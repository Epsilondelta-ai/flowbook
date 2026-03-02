---
title: ETL Pipeline
category: Data Pipeline
tags: [data, etl, pipeline]
order: 1
description: Extract-Transform-Load data processing pipeline
---

```mermaid
flowchart TD
    A[(Source DB)] --> B[Extract]
    B --> C[Transform]
    C --> D{Valid?}
    D -->|Yes| E[Load]
    D -->|No| F[Error Queue]
    E --> G[(Data Warehouse)]
```
