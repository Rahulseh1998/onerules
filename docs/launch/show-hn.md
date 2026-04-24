# Show HN: OneRules – Stop your AI from writing slop (anti-slop rules for 12 AI tools)

**Title:** Show HN: OneRules – Stop your AI from writing slop (anti-slop rules for 12 AI tools)

**URL:** https://github.com/Rahulseh1998/onerules

**HN Comment (post immediately after submission):**

---

Hey HN, I built onerules because I was tired of my AI tools generating AbstractFactoryProviderManager classes and wrapping every function in try/catch.

The problem: every AI coding tool (Claude Code, Cursor, Copilot, etc.) has its own rules file (CLAUDE.md, .cursorrules, copilot-instructions.md...). Most people either don't have one, or have a file that says "follow best practices" — which AI completely ignores because it's too vague.

onerules does two things:

1. `onerules doctor` — scores your existing rules 0-100. It detects 12 weak patterns like "follow best practices", "write clean code", "add proper error handling" and explains WHY AI ignores them.

2. `onerules` — generates anti-slop rules for all 12 AI tools simultaneously, tuned to your detected stack. It doesn't just detect your framework — it detects your libraries (Prisma, Zod, Tailwind, Stripe, etc.) and generates rules specific to each one.

Example of what it generates vs what most people write:

    Before: "Add proper error handling"
    After: "DO NOT add try/catch around code that cannot throw. DO NOT add error handling for impossible cases. If a function only receives validated input, don't re-validate it."

It's deterministic (no LLM required), works offline, runs in <2 seconds, and has zero config. If you want project-specific rules, `onerules ai --copy` generates a prompt you paste into whatever AI tool you already have open.

Try it: `npm i -g @blackforge/onerules && onerules doctor`

Or try the web playground (no install): https://rahulseh1998.github.io/onerules/playground/

Tech: TypeScript, 2 runtime dependencies (commander + picocolors), 70 tests, CI on Node 18/20/22. MIT licensed.

---
