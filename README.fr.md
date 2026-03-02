# Flowbook

> [English](./README.md) | [한국어](./README.ko.md) | [简体中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (BR)](./README.pt-BR.md) | **Français** | [Русский](./README.ru.md) | [Deutsch](./README.de.md)

Storybook pour les diagrammes de flux. Découvre automatiquement les fichiers de diagrammes Mermaid dans votre code, les organise par catégorie et les affiche dans un visualiseur navigable.

![Vite](https://img.shields.io/badge/vite-6.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-19.x-61DAFB?logo=react&logoColor=white)
![Mermaid](https://img.shields.io/badge/mermaid-11.x-FF3670?logo=mermaid&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6?logo=typescript&logoColor=white)

## Démarrage Rapide

```bash
# Initialiser — ajoute les scripts + fichier d'exemple
npx flowbook@latest init

# Démarrer le serveur de développement
npm run flowbook
# → http://localhost:6200

# Construire le site statique
npm run build-flowbook
# → flowbook-static/
```

## CLI

```
flowbook init                Configurer Flowbook dans votre projet
flowbook dev  [--port 6200]  Démarrer le serveur de développement
flowbook build [--out-dir d] Construire un site statique
```

### `flowbook init`

- Ajoute les scripts `"flowbook"` et `"build-flowbook"` à votre `package.json`
- Crée `flows/example.flow.md` comme modèle de départ

### `flowbook dev`

Démarre un serveur de développement Vite sur `http://localhost:6200` avec HMR. Toute modification de fichiers `.flow.md` ou `.flowchart.md` est prise en compte instantanément.

### `flowbook build`

Construit un site statique dans `flowbook-static/` (configurable via `--out-dir`). Déployez-le n'importe où.

## Écrire des Fichiers de Flux

Créez un fichier `.flow.md` (ou `.flowchart.md`) n'importe où dans votre projet :

````markdown
---
title: Flux de Connexion
category: Authentification
tags: [auth, login, oauth]
order: 1
description: Flux d'authentification utilisateur avec OAuth2
---

```mermaid
flowchart TD
    A[Utilisateur] --> B{Authentifié ?}
    B -->|Oui| C[Tableau de bord]
    B -->|Non| D[Page de connexion]
```
````

Flowbook découvre automatiquement le fichier et l'ajoute au visualiseur.

## Schéma du Frontmatter

| Champ         | Type       | Requis | Description                            |
|---------------|------------|--------|----------------------------------------|
| `title`       | `string`   | Non    | Titre affiché (par défaut : nom du fichier) |
| `category`    | `string`   | Non    | Catégorie dans la barre latérale (par défaut : "Uncategorized") |
| `tags`        | `string[]` | Non    | Tags filtrables                        |
| `order`       | `number`   | Non    | Ordre de tri dans la catégorie (par défaut : 999) |
| `description` | `string`   | Non    | Description affichée dans la vue détaillée |

## Découverte des Fichiers

Flowbook analyse ces motifs par défaut :

```
**/*.flow.md
**/*.flowchart.md
```

Ignore `node_modules/`, `.git/` et `dist/`.

## Compétence Agent IA

`flowbook init` installe automatiquement les compétences d'agent IA dans tous les répertoires d'agents de codage supportés.
Lorsqu'un agent de codage (Claude Code, OpenAI Codex, VS Code Copilot, Cursor, Gemini CLI, etc.) détecte le mot-clé **"flowbook"** dans votre invite, il :

1. Analyse votre base de code pour les flux logiques (routes API, authentification, gestion d'état, logique métier, etc.)
2. Configure Flowbook s'il n'est pas déjà initialisé
3. Génère des fichiers `.flow.md` avec des diagrammes Mermaid pour chaque flux significatif
4. Vérifie la compilation

### Installation Manuelle de Compétence

Si vous n'avez pas utilisé `flowbook init`, copiez la compétence manuellement :

```bash
# Claude Code
mkdir -p .claude/skills/flowbook
cp node_modules/flowbook/src/skills/flowbook/SKILL.md .claude/skills/flowbook/

# OpenAI Codex
mkdir -p .agents/skills/flowbook
cp node_modules/flowbook/src/skills/flowbook/SKILL.md .agents/skills/flowbook/

# VS Code / GitHub Copilot
mkdir -p .github/skills/flowbook
cp node_modules/flowbook/src/skills/flowbook/SKILL.md .github/skills/flowbook/

# Google Antigravity
mkdir -p .agent/skills/flowbook
cp node_modules/flowbook/src/skills/flowbook/SKILL.md .agent/skills/flowbook/

# Gemini CLI
mkdir -p .gemini/skills/flowbook
cp node_modules/flowbook/src/skills/flowbook/SKILL.md .gemini/skills/flowbook/

# Cursor
mkdir -p .cursor/skills/flowbook
cp node_modules/flowbook/src/skills/flowbook/SKILL.md .cursor/skills/flowbook/

# Windsurf (Codeium)
mkdir -p .windsurf/skills/flowbook
cp node_modules/flowbook/src/skills/flowbook/SKILL.md .windsurf/skills/flowbook/

# AmpCode
mkdir -p .amp/skills/flowbook
cp node_modules/flowbook/src/skills/flowbook/SKILL.md .amp/skills/flowbook/

# OpenCode / oh-my-opencode
mkdir -p .opencode/skills/flowbook
cp node_modules/flowbook/src/skills/flowbook/SKILL.md .opencode/skills/flowbook/
```

### Agents Compatibles

| Agent | Emplacement de Compétence |
|-------|---------------|
| Claude Code | `.claude/skills/flowbook/SKILL.md` |
| OpenAI Codex | `.agents/skills/flowbook/SKILL.md` |
| VS Code / GitHub Copilot | `.github/skills/flowbook/SKILL.md` |
| Google Antigravity | `.agent/skills/flowbook/SKILL.md` |
| Gemini CLI | `.gemini/skills/flowbook/SKILL.md` |
| Cursor | `.cursor/skills/flowbook/SKILL.md` |
| Windsurf (Codeium) | `.windsurf/skills/flowbook/SKILL.md` |
| AmpCode | `.amp/skills/flowbook/SKILL.md` |
| OpenCode / oh-my-opencode | `.opencode/skills/flowbook/SKILL.md` |

## Fonctionnement

```
fichiers .flow.md ──→ Plugin Vite ──→ Module Virtuel ──→ Visualiseur React
                        │                   │
                        ├─ scan fast-glob   ├─ export default { flows: [...] }
                        ├─ gray-matter      │
                        │  parsing          └─ HMR sur modification de fichier
                        └─ bloc mermaid
                           extraction
```

1. **Découverte** — `fast-glob` analyse le projet à la recherche de `*.flow.md` / `*.flowchart.md`
2. **Parsing** — `gray-matter` extrait le frontmatter YAML ; regex extrait les blocs `` ```mermaid ``
3. **Module Virtuel** — Le plugin Vite sert les données parsées comme `virtual:flowbook-data`
4. **Rendu** — L'application React rend les diagrammes Mermaid via `mermaid.render()`
5. **HMR** — Les modifications de fichiers invalident le module virtuel, déclenchant un rechargement

## Structure du Projet

```
src/
├── types.ts                    # Types partagés (FlowEntry, FlowbookData)
├── node/
│   ├── cli.ts                  # Point d'entrée CLI (init, dev, build)
│   ├── server.ts               # Serveur Vite programmatique et build
│   ├── init.ts                 # Logique d'initialisation du projet
│   ├── discovery.ts            # Scanner de fichiers (fast-glob)
│   ├── parser.ts               # Extraction frontmatter + mermaid
│   └── plugin.ts               # Plugin de module virtuel Vite
└── client/
    ├── index.html              # HTML d'entrée
    ├── main.tsx                # Entrée React
    ├── App.tsx                 # Layout avec recherche + barre latérale + visualiseur
    ├── vite-env.d.ts           # Déclarations de type du module virtuel
    ├── styles/globals.css      # Tailwind v4 + styles personnalisés
    └── components/
        ├── Header.tsx          # Logo, barre de recherche, nombre de flux
        ├── Sidebar.tsx         # Arbre de catégories repliable
        ├── MermaidRenderer.tsx # Rendu des diagrammes Mermaid
        ├── FlowView.tsx        # Vue détaillée d'un flux individuel
        └── EmptyState.tsx      # État vide avec guide
```

## Développement (Contribution)

```bash
git clone https://github.com/Epsilondelta-ai/flowbook.git
cd flowbook
npm install

# Développement local (utilise le vite.config.ts racine)
npm run dev

# Construire le CLI
npm run build

# Tester le CLI localement
node dist/cli.js dev
node dist/cli.js build
```

## Stack Technique

- **Vite** — Serveur de développement avec HMR
- **React 19** — Interface utilisateur
- **Mermaid 11** — Rendu de diagrammes
- **Tailwind CSS v4** — Stylisation
- **gray-matter** — Parsing de frontmatter YAML
- **fast-glob** — Découverte de fichiers
- **tsup** — Bundler CLI
- **TypeScript** — Sûreté de type

## Licence

MIT
