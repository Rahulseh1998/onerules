import type { RuleSet } from "../../types.js";

export function getNuxtRules(): RuleSet {
  return {
    projectContext: "This is a Nuxt application.",
    codingPatterns: [
      "Nuxt auto-imports Vue APIs and composables. Do NOT manually import `ref`, `computed`, `useState`, `useFetch`. They're available globally.",
      "Use `useFetch()` or `useAsyncData()` for data fetching in components. They handle SSR hydration automatically — raw `fetch()` in onMounted does not.",
      "Use `$fetch` (ofetch) for API calls in event handlers or non-component code. It's Nuxt's built-in fetch wrapper.",
      "Use `useState()` for cross-component shared state. It's SSR-safe unlike raw `ref()` at module scope.",
      "Use `useHead()` or `useSeoMeta()` for page metadata. Not raw `<meta>` tags in templates.",
    ],
    architecture: [
      "API routes go in `server/api/`. Middleware in `server/middleware/`. Nuxt handles the routing.",
      "Composables in `composables/` are auto-imported. Utilities in `utils/` are auto-imported. Don't manually import them.",
      "Use Nuxt modules before building custom solutions. Check nuxt.com/modules first.",
    ],
    doNot: [
      "DO NOT install axios. `useFetch()` and `$fetch` handle everything axios does, with SSR support built-in.",
      "DO NOT use Vue Router directly. File-based routing in `pages/` is the Nuxt way.",
      "DO NOT import from `#imports` manually. Auto-imports handle this transparently.",
      "DO NOT create a Pinia store for server data that `useFetch` can handle. Stores are for client-side interactive state.",
    ],
  };
}
