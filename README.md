<p align="center">
  <h1 align="center">onerules</h1>
  <p align="center"><strong>Stop your AI from writing slop.</strong></p>
  <p align="center">
    One command generates anti-slop coding rules for 10 AI tools.<br>
    Auto-detects your stack. Works offline. Under 2 seconds.
  </p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@blackforge/onerules"><img src="https://img.shields.io/npm/v/@blackforge/onerules.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@blackforge/onerules"><img src="https://img.shields.io/npm/dm/@blackforge/onerules.svg" alt="npm downloads"></a>
  <a href="https://github.com/Rahulseh1998/onerules/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license"></a>
</p>

<p align="center">
  <a href="./README.zh-CN.md">简体中文</a>
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Rahulseh1998/onerules/main/demo.gif" alt="onerules demo" width="860">
</p>

## The Problem

AI coding tools generate slop: unnecessary abstractions, wrapper classes that wrap nothing, `useMemo` on everything, try/catch around code that can't throw, `AbstractFactoryProviderManager` classes, and 500-line files that should be 50.

**onerules** generates rules that specifically target these failure modes — for every AI tool you use, tuned to your framework.

## What Makes This Different

These aren't generic "follow best practices" rules. Every rule targets a **specific AI slop pattern**:

```markdown
# Instead of: "Avoid unnecessary abstractions"
# You get:

- DO NOT over-abstract. No AbstractFactoryProviderManager. No BaseServiceInterface.
  If the class name needs 3+ words to describe what it does, it's doing too much
  or too little.

- DO NOT create interfaces/types for a single implementation. Interface `IUserService`
  with one class `UserService` is pointless indirection.

- A function that wraps another function without adding behavior is not an
  abstraction — it's noise. Delete it.

- DO NOT install `axios`. The Fetch API is built-in, cached by Next.js, and has
  extended options. `axios` adds 14KB for nothing.
```

## Quick Start

```bash
# Install globally (recommended)
npm i -g @blackforge/onerules

# Run in any project
onerules
```

Or without installing:

```bash
npx --package=@blackforge/onerules onerules
```

No API keys. No config. Works offline.

```
  onerules v0.3.0

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

## 12 AI Tools, One Command

| Tool | File Generated |
|------|------|
| Claude Code | `CLAUDE.md` |
| Cursor | `.cursor/rules/onerules.mdc` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| OpenAI Codex | `AGENTS.md` |
| Gemini CLI | `GEMINI.md` |
| Windsurf | `.windsurfrules` |
| Cline | `.clinerules` |
| Aider | `CONVENTIONS.md` |
| Roo Code | `.roo/rules/onerules.md` |
| Trae | `.trae/rules/onerules.md` |
| Kiro (AWS) | `.kiro/rules/onerules.md` |
| Continue | `.continue/rules/onerules.md` |

## Features

- **Anti-slop rules** — every rule targets a specific AI code generation failure mode, not generic advice
- **Stack-aware** — detects your libraries and generates rules specific to Prisma, Drizzle, Zod, Tailwind, React Query, Zustand, Stripe, NextAuth, and 14 more
- **12 AI tools** — generates the correct file format for each tool
- **23 frameworks** — deep rules for Next.js, React, Vue, Nuxt, SvelteKit, Angular, Astro, Remix, Express, Hono, FastAPI, Django, Flask, Rails, Gin, Axum, and more
- **Custom rules** — add a `.onerulesrc` file with your own rules that survive `onerules update`
- **Zero-config** — auto-detects stack from package.json, pyproject.toml, go.mod, Cargo.toml, or Gemfile
- **No LLM required** — deterministic, fast (<2s), works completely offline

## Supported Stacks

**Languages:** TypeScript, JavaScript, Python, Go, Rust, Ruby

**Frameworks:** Next.js, React, Vue, Nuxt, Svelte, SvelteKit, Angular, Astro, Remix, Express, Fastify, Hono, FastAPI, Django, Flask, Rails, Gin, Fiber, Actix, Axum, Tauri, Electron, React Native

**Libraries (with specific rules):** Prisma, Drizzle, Zod, tRPC, Tailwind CSS, React Query, Zustand, Jotai, Redux Toolkit, Radix UI, Framer Motion, Stripe, NextAuth, Lucia, Mongoose, SQLAlchemy, Pydantic, Celery, Redis, Socket.io, GraphQL

**Tooling:** pnpm, yarn, bun, npm, uv, poetry, pip, cargo, bundler | Vitest, Jest, Playwright, Cypress, pytest, RSpec | ESLint, Biome, Ruff, RuboCop | Prettier, dprint, Black

## Commands

```bash
onerules                         # Generate for all 10 tools
onerules -t claude,cursor        # Generate for specific tools only
onerules --force                 # Overwrite existing files
onerules --dry-run               # Preview without writing
onerules -d ./my-project         # Specify project directory
onerules update                  # Re-detect and regenerate all files
onerules diff                    # Show what would be generated
```

## Custom Rules (`.onerulesrc`)

Add a `.onerulesrc` file to your project root to add custom rules that get merged into all generated files. Survives `onerules update`.

```json
{
  "projectContext": "This is a fintech app handling real money.",
  "principles": ["Always explain your reasoning before writing code."],
  "doNot": ["DO NOT use any ORM. Write raw SQL queries.", "DO NOT use floating point for money. Use integers (cents)."],
  "security": ["All endpoints require authentication. No public endpoints."]
}
```

## Example Rules

Here's a taste of what gets generated for a **Next.js + TypeScript** project:

```markdown
## Do Not

