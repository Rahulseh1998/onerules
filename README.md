<p align="center">
  <h1 align="center">onerules</h1>
  <p align="center"><strong>One command. Every AI tool. Perfect rules.</strong></p>
  <p align="center">
    Auto-detect your stack and generate optimized coding rules for 10 AI tools — in under 2 seconds.
  </p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@blackforge/onerules"><img src="https://img.shields.io/npm/v/@blackforge/onerules.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@blackforge/onerules"><img src="https://img.shields.io/npm/dm/@blackforge/onerules.svg" alt="npm downloads"></a>
  <a href="https://github.com/onerules/onerules/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license"></a>
</p>

<p align="center">
  <a href="./README.zh-CN.md">简体中文</a>
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Rahulseh1998/onerules/main/demo.gif" alt="onerules demo" width="860">
</p>

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
| Roo Code | `.roo/rules/*.md` |
| Trae | `.trae/rules/*.md` |

**onerules** generates all of them from a single command.

## Quick Start

```bash
# Install globally (recommended)
npm i -g @blackforge/onerules

# Then run in any project
onerules
```

Or use directly without installing:

```bash
npx --package=@blackforge/onerules onerules
```

No API keys, no config. Works offline.

```
  onerules v0.2.0

  Detected: Next.js + TypeScript + Tailwind CSS + Prisma + pnpm

  Generated 10 files:
    ✓ CLAUDE.md                         (Claude Code)
    ✓ .cursor/rules/onerules.mdc        (Cursor)
    ✓ .github/copilot-instructions.md   (GitHub Copilot)
    ✓ AGENTS.md                         (OpenAI Codex)
    ✓ GEMINI.md                         (Gemini CLI)
    ✓ .windsurfrules                    (Windsurf)
    ✓ .clinerules                       (Cline)
    ✓ CONVENTIONS.md                    (Aider)
    ✓ .roo/rules/onerules.md            (Roo Code)
    ✓ .trae/rules/onerules.md           (Trae)

  Done in 1.2s
```

## Features

- **Zero-config** — auto-detects your stack from package.json, pyproject.toml, go.mod, Cargo.toml, or Gemfile
- **10 AI tools** — generates the correct file format for each tool
- **18 frameworks** — deep, opinionated rules for Next.js, React, Vue, Nuxt, SvelteKit, Angular, Astro, Remix, Express, Fastify, Hono, FastAPI, Django, Flask, Rails, Gin, Fiber, Axum
- **No LLM required** — deterministic, fast (<2s), works completely offline
- **Smart rules** — principle-based best practices, not 500-line rule dumps
- **Safe by default** — skips existing files unless you use `--force`

## Supported Stacks

### Languages
TypeScript, JavaScript, Python, Go, Rust, Ruby

### Frameworks (with deep rules)
Next.js, React, Vue, Nuxt, SvelteKit, Angular, Astro, Remix, Express, Fastify, Hono, FastAPI, Django, Flask, Rails, Gin, Fiber, Axum

### Also detected
Svelte, Actix, Tauri, Electron, React Native

### Tooling
pnpm, yarn, bun, npm, uv, poetry, pip, cargo, bundler | Vitest, Jest, Playwright, Cypress, pytest, RSpec | ESLint, Biome, Ruff, RuboCop | Prettier, dprint, Black

## Commands

### Generate rules (default)

```bash
onerules                         # Generate for all 10 tools
onerules -t claude,cursor        # Generate for specific tools only
onerules --force                 # Overwrite existing files
onerules --dry-run               # Preview without writing
onerules -d ./my-project         # Specify project directory
```

### Update existing rules

```bash
onerules update                  # Re-detect stack and regenerate all files
```

### Preview diff

```bash
onerules diff                    # Show what would be generated
```

## What Gets Generated

onerules generates rules covering:

- **Principles** — think before coding, simplicity first, surgical changes
- **Coding patterns** — language-specific best practices (TypeScript strict mode, Python type hints, Go error handling, Rust ownership patterns)
- **Framework patterns** — framework-specific rules (Server Components for Next.js, Composition API for Vue, Pydantic models for FastAPI, etc.)
- **Architecture** — project structure, separation of concerns, routing patterns
- **Do Not** — common mistakes to avoid per language and framework
- **Testing** — test framework conventions and best practices
- **Security** — OWASP-aligned security practices
- **Style & Tooling** — package manager, linter, formatter conventions

Rules are principle-based and concise — the format proven by projects with 80k+ stars.

## FAQ

**Does this replace my existing CLAUDE.md?**
No. By default, onerules skips files that already exist. Use `--force` to overwrite.

**Does this call any AI APIs?**
No. onerules is fully deterministic and works offline. No API keys needed.

**Can I customize the generated rules?**
Yes. Edit the generated files after running onerules. They're plain markdown.

**How do I add rules for my framework?**
Open a PR adding a fragment in `src/templates/fragments/`. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Contributing

Contributions are welcome! The easiest ways to contribute:

1. **Add a framework** — create a new file in `src/templates/fragments/` and register it in the index
2. **Add a tool** — create a new generator in `src/generate/` for an AI tool we don't support yet
3. **Improve rules** — submit PRs improving the quality of generated rules for any framework

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

## License

MIT
