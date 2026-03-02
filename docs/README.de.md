# Flowbook

> **[English](../README.md)** | [한국어](./README.ko.md) | [简体中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (BR)](./README.pt-BR.md) | [Français](./README.fr.md) | [Русский](./README.ru.md) | **Deutsch**

Storybook für Flussdiagramme. Erkennt automatisch Mermaid-Diagrammdateien in Ihrer Codebasis, organisiert sie nach Kategorien und rendert sie in einem browserbaren Viewer.

![Vite](https://img.shields.io/badge/vite-6.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-19.x-61DAFB?logo=react&logoColor=white)
![Mermaid](https://img.shields.io/badge/mermaid-11.x-FF3670?logo=mermaid&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6?logo=typescript&logoColor=white)

## Schnellstart

```bash
# Initialisieren — fügt Skripte + Beispieldatei hinzu
npx flowbook@latest init

# Entwicklungsserver starten
npm run flowbook
# → http://localhost:6200

# Statische Seite erstellen
npm run build-flowbook
# → flowbook-static/
```

## CLI

```
flowbook init                Flowbook im Projekt einrichten
flowbook dev  [--port 6200]  Entwicklungsserver starten
flowbook build [--out-dir d] Statische Seite erstellen
flowbook skill <agent> [-g]  KI-Agent-Fähigkeit & /flowbook-Befehl installieren

### `flowbook init`

- Fügt die Skripte `"flowbook"` und `"build-flowbook"` zu Ihrer `package.json` hinzu
- Erstellt `flows/example.flow.md` als Startvorlage
- Installiert KI-Agent-Fähigkeiten in alle unterstützten Agent-Verzeichnisse

### `flowbook dev`

Startet einen Vite-Entwicklungsserver unter `http://localhost:6200` mit HMR. Änderungen an `.flow.md`- oder `.flowchart.md`-Dateien werden sofort übernommen.

### `flowbook build`

Erstellt eine statische Seite in `flowbook-static/` (konfigurierbar über `--out-dir`). Überall deploybar.

## Flow-Dateien Erstellen

Erstellen Sie eine `.flow.md`- (oder `.flowchart.md`-) Datei an beliebiger Stelle in Ihrem Projekt:

````markdown
---
title: Login-Ablauf
category: Authentifizierung
tags: [auth, login, oauth]
order: 1
description: Benutzer-Authentifizierungsablauf mit OAuth2
---

```mermaid
flowchart TD
    A[Benutzer] --> B{Authentifiziert?}
    B -->|Ja| C[Dashboard]
    B -->|Nein| D[Login-Seite]
```
````

Flowbook erkennt die Datei automatisch und fügt sie dem Viewer hinzu.

## Frontmatter-Schema

| Feld          | Typ        | Erforderlich | Beschreibung                          |
|---------------|------------|--------------|---------------------------------------|
| `title`       | `string`   | Nein         | Angezeigter Titel (Standard: Dateiname) |
| `category`    | `string`   | Nein         | Kategorie in der Seitenleiste (Standard: "Uncategorized") |
| `tags`        | `string[]` | Nein         | Filterbare Tags                       |
| `order`       | `number`   | Nein         | Sortierreihenfolge innerhalb der Kategorie (Standard: 999) |
| `description` | `string`   | Nein         | Beschreibung in der Detailansicht     |

## Datei-Erkennung

Flowbook durchsucht standardmäßig folgende Muster:

```
**/*.flow.md
**/*.flowchart.md
```

Ignoriert `node_modules/`, `.git/` und `dist/`.

## KI-Agent-Fähigkeit

`flowbook init` installiert automatisch KI-Agent-Fähigkeiten in alle unterstützten Codierungs-Agent-Verzeichnisse.
Wenn ein Codierungs-Agent (Claude Code, OpenAI Codex, VS Code Copilot, Cursor, Gemini CLI usw.) das Schlüsselwort **"flowbook"** in Ihrer Eingabeaufforderung erkennt, wird er:

1. Ihre Codebasis auf logische Abläufe analysieren (API-Routen, Authentifizierung, Zustandsverwaltung, Geschäftslogik usw.)
2. Flowbook einrichten, falls noch nicht initialisiert
3. `.flow.md`-Dateien mit Mermaid-Diagrammen für jeden bedeutenden Ablauf generieren
4. Den Build überprüfen

### `flowbook skill`

Installiert Fähigkeiten und `/flowbook`-Befehle für bestimmte Agenten:

```bash
# Für einen bestimmten Agent installieren (Projektebene)
flowbook skill opencode
flowbook skill claude
flowbook skill cursor

# Für alle Agenten installieren
flowbook skill all

# Global installieren (in allen Projekten verfügbar)
flowbook skill opencode -g
flowbook skill all --global
```

**Was wird installiert:**

| Komponente | Beschreibung |
|-----------|-------------|
| **Fähigkeit** (`SKILL.md`) | Wird automatisch aktiviert, wenn Sie "flowbook" in Eingabeaufforderungen erwähnen |
| **Slash-Befehl** (`/flowbook`) | Explizite Aktivierung — geben Sie `/flowbook` ein, um Flussdiagramme zu generieren |

Slash-Befehle werden für Agenten installiert, die sie unterstützen: **Claude Code**, **Cursor**, **Windsurf**, **OpenCode**.

### Installation über skills.sh

Sie können die Fähigkeit auch eigenständig über [skills.sh](https://skills.sh) installieren:

```bash
# Projektebene
npx skills add Epsilondelta-ai/flowbook

# Global
npx skills add -g Epsilondelta-ai/flowbook
```

> **Hinweis:** `npx skills add` installiert nur Fähigkeiten (SKILL.md). Verwenden Sie `flowbook skill`, um auch `/flowbook`-Befehle zu installieren.

### Unterstützte Agenten

| Agent | Fähigkeit | Slash-Befehl |
|-------|-------|---------------|
| Claude Code | `.claude/skills/flowbook/SKILL.md` | `.claude/commands/flowbook.md` |
| OpenAI Codex | `.agents/skills/flowbook/SKILL.md` | — |
| VS Code / GitHub Copilot | `.github/skills/flowbook/SKILL.md` | — |
| Google Antigravity | `.agent/skills/flowbook/SKILL.md` | — |
| Gemini CLI | `.gemini/skills/flowbook/SKILL.md` | — |
| Cursor | `.cursor/skills/flowbook/SKILL.md` | `.cursor/commands/flowbook.md` |
| Windsurf (Codeium) | `.windsurf/skills/flowbook/SKILL.md` | `.windsurf/workflows/flowbook.md` |
| AmpCode | `.amp/skills/flowbook/SKILL.md` | — |
| OpenCode / oh-my-opencode | `.opencode/skills/flowbook/SKILL.md` | `.opencode/command/flowbook.md` |

<details>
<summary>Manuelle Installation</summary>

Wenn Sie `flowbook skill` oder `npx skills add` nicht verwendet haben, kopieren Sie die Dateien manuell:

```bash
# Fähigkeit
mkdir -p .claude/skills/flowbook
cp node_modules/flowbook/src/skills/flowbook/SKILL.md .claude/skills/flowbook/

# Slash-Befehl (Claude Code)
mkdir -p .claude/commands
cp node_modules/flowbook/src/commands/flowbook.md .claude/commands/
```

Ersetzen Sie die Verzeichnisse durch die entsprechenden Pfade aus der obigen Tabelle.

</details>
## Funktionsweise

```
.flow.md-Dateien ──→ Vite-Plugin ──→ Virtuelles Modul ──→ React-Viewer
                       │                    │
                       ├─ fast-glob-Scan    ├─ export default { flows: [...] }
                       ├─ gray-matter       │
                       │  Parsing           └─ HMR bei Dateiänderung
                       └─ Mermaid-Block
                          Extraktion
```

1. **Erkennung** — `fast-glob` durchsucht das Projekt nach `*.flow.md` / `*.flowchart.md`
2. **Parsing** — `gray-matter` extrahiert YAML-Frontmatter; Regex extrahiert `` ```mermaid ``-Blöcke
3. **Virtuelles Modul** — Vite-Plugin stellt geparste Daten als `virtual:flowbook-data` bereit
4. **Rendering** — React-App rendert Mermaid-Diagramme über `mermaid.render()`
5. **HMR** — Dateiänderungen invalidieren das virtuelle Modul und lösen ein Neuladen aus

## Projektstruktur

```
src/
├── types.ts                    # Gemeinsame Typen (FlowEntry, FlowbookData)
├── node/
│   ├── cli.ts                  # CLI-Einstiegspunkt (init, dev, build, skill)
│   ├── server.ts               # Programmatischer Vite-Server & Build
│   ├── init.ts                 # Projekt-Initialisierungslogik
│   ├── skill.ts                # KI-Agent-Fähigkeit & Befehls-Installer
│   ├── discovery.ts            # Datei-Scanner (fast-glob)
│   ├── parser.ts               # Frontmatter + Mermaid-Extraktion
│   └── plugin.ts               # Vite-Plugin für virtuelles Modul
├── skills/
│   └── flowbook/
│       └── SKILL.md            # KI-Agent-Fähigkeitsdefinition
├── commands/
│   ├── flowbook.md             # Slash-Befehl (Frontmatter-Format)
│   └── flowbook.plain.md       # Slash-Befehl (reines Markdown-Format)
└── client/
    ├── index.html              # Einstiegs-HTML
    ├── main.tsx                # React-Einstiegspunkt
    ├── App.tsx                 # Layout mit Suche + Seitenleiste + Viewer
    ├── vite-env.d.ts           # Typdeklarationen für virtuelles Modul
    ├── styles/globals.css      # Tailwind v4 + benutzerdefinierte Stile
    └── components/
        ├── Header.tsx          # Logo, Suchleiste, Flow-Anzahl
        ├── Sidebar.tsx         # Einklappbarer Kategoriebaum
        ├── MermaidRenderer.tsx # Mermaid-Diagramm-Rendering
        ├── FlowView.tsx        # Einzelne Flow-Detailansicht
        └── EmptyState.tsx      # Leerzustand mit Anleitung
```

## Entwicklung (Beitragen)

```bash
git clone https://github.com/Epsilondelta-ai/flowbook.git
cd flowbook
npm install

# Lokale Entwicklung (verwendet die Root-vite.config.ts)
npm run dev

# CLI erstellen
npm run build

# CLI lokal testen
node dist/cli.js dev
node dist/cli.js build
```

## Technologie-Stack

- **Vite** — Entwicklungsserver mit HMR
- **React 19** — Benutzeroberfläche
- **Mermaid 11** — Diagramm-Rendering
- **Tailwind CSS v4** — Styling
- **gray-matter** — YAML-Frontmatter-Parsing
- **fast-glob** — Datei-Erkennung
- **tsup** — CLI-Bundler
- **TypeScript** — Typsicherheit

## Lizenz

MIT
