# Flowbook

> **English** | [한국어](./README.ko.md) | [简体中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (BR)](./README.pt-BR.md) | [Français](./README.fr.md) | [Русский](./README.ru.md) | [Deutsch](./README.de.md)

Storybook for flowcharts. Auto-discovers Mermaid diagram files from your codebase, organizes them by category, and renders them in a browsable viewer.

![Vite](https://img.shields.io/badge/vite-6.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-19.x-61DAFB?logo=react&logoColor=white)
![Mermaid](https://img.shields.io/badge/mermaid-11.x-FF3670?logo=mermaid&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6?logo=typescript&logoColor=white)

## Quick Start

```bash
# Initialize — adds scripts + example file
npx flowbook@latest init

# Start dev server
npm run flowbook
# → http://localhost:6200

# Build static site
npm run build-flowbook
# → flowbook-static/
```

## CLI

```
flowbook init                Set up Flowbook in your project
flowbook dev  [--port 6200]  Start the dev server
flowbook build [--out-dir d] Build a static site
```

### `flowbook init`

- Adds `"flowbook"` and `"build-flowbook"` scripts to your `package.json`
- Creates `flows/example.flow.md` as a starter template

### `flowbook dev`

Starts a Vite dev server at `http://localhost:6200` with HMR. Any `.flow.md` or `.flowchart.md` file changes are picked up instantly.

### `flowbook build`

Builds a static site to `flowbook-static/` (configurable via `--out-dir`). Deploy it anywhere.

## Writing Flow Files

Create a `.flow.md` (or `.flowchart.md`) file anywhere in your project:

````markdown
---
title: Login Flow
category: Authentication
tags: [auth, login, oauth]
order: 1
description: User authentication flow with OAuth2
---

```mermaid
flowchart TD
    A[User] --> B{Authenticated?}
    B -->|Yes| C[Dashboard]
    B -->|No| D[Login Page]
```
````

Flowbook automatically discovers the file and adds it to the viewer.

## Frontmatter Schema

| Field         | Type       | Required | Description                        |
|---------------|------------|----------|------------------------------------|
| `title`       | `string`   | No       | Display title (defaults to filename) |
| `category`    | `string`   | No       | Sidebar category (defaults to "Uncategorized") |
| `tags`        | `string[]` | No       | Filterable tags                    |
| `order`       | `number`   | No       | Sort order within category (default: 999) |
| `description` | `string`   | No       | Description shown in detail view   |

## File Discovery

Flowbook scans for these patterns by default:

```
**/*.flow.md
**/*.flowchart.md
```

Ignores `node_modules/`, `.git/`, and `dist/`.

## How It Works

```
.flow.md files ──→ Vite Plugin ──→ Virtual Module ──→ React Viewer
                    │                   │
                    ├─ fast-glob scan   ├─ export default { flows: [...] }
                    ├─ gray-matter      │
                    │  parse            └─ HMR on file change
                    └─ mermaid block
                       extraction
```

1. **Discovery** — `fast-glob` scans the project for `*.flow.md` / `*.flowchart.md`
2. **Parsing** — `gray-matter` extracts YAML frontmatter; regex extracts `` ```mermaid `` blocks
3. **Virtual Module** — Vite plugin serves parsed data as `virtual:flowbook-data`
4. **Rendering** — React app renders Mermaid diagrams via `mermaid.render()`
5. **HMR** — File changes invalidate the virtual module, triggering a reload

## Project Structure

```
src/
├── types.ts                    # Shared types (FlowEntry, FlowbookData)
├── node/
│   ├── cli.ts                  # CLI entry point (init, dev, build)
│   ├── server.ts               # Programmatic Vite server & build
│   ├── init.ts                 # Project initialization logic
│   ├── discovery.ts            # File scanner (fast-glob)
│   ├── parser.ts               # Frontmatter + mermaid extraction
│   └── plugin.ts               # Vite virtual module plugin
└── client/
    ├── index.html              # Entry HTML
    ├── main.tsx                # React entry
    ├── App.tsx                 # Layout with search + sidebar + viewer
    ├── vite-env.d.ts           # Virtual module type declarations
    ├── styles/globals.css      # Tailwind v4 + custom styles
    └── components/
        ├── Header.tsx          # Logo, search bar, flow count
        ├── Sidebar.tsx         # Collapsible category tree
        ├── MermaidRenderer.tsx # Mermaid diagram rendering
        ├── FlowView.tsx        # Single flow detail view
        └── EmptyState.tsx      # Empty state with guide
```

## Development (Contributing)

```bash
git clone https://github.com/Epsilondelta-ai/flowbook.git
cd flowbook
npm install

# Local dev (uses root vite.config.ts)
npm run dev

# Build CLI
npm run build

# Test CLI locally
node dist/cli.js dev
node dist/cli.js build
```

## Tech Stack

- **Vite** — Dev server with HMR
- **React 19** — UI
- **Mermaid 11** — Diagram rendering
- **Tailwind CSS v4** — Styling
- **gray-matter** — YAML frontmatter parsing
- **fast-glob** — File discovery
- **tsup** — CLI bundler
- **TypeScript** — Type safety

## License

MIT
