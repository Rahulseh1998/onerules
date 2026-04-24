import type { RuleSet } from "../../types.js";

export function getAstroRules(): RuleSet {
  return {
    projectContext: "This is an Astro application.",
    codingPatterns: [
      "Use `.astro` components for everything static. Only use React/Vue/Svelte islands for INTERACTIVE elements that need JavaScript.",
      "Use content collections with Zod schemas for typed content (blog posts, docs). Not raw file reads.",
      "Use `<Image />` from `astro:assets` for optimized images. Not raw `<img>` tags.",
      "Use `client:visible` or `client:idle` for islands below the fold. Not `client:load` for everything.",
    ],
    architecture: [
      "File-based routing in `src/pages/`. Layouts in `src/layouts/`.",
      "Zero JS by default. Every `client:*` directive you add is JavaScript you're shipping. Be deliberate.",
      "Use View Transitions for smooth navigation between pages.",
    ],
    doNot: [
      "DO NOT use React/Vue components for static content. An `.astro` component renders to zero JavaScript.",
      "DO NOT use `client:load` on every island. Most islands can wait for `client:visible` or `client:idle`.",
      "DO NOT put a React app inside an Astro layout. That defeats the purpose. Use Astro for the page, React only for interactive widgets.",
      "DO NOT fetch data in island components. Fetch in the `.astro` page and pass data as props to islands.",
    ],
  };
}
