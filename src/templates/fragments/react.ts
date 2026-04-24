import type { RuleSet } from "../../types.js";

export function getReactRules(): RuleSet {
  return {
    codingPatterns: [
      "Use functional components with hooks. Never use class components.",
      "Use `useState` for local state, `useReducer` for complex state logic.",
      "Extract reusable logic into custom hooks prefixed with `use`.",
      "Use `React.memo` only when profiling shows unnecessary re-renders.",
      "Use `useCallback` and `useMemo` sparingly — only when dependency arrays are stable and the computation is expensive.",
    ],
    doNot: [
      "Do not mutate state directly. Always use the setter function.",
      "Do not use array index as `key` in lists that reorder.",
      "Do not call hooks conditionally or inside loops.",
      "Do not use `useEffect` for derived state — compute it during render.",
    ],
  };
}
