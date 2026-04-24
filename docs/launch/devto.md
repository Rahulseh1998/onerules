# Dev.to Article Draft

**Title:** My CLAUDE.md scored 6/100. Here's the tool I built to fix it.

**Tags:** ai, webdev, typescript, opensource

---

Every AI coding tool has its own rules file:

| Tool | File |
|------|------|
| Claude Code | CLAUDE.md |
| Cursor | .cursorrules |
| GitHub Copilot | .github/copilot-instructions.md |
| OpenAI Codex | AGENTS.md |
| Gemini CLI | GEMINI.md |
| ...and 7 more | ... |

Most developers either don't have one, or have something like this:

```markdown
# Rules
- Follow best practices
- Write clean code
- Use TypeScript
- Add proper error handling
```

I ran my own tool's `doctor` command on this and it scored **6 out of 100**.

Why? Because every one of those rules is too vague for an AI to act on:

- "Follow best practices" → AI already thinks it does this
- "Write clean code" → means nothing actionable
- "Add proper error handling" → AI interprets this as "wrap everything in try/catch"

## The Problem: AI Slop

AI coding tools generate specific types of bad code:

1. **AbstractFactoryProviderManager** — unnecessary abstractions nobody asked for
2. **try/catch around `a + b`** — error handling for code that can't throw
3. **`IUserService` + `UserService`** — interfaces for single implementations
4. **`useMemo` on everything** — premature optimization that adds complexity
5. **Installing axios** — when fetch is built-in and cached by Next.js

Generic rules don't prevent any of this. You need rules that target these specific failure modes.

## What I Built

[onerules](https://github.com/Rahulseh1998/onerules) is a CLI that:

1. **Scores your existing rules** (`onerules doctor`) — 0-100 with specific suggestions
2. **Generates anti-slop rules** (`onerules`) — for 12 AI tools simultaneously
3. **Detects your stack** — framework, libraries, tooling — and generates rules specific to each

### The Doctor

```bash
$ onerules doctor

CLAUDE.md — Score: 6/100
  ⚠ "Follow best practices" is too vague — AI ignores it
  ⚠ "Write clean code" is meaningless to an AI
  ⚠ "Add proper error handling" leads to try/catch around everything
  ✗ Missing: DO NOT rules
  ✗ Missing: Security rules
```

### The Generator

```bash
$ onerules

Detected: Next.js + TypeScript + Prisma + Zod + Tailwind + pnpm

Generated 12 files:
  ✓ CLAUDE.md                    (Claude Code)
  ✓ .cursor/rules/onerules.mdc   (Cursor)
  ✓ .github/copilot-instructions.md (GitHub Copilot)
  ...and 9 more
```

### What Gets Generated

Instead of "follow best practices", you get:

```markdown
## Do Not

- DO NOT over-abstract. No AbstractFactoryProviderManager. If the class
  name needs 3+ words to describe what it does, it's doing too much.
- DO NOT add try/catch around code that cannot throw.
- DO NOT create interfaces for a single implementation.
- DO NOT install axios. Fetch is built-in and cached by Next.js.
- DO NOT use useMemo or useCallback by default. Only add them when
  you've measured a performance problem.
```

### Library-Aware

If your project uses Prisma:

```markdown
- DO NOT create a repository wrapper around Prisma. Prisma IS the
  repository. db.users.findMany() is already clean.
```

If you use Zustand:

```markdown
- DO NOT put server data in Zustand. Use React Query for server state.
```

Two Next.js projects with different libraries get different rules.

## Try It

```bash
npm i -g @blackforge/onerules

# Score your existing rules
onerules doctor

# Generate anti-slop rules
onerules

# Want project-specific rules? Use your existing AI
onerules ai --copy
```

Or try the [web playground](https://rahulseh1998.github.io/onerules/playground/) — no install needed.

## Stats

- 12 AI tools, 23 frameworks, 25 libraries, 6 languages
- Deterministic (no LLM), offline, <2 seconds
- 70 tests, CI on Node 18/20/22
- 2 runtime dependencies
- MIT licensed

GitHub: [Rahulseh1998/onerules](https://github.com/Rahulseh1998/onerules)
npm: [@blackforge/onerules](https://www.npmjs.com/package/@blackforge/onerules)
