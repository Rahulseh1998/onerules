import type { RuleSet } from "../../types.js";

export function getRemixRules(): RuleSet {
  return {
    projectContext: "This is a Remix application.",
    codingPatterns: [
      "Use `loader` for GET data. Use `action` for POST/PUT/DELETE mutations. This is the core Remix pattern.",
      "Use `<Form>` for mutations. It works without JavaScript (progressive enhancement) and with JavaScript (no page reload).",
      "Use `useFetcher()` for mutations that shouldn't navigate (like buttons, inline edits, toggles).",
      "Use `useLoaderData()` for type-safe loader data in components. Use `useActionData()` for action results.",
      "Use `json()` helper for typed responses from loaders and actions.",
    ],
    architecture: [
      "File-based routing in `app/routes/`. Dot notation for nesting: `routes/users.$id.tsx`.",
      "Route-level error boundaries via `ErrorBoundary` export. One per route, not one per component.",
      "Colocate route-specific code with the route file. Don't create a global components directory for route-specific UI.",
    ],
    doNot: [
      "DO NOT use `useEffect` for data fetching. That's the React SPA pattern. In Remix, data loading is a `loader`.",
      "DO NOT use Redux, Zustand, or React Query for server data. Loaders ARE the data layer.",
      "DO NOT use `window.fetch()` for mutations. Use `<Form>` or `useFetcher()` — they integrate with Remix's revalidation.",
      "DO NOT create API routes for internal mutations. Actions in the same route file are simpler and type-safe.",
    ],
  };
}
