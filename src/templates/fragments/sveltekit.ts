import type { RuleSet } from "../../types.js";

export function getSveltekitRules(): RuleSet {
  return {
    projectContext: "This is a SvelteKit application using Svelte 5.",
    codingPatterns: [
      "Use Svelte 5 runes: `$state()` for reactive state, `$derived()` for computed values, `$effect()` for side effects. Not Svelte 4 syntax.",
      "Use `+page.server.ts` for server-side data loading. Use `+page.ts` for universal (SSR + client) loading.",
      "Use form actions in `+page.server.ts` for mutations. Use `use:enhance` for progressive enhancement.",
      "Use `$props()` for component props. Use `$bindable()` for two-way binding.",
      "Use snippets (`{#snippet}`) for content composition. Not slots (deprecated in Svelte 5).",
    ],
    architecture: [
      "File-based routing in `src/routes/`. Group with `(group)` directories.",
      "Use `$lib/` for shared code. It resolves to `src/lib/`.",
      "Use `hooks.server.ts` for request-level concerns (auth, logging).",
    ],
    doNot: [
      "DO NOT use Svelte 4 reactivity (`$:`, `export let`, `<slot>`). Use Svelte 5 runes.",
      "DO NOT use `+server.ts` (API endpoint) for operations that form actions can handle.",
      "DO NOT access `$env/static/private` in client code. It will leak server secrets.",
      "DO NOT use `$effect()` to sync state between two `$state()` values. Use `$derived()` instead.",
    ],
  };
}
