# Flowbook

> [English](./README.md) | [한국어](./README.ko.md) | [简体中文](./README.zh-CN.md) | **日本語** | [Español](./README.es.md) | [Português (BR)](./README.pt-BR.md) | [Français](./README.fr.md) | [Русский](./README.ru.md) | [Deutsch](./README.de.md)

フローチャートのための Storybook。コードベースから Mermaid ダイアグラムファイルを自動検出し、カテゴリ別に整理して、ブラウザで閲覧可能なビューアでレンダリングします。

![Vite](https://img.shields.io/badge/vite-6.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-19.x-61DAFB?logo=react&logoColor=white)
![Mermaid](https://img.shields.io/badge/mermaid-11.x-FF3670?logo=mermaid&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6?logo=typescript&logoColor=white)

## クイックスタート

```bash
# インストール
npm install -D flowbook

# 初期化 — スクリプト + サンプルファイルを追加
npx flowbook init

# 開発サーバーを起動
npm run flowbook
# → http://localhost:6200

# 静的サイトをビルド
npm run build-flowbook
# → flowbook-static/
```

## CLI

```
flowbook init                プロジェクトに Flowbook をセットアップ
flowbook dev  [--port 6200]  開発サーバーを起動
flowbook build [--out-dir d] 静的サイトをビルド
```

### `flowbook init`

- `package.json` に `"flowbook"` と `"build-flowbook"` スクリプトを追加します
- `flows/example.flow.md` をスターターテンプレートとして作成します

### `flowbook dev`

`http://localhost:6200` で HMR 対応の Vite 開発サーバーを起動します。`.flow.md` や `.flowchart.md` ファイルの変更が即座に反映されます。

### `flowbook build`

`flowbook-static/` ディレクトリに静的サイトをビルドします（`--out-dir` で変更可能）。どこにでもデプロイできます。

## フローファイルの作成

プロジェクト内の任意の場所に `.flow.md`（または `.flowchart.md`）ファイルを作成してください：

````markdown
---
title: ログインフロー
category: 認証
tags: [auth, login, oauth]
order: 1
description: OAuth2 を使用したユーザー認証フロー
---

```mermaid
flowchart TD
    A[ユーザー] --> B{認証済み?}
    B -->|はい| C[ダッシュボード]
    B -->|いいえ| D[ログインページ]
```
````

Flowbook がファイルを自動検出し、ビューアに追加します。

## フロントマタースキーマ

| フィールド    | 型         | 必須   | 説明                                |
|---------------|------------|--------|-------------------------------------|
| `title`       | `string`   | いいえ | 表示タイトル（デフォルト: ファイル名）|
| `category`    | `string`   | いいえ | サイドバーのカテゴリ（デフォルト: "Uncategorized"）|
| `tags`        | `string[]` | いいえ | フィルタリング可能なタグ            |
| `order`       | `number`   | いいえ | カテゴリ内の並び順（デフォルト: 999）|
| `description` | `string`   | いいえ | 詳細ビューに表示される説明          |

## ファイル検出

Flowbook はデフォルトで以下のパターンをスキャンします：

```
**/*.flow.md
**/*.flowchart.md
```

`node_modules/`、`.git/`、`dist/` は無視します。

## 仕組み

```
.flow.md ファイル ──→ Vite プラグイン ──→ 仮想モジュール ──→ React ビューア
                        │                     │
                        ├─ fast-glob スキャン  ├─ export default { flows: [...] }
                        ├─ gray-matter        │
                        │  パース             └─ ファイル変更時に HMR
                        └─ mermaid ブロック
                           抽出
```

1. **検出** — `fast-glob` がプロジェクト内の `*.flow.md` / `*.flowchart.md` をスキャン
2. **パース** — `gray-matter` が YAML フロントマターを抽出；正規表現で `` ```mermaid `` ブロックを抽出
3. **仮想モジュール** — Vite プラグインがパースしたデータを `virtual:flowbook-data` として提供
4. **レンダリング** — React アプリが `mermaid.render()` で Mermaid ダイアグラムをレンダリング
5. **HMR** — ファイル変更時に仮想モジュールを無効化し、リロードをトリガー

## プロジェクト構成

```
src/
├── types.ts                    # 共有型 (FlowEntry, FlowbookData)
├── node/
│   ├── cli.ts                  # CLI エントリポイント (init, dev, build)
│   ├── server.ts               # プログラマティック Vite サーバー & ビルド
│   ├── init.ts                 # プロジェクト初期化ロジック
│   ├── discovery.ts            # ファイルスキャナー (fast-glob)
│   ├── parser.ts               # フロントマター + mermaid 抽出
│   └── plugin.ts               # Vite 仮想モジュールプラグイン
└── client/
    ├── index.html              # エントリ HTML
    ├── main.tsx                # React エントリ
    ├── App.tsx                 # 検索 + サイドバー + ビューアレイアウト
    ├── vite-env.d.ts           # 仮想モジュール型宣言
    ├── styles/globals.css      # Tailwind v4 + カスタムスタイル
    └── components/
        ├── Header.tsx          # ロゴ、検索バー、フロー数
        ├── Sidebar.tsx         # 折りたたみ可能なカテゴリツリー
        ├── MermaidRenderer.tsx # Mermaid ダイアグラムレンダリング
        ├── FlowView.tsx        # 単一フロー詳細ビュー
        └── EmptyState.tsx      # 空状態ガイド
```

## 開発（コントリビューション）

```bash
git clone https://github.com/Epsilondelta-ai/flowbook.git
cd flowbook
npm install

# ローカル開発（ルートの vite.config.ts を使用）
npm run dev

# CLI をビルド
npm run build

# ローカルで CLI をテスト
node dist/cli.js dev
node dist/cli.js build
```

## 技術スタック

- **Vite** — HMR 対応開発サーバー
- **React 19** — UI
- **Mermaid 11** — ダイアグラムレンダリング
- **Tailwind CSS v4** — スタイリング
- **gray-matter** — YAML フロントマターパーサー
- **fast-glob** — ファイル検出
- **tsup** — CLI バンドラー
- **TypeScript** — 型安全性

## ライセンス

MIT
