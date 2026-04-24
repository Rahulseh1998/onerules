import type { RuleSet } from "../../types.js";

export function getNextjsRules(): RuleSet {
  return {
    projectContext: "This is a Next.js application using the App Router.",
    codingPatterns: [
      "Use Server Components by default. Only add 'use client' when the component needs interactivity, event handlers, or browser APIs.",
      "Use `next/image` for all images. Always provide width, height, or fill prop.",
      "Use `next/link` for internal navigation. Never use `<a>` tags for internal links.",
      "Use `next/font` for font loading. Do not use @import or <link> for fonts.",
      "Colocate related files: place components, hooks, and utilities close to where they're used.",
      "Use Route Groups `(folder)` to organize routes without affecting the URL.",
      "For data fetching, use Server Components with `async/await`. Use `fetch` with caching options.",
      "Use `loading.tsx` for streaming and `error.tsx` for error boundaries.",
      "Use Server Actions for form submissions and mutations. Define with 'use server'.",
    ],
    architecture: [
      "Keep the `app/` directory for routes and layouts only. Shared components go in `src/components/`.",
      "Use `layout.tsx` for shared UI. Use `template.tsx` only when you need re-mounting on navigation.",
      "Prefer Parallel Routes and Intercepting Routes over client-side modals.",
    ],
    performance: [
      "Use dynamic imports (`next/dynamic`) for heavy client components.",
      "Use `React.Suspense` boundaries to enable streaming.",
      "Prefer `generateStaticParams` for static pages.",
      "Use `revalidateTag` or `revalidatePath` for on-demand ISR.",
    ],
    doNot: [
      "Do not use `useEffect` for data fetching. Use Server Components instead.",
      "Do not use `getServerSideProps` or `getStaticProps` — those are Pages Router patterns.",
      "Do not put API logic in client components. Use Server Actions or Route Handlers.",
      "Do not import server-only code in client components.",
    ],
  };
}
