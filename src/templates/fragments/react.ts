import type { RuleSet } from "../../types.js";

export function getReactRules(): RuleSet {
  return {
    codingPatterns: [
      "Functional components only. No class components. No `React.FC` — it's unnecessary and adds implicit `children` prop.",
      "State goes as close to where it's used as possible. Don't lift state 'in case we need it later'. Lift it when you actually need it.",
      "Derived state should be computed during render, not stored in state. If `fullName` is `first + last`, compute it — don't `useState` it and sync with `useEffect`.",
      "Custom hooks should encapsulate BEHAVIOR, not just wrap a single useState. `useWindowSize` is a good hook. `useUserName` that wraps `useState('')` is not.",
      "Props should be minimal. If you're passing 8+ props, the component is doing too much or needs composition.",
    ],
    doNot: [
      "DO NOT use `useMemo` or `useCallback` by default. Only add them when you've measured a performance problem. React re-renders are fast — premature memoization adds complexity for zero benefit.",
      "DO NOT create a context for every piece of shared state. Prop drilling 2-3 levels is fine and more readable than context indirection.",
      "DO NOT use `useEffect` for data fetching. Use your framework's data loading (Next.js loaders, Remix loaders, React Query, SWR).",
      "DO NOT use `useEffect` to sync state. If changing `A` should change `B`, compute `B` from `A` during render. The `useState` + `useEffect` sync pattern is the #1 React antipattern.",
      "DO NOT use array index as `key` in lists that can reorder, filter, or insert. Use a stable ID.",
      "DO NOT create wrapper components that just pass all props through. `<Button>` that wraps `<button>` without adding behavior is noise.",
      "DO NOT put event handlers in useCallback unless the handler is passed to a memoized child. The closure re-creation is negligible.",
    ],
  };
}
