import type { RuleSet } from "../../types.js";

export function getRemixRules(): RuleSet {
  return {
    projectContext: "This is a Remix application.",
    codingPatterns: [
      "Use `loader` functions for GET data fetching. Use `action` functions for mutations (POST, PUT, DELETE).",
      "Use `useLoaderData()` for type-safe access to loader data in components.",
      "Use `<Form>` component for mutations with progressive enhancement. Falls back to standard HTML forms without JS.",
      "Use `useFetcher()` for mutations that don't navigate (like/save buttons, inline edits).",
      "Use `useNavigation()` to show loading states during transitions.",
      "Use `json()` helper for typed JSON responses from loaders and actions.",
    ],
    architecture: [
      "Use file-based routing in `app/routes/`. Use dot notation for nested routes (`routes/users.$id.tsx`).",
      "Use `root.tsx` for the document layout (html, head, body).",
      "Use route-level error boundaries (`ErrorBoundary` export) for per-route error handling.",
      "Colocate route-specific components and utilities with their route files.",
    ],
    doNot: [
      "Do not use `useEffect` for data fetching. Use `loader` functions instead.",
      "Do not use client-side state management (Redux, Zustand) for server data. Use loaders.",
      "Do not use `window.fetch` for mutations. Use `<Form>` or `useFetcher()`.",
      "Do not import server-only code (database, secrets) in component files — keep it in loaders/actions.",
    ],
  };
}
