import type { RuleSet } from "../../types.js";

export function getSvelteRules(): RuleSet {
  return {
    projectContext: "This is a Svelte 5 application.",
    codingPatterns: [
      "Use Svelte 5 runes: `$state()` for reactive state, `$derived()` for computed values, `$effect()` for side effects.",
      "Use `$props()` for component props. Use `$bindable()` for two-way binding.",
      "Use snippets (`{#snippet}`) for content composition instead of slots.",
      "Svelte compiles away — write plain JS/TS. No virtual DOM, no hooks rules, no re-render anxiety.",
    ],
    doNot: [
      "DO NOT use Svelte 4 syntax (`$:` reactive declarations, `export let` for props, `<slot>`). Use Svelte 5 runes.",
      "DO NOT use `$effect()` to sync two `$state()` values. Use `$derived()` instead.",
      "DO NOT create stores for state that lives in one component. `$state()` is sufficient.",
    ],
  };
}
