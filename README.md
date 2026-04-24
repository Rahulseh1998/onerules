<p align="center">
  <h1 align="center">onerules</h1>
  <p align="center"><strong>Stop your AI from writing slop.</strong></p>
  <p align="center">
    One command generates anti-slop coding rules for 12 AI tools.<br>
    Detects your stack, libraries, and tooling. Works offline. Under 2 seconds.
  </p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@blackforge/onerules"><img src="https://img.shields.io/npm/v/@blackforge/onerules.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@blackforge/onerules"><img src="https://img.shields.io/npm/dm/@blackforge/onerules.svg" alt="npm downloads"></a>
  <a href="https://github.com/Rahulseh1998/onerules/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license"></a>
</p>

<p align="center">
  <a href="./docs/README.zh-CN.md">简体中文</a>
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Rahulseh1998/onerules/main/demo.gif" alt="onerules demo" width="920">
</p>

## The Problem

AI coding tools generate slop: unnecessary abstractions, wrapper classes that wrap nothing, `useMemo` on everything, try/catch around code that can't throw, `AbstractFactoryProviderManager`, and 500-line files that should be 50.

Meanwhile, your CLAUDE.md says "follow best practices" and "write clean code" — rules that AI completely ignores because they're too vague.

## How Sloppy Are Your Rules?

Run `onerules doctor` on your existing rules to find out:

<p align="center">
  <img src="https://raw.githubusercontent.com/Rahulseh1998/onerules/main/before.gif" alt="onerules doctor scoring weak rules 6/100" width="920">
</p>

Then fix them in one command:

<p align="center">
  <img src="https://raw.githubusercontent.com/Rahulseh1998/onerules/main/after.gif" alt="onerules generating anti-slop rules, scoring 100/100" width="920">
</p>

## Quick Start

```bash
# Install
npm i -g @blackforge/onerules

# Score your existing rules
onerules doctor

# Generate anti-slop rules for all 12 tools
onerules

# Or use the interactive wizard
onerules init
```

No API keys. No config. Works offline.

## What Makes This Different

These aren't generic "follow best practices" rules. Every rule targets a **specific AI slop pattern**:

```markdown
# Instead of vague rules AI ignores:
- "Follow best practices"
- "Write clean code"
- "Add proper error handling"

# You get rules that actually change AI behavior:
- DO NOT over-abstract. No AbstractFactoryProviderManager. If the class
  name needs 3+ words, it's doing too much or too little.
- DO NOT add try/catch around code that cannot throw.
- DO NOT create interfaces for a single implementation. Interface
  `IUserService` with one class `UserService` is pointless indirection.
- DO NOT install axios. The Fetch API is built-in and cached by Next.js.
```

## Stack-Aware Rules

onerules doesn't just detect your framework — it detects your **libraries** and generates rules specific to each one:

```
  onerules inspect

  Languages:    typescript
  Framework:    nextjs
  Libraries:    tailwindcss, prisma-client, zod, tanstack-react-query,
                zustand, stripe, next-auth, radix-ui-react-slot
  Package mgr:  pnpm
  Test fwk:     vitest
  Linter:       biome

  Rules that will be generated:
    ✓ base anti-slop rules
    ✓ typescript language rules
    ✓ nextjs framework rules
    ✓ tailwindcss library rules
    ✓ prisma-client library rules
    ✓ zod library rules
    ✓ tanstack-react-query library rules
    ✓ zustand library rules
    ✓ stripe library rules
    ✓ next-auth library rules
    ✓ radix-ui-react-slot library rules
    ✓ vitest testing conventions
    ✓ biome linting
```

Two Next.js projects with different libraries get different rules.

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

