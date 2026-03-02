# Flowbook

> [English](./README.md) | [한국어](./README.ko.md) | **简体中文** | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (BR)](./README.pt-BR.md) | [Français](./README.fr.md) | [Русский](./README.ru.md) | [Deutsch](./README.de.md)

流程图的 Storybook。自动发现代码库中的 Mermaid 图表文件，按类别组织，并在可浏览的查看器中渲染。

![Vite](https://img.shields.io/badge/vite-6.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-19.x-61DAFB?logo=react&logoColor=white)
![Mermaid](https://img.shields.io/badge/mermaid-11.x-FF3670?logo=mermaid&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6?logo=typescript&logoColor=white)

## 快速开始

```bash
# 初始化 — 添加脚本 + 示例文件
npx flowbook@latest init

# 启动开发服务器
npm run flowbook
# → http://localhost:6200

# 构建静态站点
npm run build-flowbook
# → flowbook-static/
```

## CLI

```
flowbook init                在项目中设置 Flowbook
flowbook dev  [--port 6200]  启动开发服务器
flowbook build [--out-dir d] 构建静态站点
```

### `flowbook init`

- 在 `package.json` 中添加 `"flowbook"` 和 `"build-flowbook"` 脚本
- 创建 `flows/example.flow.md` 作为入门模板

### `flowbook dev`

在 `http://localhost:6200` 启动支持 HMR 的 Vite 开发服务器。任何 `.flow.md` 或 `.flowchart.md` 文件的更改都会即时生效。

### `flowbook build`

将静态站点构建到 `flowbook-static/` 目录（可通过 `--out-dir` 配置）。可部署到任何地方。

## 编写流程文件

在项目中任意位置创建 `.flow.md`（或 `.flowchart.md`）文件：

````markdown
---
title: 登录流程
category: 认证
tags: [auth, login, oauth]
order: 1
description: 使用 OAuth2 的用户认证流程
---

```mermaid
flowchart TD
    A[用户] --> B{已认证?}
    B -->|是| C[仪表盘]
    B -->|否| D[登录页面]
```
````

Flowbook 会自动发现文件并将其添加到查看器中。

## Frontmatter 模式

| 字段          | 类型       | 必填 | 说明                                |
|---------------|------------|------|-------------------------------------|
| `title`       | `string`   | 否   | 显示标题（默认为文件名）            |
| `category`    | `string`   | 否   | 侧边栏分类（默认为 "Uncategorized"）|
| `tags`        | `string[]` | 否   | 可筛选的标签                        |
| `order`       | `number`   | 否   | 分类内排序（默认：999）             |
| `description` | `string`   | 否   | 详情视图中显示的描述                |

## 文件发现

Flowbook 默认扫描以下模式：

```
**/*.flow.md
**/*.flowchart.md
```

忽略 `node_modules/`、`.git/` 和 `dist/`。

## AI Agent Skill

`flowbook init` 自动将 AI 代理技能安装到所有支持的编码代理目录中。
当编码代理（Claude Code、OpenAI Codex、VS Code Copilot、Cursor、Gemini CLI 等）检测到你的提示中有 **"flowbook"** 关键字时，它会：

1. 分析你的代码库中的逻辑流（API 路由、认证、状态管理、业务逻辑等）
2. 如果尚未初始化，设置 Flowbook
3. 为每个重要流程生成包含 Mermaid 图表的 `.flow.md` 文件
4. 验证构建

### 手动技能安装

如果你没有使用 `flowbook init`，请手动复制技能：

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

### 兼容代理

| 代理 | 技能位置 |
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

## 工作原理

```
.flow.md 文件 ──→ Vite 插件 ──→ 虚拟模块 ──→ React 查看器
                    │                   │
                    ├─ fast-glob 扫描   ├─ export default { flows: [...] }
                    ├─ gray-matter      │
                    │  解析             └─ 文件更改时 HMR
                    └─ mermaid 块
                       提取
```

1. **发现** — `fast-glob` 扫描项目中的 `*.flow.md` / `*.flowchart.md`
2. **解析** — `gray-matter` 提取 YAML frontmatter；正则表达式提取 `` ```mermaid `` 块
3. **虚拟模块** — Vite 插件将解析后的数据作为 `virtual:flowbook-data` 提供
4. **渲染** — React 应用通过 `mermaid.render()` 渲染 Mermaid 图表
5. **HMR** — 文件更改时使虚拟模块失效，触发重新加载

## 项目结构

```
src/
├── types.ts                    # 共享类型 (FlowEntry, FlowbookData)
├── node/
│   ├── cli.ts                  # CLI 入口 (init, dev, build)
│   ├── server.ts               # 编程式 Vite 服务器与构建
│   ├── init.ts                 # 项目初始化逻辑
│   ├── discovery.ts            # 文件扫描器 (fast-glob)
│   ├── parser.ts               # Frontmatter + mermaid 提取
│   └── plugin.ts               # Vite 虚拟模块插件
└── client/
    ├── index.html              # 入口 HTML
    ├── main.tsx                # React 入口
    ├── App.tsx                 # 搜索 + 侧边栏 + 查看器布局
    ├── vite-env.d.ts           # 虚拟模块类型声明
    ├── styles/globals.css      # Tailwind v4 + 自定义样式
    └── components/
        ├── Header.tsx          # Logo、搜索栏、流程计数
        ├── Sidebar.tsx         # 可折叠分类树
        ├── MermaidRenderer.tsx # Mermaid 图表渲染
        ├── FlowView.tsx        # 单个流程详情视图
        └── EmptyState.tsx      # 空状态引导
```

## 开发（贡献）

```bash
git clone https://github.com/Epsilondelta-ai/flowbook.git
cd flowbook
npm install

# 本地开发（使用根目录 vite.config.ts）
npm run dev

# 构建 CLI
npm run build

# 本地测试 CLI
node dist/cli.js dev
node dist/cli.js build
```

## 技术栈

- **Vite** — 支持 HMR 的开发服务器
- **React 19** — 用户界面
- **Mermaid 11** — 图表渲染
- **Tailwind CSS v4** — 样式
- **gray-matter** — YAML frontmatter 解析
- **fast-glob** — 文件发现
- **tsup** — CLI 打包工具
- **TypeScript** — 类型安全

## 许可证

MIT
