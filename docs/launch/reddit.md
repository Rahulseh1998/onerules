# Reddit Launch Posts

## r/programming

**Title:** I built a CLI that scores your AI coding rules 0-100 and generates anti-slop replacements for 21 AI tools

**Body:**
Every AI coding tool has its own rules file (CLAUDE.md, .cursorrules, copilot-instructions.md, etc.). Most either don't exist or say "follow best practices" — which AI completely ignores.

I built `onerules` to fix this:

- `onerules doctor` — scores your existing rules 0-100 and tells you what's weak
- `onerules` — generates anti-slop rules for 21 tools at once, tuned to your stack and libraries
- `onerules ai --copy` — generates a prompt for project-specific rules via your existing AI

It detects your framework (23 supported), your libraries (Prisma, Zod, Tailwind, Stripe — 25 total), and generates rules that target specific AI failure modes. Not "write clean code" but "DO NOT create AbstractFactoryProviderManager. DO NOT add try/catch around code that cannot throw."

No LLM needed. Offline. <2 seconds. MIT licensed.

Try it: `npm i -g @blackforge/onerules && onerules doctor`

Web playground (no install): https://rahulseh1998.github.io/onerules/playground/

GitHub: https://github.com/Rahulseh1998/onerules

---

## r/ClaudeAI

**Title:** I built a tool that generates better CLAUDE.md files — scores your existing one and tells you what's weak

**Body:**
My CLAUDE.md used to say "follow best practices" and "write clean code". Turns out Claude ignores these because they're too vague.

I built `onerules doctor` — it scores your CLAUDE.md 0-100 and tells you exactly what's weak:

```
CLAUDE.md — Score: 6/100
  ⚠ "Follow best practices" is too vague — AI ignores it
  ⚠ "Write clean code" is meaningless to an AI
  ⚠ "Add proper error handling" leads to try/catch around everything
  ✗ Missing: DO NOT rules
  ✗ Missing: Security rules
```

Then `onerules --force` generates anti-slop rules that actually change behavior:

- "DO NOT over-abstract. No AbstractFactoryProviderManager."
- "DO NOT add try/catch around code that cannot throw."
- "DO NOT install axios. Fetch is built-in and cached by Next.js."

It auto-detects your stack (framework + libraries) and generates rules specific to your project. Also generates for Cursor, Copilot, Gemini CLI, and 8 other tools simultaneously.

Try it: `npm i -g @blackforge/onerules && onerules doctor`

---

## r/cursor

**Title:** One command generates .cursorrules tuned to your stack — detects your framework and libraries automatically

**Body:**
Instead of copy-pasting from awesome-cursorrules, I built a tool that auto-detects your stack and generates rules specific to your project.

Run `onerules` in your project and it generates `.cursor/rules/onerules.mdc` with:
- Framework-specific rules (Next.js, React, Vue, etc.)
- Library-specific rules (if you use Prisma, it adds Prisma-specific DO NOT rules)
- Anti-slop rules that target specific AI failure modes

It also generates CLAUDE.md, copilot-instructions.md, and 9 other tool formats simultaneously. So if you use both Cursor and Claude Code, one command covers both.

`onerules doctor` scores your existing .cursorrules first so you know if you need it.

GitHub: https://github.com/Rahulseh1998/onerules