- DO NOT add `'use client'` to a component just because it receives props
  or renders conditionally. Server Components can do both.
- DO NOT use `useEffect(() => { fetch('/api/...') }, [])` for data loading.
  Use a Server Component with async/await.
- DO NOT create API routes for operations that should be Server Actions.
  If a client component needs to mutate data, use a server action.
- DO NOT install `axios`. The Fetch API is built-in, cached by Next.js,
  and has extended options.

## Coding Patterns

- Inline simple logic. A 3-line helper called once is worse than 3 lines
  at the call site.
- Three similar lines are better than a premature abstraction. Do not DRY
  code until a pattern has repeated 3+ times with identical structure.
- Use discriminated unions over class hierarchies.
  `type Shape = Circle | Square` over `abstract class Shape`.
```

## Before vs After

**Without onerules** — AI generates 130 lines of over-engineered slop for "create a user API":

<p align="center">
  <img src="https://raw.githubusercontent.com/Rahulseh1998/onerules/main/before.gif" alt="Before: AI slop" width="880">
</p>

**With onerules** — same prompt, same AI, 22 lines that do the same thing:

<p align="center">
  <img src="https://raw.githubusercontent.com/Rahulseh1998/onerules/main/after.gif" alt="After: clean code" width="880">
</p>

## Why This Works

Generic rules like "follow best practices" and "write clean code" are useless — AI tools are already trained on those. They ignore them.

onerules generates rules that target **specific AI failure modes**: the `AbstractFactoryProviderManager` class nobody asked for, the `useMemo` on a function that runs once, the `try/catch` around `a + b`.

See the [full before vs after comparison](./docs/before-after.md) for side-by-side examples across Next.js, React, FastAPI, and testing.

## FAQ

**Does this replace my existing CLAUDE.md?**
No. By default, onerules skips files that already exist. Use `--force` to overwrite.

**Does this call any AI APIs?**
No. Fully deterministic. Works offline. No API keys needed.

**Can I customize the generated rules?**
Yes. Edit the generated files after running onerules. They're plain markdown.

**How is this different from awesome-cursorrules or Karpathy's CLAUDE.md?**
Those are single files for one tool. onerules generates rules for 10 tools simultaneously, tuned to your specific framework, with anti-slop rules that target AI failure modes specifically.

## Contributing

We welcome contributions! The easiest ways:

1. **Improve rules** — make the anti-slop rules sharper for any framework
2. **Add a framework** — create a fragment in `src/templates/fragments/`
3. **Add a tool** — create a generator in `src/generate/`

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT
