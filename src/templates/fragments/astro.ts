import type { RuleSet } from "../../types.js";

export function getAstroRules(): RuleSet {
  return {
    projectContext: "This is an Astro application.",
    codingPatterns: [
      "Use `.astro` components for static/server-rendered content. Use framework components (React, Vue, Svelte) only for interactive islands.",
      "Use content collections (`src/content/`) with schemas for typed content (blog posts, docs, etc.).",
      "Use `Astro.props` for component props. Define prop types with TypeScript interfaces.",
      "Use `getCollection()` and `getEntry()` for querying content collections.",
      "Use `<Image />` from `astro:assets` for optimized images.",
    ],
    architecture: [
      "Use file-based routing in `src/pages/`. Use `[...slug].astro` for dynamic routes.",
      "Use layouts (`src/layouts/`) for shared page structure.",
      "Use `client:*` directives for hydration: `client:load`, `client:idle`, `client:visible`.",
      "Prefer zero-JS by default. Only add client-side JavaScript when interactivity requires it.",
    ],
    performance: [
      "Use `client:idle` or `client:visible` instead of `client:load` for non-critical interactive components.",
      "Use View Transitions for page navigation animations.",
      "Leverage static site generation (SSG) by default. Use SSR only when needed.",
    ],
    doNot: [
      "Do not use React/Vue/Svelte for static content. Use `.astro` components instead.",
      "Do not use `client:load` for components below the fold — use `client:visible`.",
      "Do not put interactive framework components in layouts unless they need hydration.",
    ],
  };
}
