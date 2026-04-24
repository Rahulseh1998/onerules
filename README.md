<p align="center">
  <h1 align="center">onerules</h1>
  <p align="center"><strong>One command. Every AI tool. Perfect rules.</strong></p>
  <p align="center">
    Auto-detect your stack and generate optimized coding rules for Claude Code, Cursor, Copilot, Gemini CLI, Codex, Windsurf, Cline, and Aider — in under 2 seconds.
  </p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/onerules"><img src="https://img.shields.io/npm/v/onerules.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/onerules"><img src="https://img.shields.io/npm/dm/onerules.svg" alt="npm downloads"></a>
  <a href="https://github.com/onerules/onerules/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license"></a>
</p>

---

<!-- TODO: Hero GIF here -->

## The Problem

Every AI coding tool has its own rules file. If you use more than one tool, you're maintaining the same rules in multiple formats:

| Tool | File |
|------|------|
| Claude Code | `CLAUDE.md` |
| Cursor | `.cursor/rules/*.mdc` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| OpenAI Codex | `AGENTS.md` |
| Gemini CLI | `GEMINI.md` |
| Windsurf | `.windsurfrules` |
| Cline | `.clinerules` |
| Aider | `CONVENTIONS.md` |

**onerules** generates all of them from a single command.

## Quick Start

```bash
npx onerules
```

That's it. No install, no API keys, no config. Works offline.

```
  onerules v0.1.0

  Detected: Next.js + TypeScript + Tailwind CSS + Prisma + pnpm

  Generated 8 files:
    ✓ CLAUDE.md                    (Claude Code)
    ✓ AGENTS.md                    (OpenAI Codex)
    ✓ GEMINI.md                    (Gemini CLI)
    ✓ .cursor/rules/onerules.mdc   (Cursor)
    ✓ .github/copilot-instructions.md (GitHub Copilot)
    ✓ .windsurfrules               (Windsurf)
    ✓ .clinerules                  (Cline)
    ✓ CONVENTIONS.md               (Aider)

  Done in 1.2s
```

## Features

- **Zero-config** — auto-detects your stack from package.json, pyproject.toml, go.mod, Cargo.toml, or Gemfile
- **8 AI tools** — generates the correct file format for each tool
- **No LLM required** — deterministic, fast (<2s), works completely offline
- **Smart rules** — aggregates best practices from top-starred projects (Karpathy, BMAD, claude-code-best-practice)
- **Framework-aware** — ships with deep rules for Next.js, React, FastAPI, and more
- **Safe by default** — skips existing files unless you use `--force`

## Supported Stacks

### Languages
TypeScript, JavaScript, Python, Go, Rust, Ruby

### Frameworks
Next.js, React, Vue, Nuxt, SvelteKit, Astro, Remix, Angular, Express, Fastify, Hono, FastAPI, Django, Flask, Rails, Gin, Fiber, Actix, Axum

### Tooling
pnpm, yarn, bun, npm, uv, poetry, pip, cargo, bundler | Vitest, Jest, Playwright, Cypress, pytest, RSpec | ESLint, Biome, Ruff, RuboCop | Prettier, dprint, Black

## Commands

### Generate rules (default)

```bash
npx onerules                     # Generate for all tools
npx onerules -t claude,cursor    # Generate for specific tools only
npx onerules --force             # Overwrite existing files
npx onerules --dry-run           # Preview without writing
npx onerules -d ./my-project     # Specify project directory
```

### Preview diff

```bash
npx onerules diff                # Show what would be generated
```

## What Gets Generated

onerules generates rules covering:

- **Principles** — think before coding, simplicity first, surgical changes
- **Coding patterns** — language-specific best practices (TypeScript strict, Python type hints, Go error handling, etc.)
- **Framework patterns** — framework-specific rules (Server Components for Next.js, Pydantic models for FastAPI, etc.)
- **Do Not** — common mistakes to avoid
- **Testing** — test framework conventions
- **Security** — OWASP-aligned security practices
- **Style & Tooling** — package manager, linter, formatter conventions

Rules are principle-based and concise. No 500-line rule dumps.

## FAQ

**Does this replace my existing CLAUDE.md?**
No. By default, onerules skips files that already exist. Use `--force` to overwrite.

**Does this call any AI APIs?**
No. onerules is fully deterministic and works offline. No API keys needed.

**Can I customize the generated rules?**
Yes. Edit the generated files after running onerules. They're plain markdown.

**How do I add rules for my framework?**
Open a PR adding a fragment in `src/templates/fragments/`. We welcome contributions for all frameworks.

## Contributing

Contributions are welcome! The easiest way to contribute:

1. Add a new framework fragment in `src/templates/fragments/`
2. Add detection logic in `src/detect/`
3. Submit a PR

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT
