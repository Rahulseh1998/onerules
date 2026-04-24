import type { RuleSet } from "../../types.js";

export function getNuxtRules(): RuleSet {
  return {
    projectContext: "This is a Nuxt application.",
    codingPatterns: [
      "Use auto-imports — Nuxt auto-imports Vue APIs, composables, and utilities. Do not manually import `ref`, `computed`, `useState`, etc.",
      "Use `useFetch()` or `useAsyncData()` for data fetching in components. These handle SSR hydration automatically.",
      "Use `$fetch` for client-side API calls outside of components.",
      "Use `useState()` for shared state across components. It's SSR-safe.",
      "Use `definePageMeta()` for page-level metadata (layout, middleware).",
      "Use `useHead()` or `useSeoMeta()` for SEO metadata.",
    ],
    architecture: [
      "Use the `server/` directory for API routes (`server/api/`) and middleware (`server/middleware/`).",
      "Use `composables/` for shared composables — they are auto-imported.",
      "Use `layouts/` for page layouts. Use `<NuxtLayout>` in `app.vue`.",
      "Use Nuxt modules for reusable features. Check `nuxt.com/modules` before building custom solutions.",
    ],
    doNot: [
      "Do not use `axios` or raw `fetch` — use `useFetch()` or `$fetch` which handle SSR correctly.",
      "Do not use Vue Router directly — use file-based routing in `pages/`.",
      "Do not import from `#imports` manually — auto-imports handle this.",
    ],
  };
}