- **Anti-slop rules** — every rule targets a specific AI failure mode, not generic advice
- **Stack-aware** — detects your libraries and generates Prisma, Zod, Tailwind, Stripe, NextAuth-specific rules (25 libraries total)
- **`onerules doctor`** — scores your existing rules 0-100 and suggests specific fixes
- **`onerules init`** — interactive wizard with tool selection and stack preview
- **`onerules inspect`** — shows everything detected and which rules will apply
- **`onerules monorepo`** — per-workspace rules in monorepos
- **`--strict` mode** — extra aggressive rules (max function length, no default exports)
- **`--minimal` mode** — core anti-slop only, skip framework/library details
- **`.onerulesrc`** — custom rules that survive `onerules update`
- **12 AI tools, 23 frameworks, 25 libraries, 6 languages**
- **No LLM required** — deterministic, fast (<2s), works completely offline

## Commands

```bash
onerules                         # Generate for all 12 tools
onerules doctor                  # Score existing rules 0-100
onerules init                    # Interactive setup wizard
onerules inspect                 # Show detected stack + rule categories
onerules update                  # Re-detect and regenerate all files
onerules monorepo                # Generate per-workspace in monorepos
onerules diff                    # Preview what would be generated
onerules -t claude,cursor        # Generate for specific tools only
onerules --strict                # Extra aggressive rules
onerules --minimal               # Core anti-slop only
onerules --force                 # Overwrite existing files
```

## Custom Rules (`.onerulesrc`)

Add a `.onerulesrc` file to your project root. Your custom rules merge into all generated files and survive `onerules update`.

```json
{
  "projectContext": "This is a fintech app handling real money.",
  "doNot": [
    "DO NOT use floating point for money. Use integers (cents).",
    "DO NOT use any ORM. Write raw SQL queries."
  ],
  "security": ["All endpoints require authentication."]
}
```

## Supported Stacks

**Languages:** TypeScript, JavaScript, Python, Go, Rust, Ruby

**Frameworks:** Next.js, React, Vue, Nuxt, Svelte, SvelteKit, Angular, Astro, Remix, Express, Fastify, Hono, FastAPI, Django, Flask, Rails, Gin, Fiber, Actix, Axum, Tauri, Electron, React Native

**Libraries (with specific rules):** Prisma, Drizzle, Zod, tRPC, Tailwind CSS, React Query, Zustand, Jotai, Redux Toolkit, Radix UI, Framer Motion, Stripe, NextAuth, Lucia, Mongoose, SQLAlchemy, Pydantic, Celery, Redis, Socket.io, GraphQL, Three.js, Playwright, Cypress

**Tooling:** pnpm, yarn, bun, npm, uv, poetry, pip, cargo, bundler | Vitest, Jest, Playwright, Cypress, pytest, RSpec | ESLint, Biome, Ruff, RuboCop | Prettier, dprint, Black

## Why This Works

Generic rules like "follow best practices" and "write clean code" are useless — AI tools are already trained on those. They ignore them.

onerules generates rules that target **specific AI failure modes**: the `AbstractFactoryProviderManager` class nobody asked for, the `useMemo` on a function that runs once, the `try/catch` around `a + b`.

See the [full before vs after comparison](./docs/before-after.md) for side-by-side examples across Next.js, React, FastAPI, and testing.

## FAQ

**How do I know if my existing rules are any good?**
Run `onerules doctor`. It scores your rules 0-100 and tells you exactly what's weak.

**Does this replace my existing CLAUDE.md?**
Not by default. Use `--force` to overwrite. Or run `onerules doctor` first to see if your rules need replacing.

**Does this call any AI APIs?**
No. Fully deterministic. Works offline. No API keys needed.

**How is this different from awesome-cursorrules or Karpathy's CLAUDE.md?**
Those are single files for one tool. onerules generates rules for 12 tools simultaneously, tuned to your specific framework AND libraries, with anti-slop rules that target AI failure modes specifically.

**Does this work with monorepos?**
Yes. Run `onerules monorepo` to generate per-workspace rules with workspace-specific detection.

## Contributing

We welcome contributions! The easiest ways:

1. **Improve rules** — make the anti-slop rules sharper for any framework or library
2. **Add a framework** — create a fragment in `src/templates/fragments/`
3. **Add a library** — add rules in `src/templates/libraries/index.ts`
4. **Add a tool** — create a generator in `src/generate/`

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

## License

MIT
