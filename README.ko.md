# Flowbook

> **[English](./README.md)** | **한국어** | [简体中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (BR)](./README.pt-BR.md) | [Français](./README.fr.md) | [Русский](./README.ru.md) | [Deutsch](./README.de.md)

플로우차트를 위한 Storybook. 코드베이스에서 Mermaid 다이어그램 파일을 자동으로 발견하고, 카테고리별로 정리하여 브라우저에서 볼 수 있게 렌더링합니다.

![Vite](https://img.shields.io/badge/vite-6.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-19.x-61DAFB?logo=react&logoColor=white)
![Mermaid](https://img.shields.io/badge/mermaid-11.x-FF3670?logo=mermaid&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6?logo=typescript&logoColor=white)

## 빠른 시작

```bash
# 초기화 — 스크립트 + 예제 파일 추가
npx flowbook@latest init

# 개발 서버 실행
npm run flowbook
# → http://localhost:6200

# 정적 사이트 빌드
npm run build-flowbook
# → flowbook-static/
```

## CLI

```
flowbook init                프로젝트에 Flowbook 설정
flowbook dev  [--port 6200]  개발 서버 실행
flowbook build [--out-dir d] 정적 사이트 빌드
```

### `flowbook init`

- `package.json`에 `"flowbook"`, `"build-flowbook"` 스크립트를 추가합니다
- `flows/example.flow.md` 예제 템플릿을 생성합니다

### `flowbook dev`

`http://localhost:6200`에서 HMR이 지원되는 Vite 개발 서버를 실행합니다. `.flow.md` 또는 `.flowchart.md` 파일 변경 사항이 즉시 반영됩니다.

### `flowbook build`

`flowbook-static/` 디렉토리에 정적 사이트를 빌드합니다 (`--out-dir`로 변경 가능). 어디서든 배포 가능합니다.

## 플로우 파일 작성

프로젝트 어디에서나 `.flow.md` (또는 `.flowchart.md`) 파일을 생성하세요:

````markdown
---
title: 로그인 흐름
category: 인증
tags: [auth, login, oauth]
order: 1
description: OAuth2를 사용한 사용자 인증 흐름
---

```mermaid
flowchart TD
    A[사용자] --> B{인증됨?}
    B -->|예| C[대시보드]
    B -->|아니오| D[로그인 페이지]
```
````

Flowbook이 자동으로 파일을 발견하여 뷰어에 추가합니다.

## 프론트매터 스키마

| 필드          | 타입       | 필수 | 설명                                |
|---------------|------------|------|-------------------------------------|
| `title`       | `string`   | 아니오 | 표시 제목 (기본값: 파일명)          |
| `category`    | `string`   | 아니오 | 사이드바 카테고리 (기본값: "Uncategorized") |
| `tags`        | `string[]` | 아니오 | 필터링 가능한 태그                  |
| `order`       | `number`   | 아니오 | 카테고리 내 정렬 순서 (기본값: 999) |
| `description` | `string`   | 아니오 | 상세 보기에 표시되는 설명           |

## 파일 탐색

Flowbook은 기본적으로 다음 패턴을 스캔합니다:

```
**/*.flow.md
**/*.flowchart.md
```

`node_modules/`, `.git/`, `dist/`는 무시합니다.

## 동작 원리

```
.flow.md 파일 ──→ Vite 플러그인 ──→ 가상 모듈 ──→ React 뷰어
                    │                   │
                    ├─ fast-glob 스캔   ├─ export default { flows: [...] }
                    ├─ gray-matter      │
                    │  파싱             └─ 파일 변경 시 HMR
                    └─ mermaid 블록
                       추출
```

1. **탐색** — `fast-glob`이 프로젝트에서 `*.flow.md` / `*.flowchart.md`를 스캔
2. **파싱** — `gray-matter`가 YAML 프론트매터를 추출; 정규식으로 `` ```mermaid `` 블록 추출
3. **가상 모듈** — Vite 플러그인이 파싱된 데이터를 `virtual:flowbook-data`로 제공
4. **렌더링** — React 앱이 `mermaid.render()`를 통해 Mermaid 다이어그램 렌더링
5. **HMR** — 파일 변경 시 가상 모듈을 무효화하여 리로드 트리거

## 프로젝트 구조

```
src/
├── types.ts                    # 공유 타입 (FlowEntry, FlowbookData)
├── node/
│   ├── cli.ts                  # CLI 진입점 (init, dev, build)
│   ├── server.ts               # 프로그래밍 방식 Vite 서버 & 빌드
│   ├── init.ts                 # 프로젝트 초기화 로직
│   ├── discovery.ts            # 파일 스캐너 (fast-glob)
│   ├── parser.ts               # 프론트매터 + mermaid 추출
│   └── plugin.ts               # Vite 가상 모듈 플러그인
└── client/
    ├── index.html              # 진입 HTML
    ├── main.tsx                # React 진입점
    ├── App.tsx                 # 검색 + 사이드바 + 뷰어 레이아웃
    ├── vite-env.d.ts           # 가상 모듈 타입 선언
    ├── styles/globals.css      # Tailwind v4 + 커스텀 스타일
    └── components/
        ├── Header.tsx          # 로고, 검색바, 플로우 개수
        ├── Sidebar.tsx         # 접을 수 있는 카테고리 트리
        ├── MermaidRenderer.tsx # Mermaid 다이어그램 렌더링
        ├── FlowView.tsx        # 단일 플로우 상세 보기
        └── EmptyState.tsx      # 빈 상태 안내
```

## 개발 (기여)

```bash
git clone https://github.com/Epsilondelta-ai/flowbook.git
cd flowbook
npm install

# 로컬 개발 (루트 vite.config.ts 사용)
npm run dev

# CLI 빌드
npm run build

# 로컬에서 CLI 테스트
node dist/cli.js dev
node dist/cli.js build
```

## 기술 스택

- **Vite** — HMR 지원 개발 서버
- **React 19** — UI
- **Mermaid 11** — 다이어그램 렌더링
- **Tailwind CSS v4** — 스타일링
- **gray-matter** — YAML 프론트매터 파싱
- **fast-glob** — 파일 탐색
- **tsup** — CLI 번들러
- **TypeScript** — 타입 안전성

## 라이선스

MIT
