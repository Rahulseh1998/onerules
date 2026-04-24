# Changelog

## 0.7.0 (2026-04-24)

### Features
- **`onerules init`** — interactive setup wizard with tool selection, stack preview, and confirmation
- **`onerules inspect`** — shows everything detected in your project and which rules will apply
- **`--strict` mode** — adds extra aggressive rules (max function length, no default exports, mandatory regression tests)
- **`--minimal` mode** — generates only base anti-slop rules, skips framework/library details
- **22 library-specific rule sets** — Prisma, Drizzle, Zod, tRPC, Tailwind, React Query, Zustand, Redux Toolkit, Radix UI, Framer Motion, Stripe, NextAuth, Lucia, Mongoose, SQLAlchemy, Pydantic, Celery, Redis, Socket.io, GraphQL, Jotai
- **5 new framework packs** — Svelte, Actix, Tauri, Electron, React Native (23 total)
- **2 new AI tools** — Kiro (AWS), Continue (12 total)
- **`.onerulesrc`** — custom rules file that merges into all outputs and survives `onerules update`
- **`.gitignore` awareness** — warns if generated files would be ignored
- **GitHub Actions CI** — tests on Node 18, 20, 22

### Improvements
- All rules rewritten as anti-slop weapons targeting specific AI failure modes
- Before/after comparison GIFs in README
- Before/after comparison doc with side-by-side examples
- Chinese README (README.zh-CN.md)
- 30 tests covering detection, generation, library rules, and custom rules

## 0.1.0 (2026-04-24)

### Initial Release
- Auto-detect TypeScript, JavaScript, Python, Go, Rust, Ruby
- Generate rules for 8 AI tools (Claude Code, Cursor, Copilot, Codex, Gemini CLI, Windsurf, Cline, Aider)
- Framework rules for Next.js, React, FastAPI
- Beautiful CLI output
- `--dry-run`, `--force`, `--tools`, `diff` commands
