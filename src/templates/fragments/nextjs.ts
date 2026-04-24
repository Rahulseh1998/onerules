import type { RuleSet } from "../../types.js";

export function getNextjsRules(): RuleSet {
  return {
    projectContext: "This is a Next.js App Router application.",
    codingPatterns: [
      "Components are Server Components by default. Only add `'use client'` when the component NEEDS browser APIs, event handlers, or useState/useEffect. Not every component that renders dynamic data needs `'use client'`.",
      "Data fetching happens in Server Components with async/await or in server actions. Never fetch data in client components with useEffect — that defeats the purpose of Server Components.",
      "Use `next/image` for images. Always set width+height or use `fill`. Never use raw `<img>` tags — they skip optimization.",
      "Use `next/link` for navigation. Never use `<a>` for internal routes or `window.location` for navigation.",
      "Server Actions (`'use server'`) for mutations. Not API routes. Not client-side fetch to custom endpoints.",
      "Use `loading.tsx` for suspense boundaries, `error.tsx` for error boundaries. These are built-in — don't reinvent them with custom loading states in every component.",
      "Use Route Groups `(folder)` to organize without affecting URLs. Use `[slug]` for dynamic segments. Use `[...catchAll]` for catch-all routes.",
    ],
    architecture: [
      "The `app/` directory is for routes only. Shared components → `src/components/`. Shared utilities → `src/lib/`.",
      "One layout per logical section. Don't create a layout for every route — layouts are for SHARED UI.",
      "Colocate. If a component is only used in one route, put it in that route's directory, not in a global components folder.",
    ],
    performance: [
      "Use `React.Suspense` boundaries to stream content. Don't block the whole page on one slow query.",
      "Use `dynamic(() => import())` for heavy client components that aren't needed on initial render.",
      "Use `generateStaticParams` for pages that can be statically generated. Don't SSR what can be SSG.",
    ],
    doNot: [
      "DO NOT add `'use client'` to a component just because it receives props or renders conditionally. Server Components can do both.",
      "DO NOT use `getServerSideProps` or `getStaticProps`. Those are Pages Router — this is App Router.",
      "DO NOT create API routes (`route.ts`) for operations that should be Server Actions. If a client component needs to mutate data, use a server action, not a REST endpoint.",
      "DO NOT wrap every page in its own custom loading/error component. Use the file-convention `loading.tsx` and `error.tsx`.",
      "DO NOT use `useEffect(() => { fetch('/api/...') }, [])` for data loading. Use a Server Component with async/await.",
      "DO NOT install `axios`. The Fetch API is built-in, cached by Next.js, and has extended options. `axios` adds 14KB for nothing.",
    ],
  };
}
