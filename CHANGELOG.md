# Changelog

## 1.0.0 (2026-04-24)

### Features
- **`onerules ai`** — generates a prompt for your existing AI tool (Claude Code, Cursor, ChatGPT) to create project-specific rules. No API keys needed. Uses your codebase context.
  - `onerules ai --copy` — copy to clipboard
  - `onerules ai -o prompt.md` — save to file
  - `onerules ai` — print to stdout for piping
- **`onerules --merge`** — smart merge that adds missing rules to existing files without overwriting project-specific content. Uses keyword overlap detection.
- **Two-tier approach**: Level 1 (`onerules`) for instant offline rules, Level 2 (`onerules ai`) for project-specific rules via your AI.

### Quality
- 70 tests across 6 test files (26 E2E tests covering 5 project types)
- Dogfooding: project uses its own CLAUDE.md, scores 100/100 on doctor

## 0.9.0 (2026-04-24)

### Features
- **Smart merge mode** (`--merge`) — append missing rules to existing files
- Keyword overlap detection for deduplication

## 0.8.0 (2026-04-24)

### Features
- **`onerules doctor`** — scores existing rule files 0-100, detects 12 weak patterns, suggests anti-slop replacements
- **`onerules monorepo`** — per-workspace rules in monorepos (pnpm, yarn, npm workspaces, turbo, nx)
- **3 new library rules** — Three.js, Playwright, Cypress (25 total)
- Doctor false-positive fix for "Use TypeScript strict mode"

## 0.7.0 (2026-04-24)

### Features
- **`onerules init`** — interactive setup wizard with clack UI
- **`onerules inspect`** — shows detected stack and rule categories
- **`--strict` mode** — extra aggressive rules
- **`--minimal` mode** — core anti-slop only
- **GitHub Actions CI** on Node 18, 20, 22
- CHANGELOG.md

## 0.6.0 (2026-04-24)

### Features
- **22 library-specific rule sets** — Prisma, Drizzle, Zod, tRPC, Tailwind, React Query, Zustand, Redux Toolkit, Radix UI, Framer Motion, Stripe, NextAuth, Lucia, Mongoose, SQLAlchemy, Pydantic, Celery, Redis, Socket.io, GraphQL, Jotai

## 0.5.0 (2026-04-24)

### Features
- Library-aware rule generation — detects libraries and generates specific anti-slop rules

## 0.4.0 (2026-04-24)

### Features
- **12 AI tools** — added Kiro (AWS), Continue
- **23 frameworks** — added Svelte, Actix, Tauri, Electron, React Native
- **`.onerulesrc`** custom rules
- **`.gitignore` awareness**

## 0.3.0 (2026-04-24)

### Features
- All rules rewritten as anti-slop weapons targeting specific AI failure modes
- Before/after comparison GIFs

## 0.1.0 (2026-04-24)

### Initial Release
- Auto-detect TypeScript, JavaScript, Python, Go, Rust, Ruby
- Generate rules for 8 AI tools
- Framework rules for Next.js, React, FastAPI
