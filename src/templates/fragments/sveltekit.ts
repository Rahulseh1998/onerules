import type { RuleSet } from "../../types.js";

export function getSveltekitRules(): RuleSet {
  return {
    projectContext: "This is a SvelteKit application.",
    codingPatterns: [
      "Use Svelte 5 runes: `$state()` for reactive state, `$derived()` for computed values, `$effect()` for side effects.",
      "Use `+page.server.ts` for server-side data loading. Use `+page.ts` for universal (SSR + client) loading.",
      "Use form actions (`+page.server.ts` `actions`) for form submissions. Use progressive enhancement with `use:enhance`.",
      "Use `$props()` for component props. Use `$bindable()` for two-way binding.",
      "Use snippets (`{#snippet}`) instead of slots for content composition.",
    ],
    architecture: [
      "Use file-based routing in `src/routes/`. Group routes with `(group)` directories.",
      "Use `+layout.server.ts` for shared data loading across routes.",
      "Use `$lib/` alias for shared code (`src/lib/`).",
      "Use `hooks.server.ts` for request-level middleware (auth, logging).",
    ],
    doNot: [
      "Do not use Svelte 4 syntax (`$:`, `export let`, `<slot>`). Use Svelte 5 runes instead.",
      "Do not mutate `$state()` arrays with push/pop — use reassignment or `$state.snapshot()`.",
      "Do not use `+server.ts` for pages. Use `+page.server.ts` with form actions.",
      "Do not access `$env/static/private` in client-side code.",
    ],
  };
}
