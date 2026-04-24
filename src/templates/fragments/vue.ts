import type { RuleSet } from "../../types.js";

export function getVueRules(): RuleSet {
  return {
    projectContext: "This is a Vue application using the Composition API.",
    codingPatterns: [
      "Use `<script setup>` for all components. No Options API for new code.",
      "Use `ref()` for primitives, `reactive()` for objects. When in doubt, use `ref()` — it's more predictable.",
      "Use `computed()` for derived values. If you're watching a value to update another value, you want `computed()` instead.",
      "Use `defineProps()` and `defineEmits()` with TypeScript generics for type-safe component APIs.",
      "Use `watchEffect()` for side effects that should re-run when dependencies change. Use `watch()` only when you need the old value or explicit dependency control.",
    ],
    architecture: [
      "Extract reusable reactive logic into composables (`use*.ts`). A composable returns refs and functions, not components.",
      "Use `provide/inject` for deep dependency passing (theme, auth, config). Don't prop-drill beyond 2 levels.",
      "Organize by feature, not by type. `features/auth/` with components, composables, and types together.",
    ],
    doNot: [
      "DO NOT use Options API (`data()`, `methods:`, `computed:`, `watch:`) in new code. Composition API with `<script setup>` is the standard.",
      "DO NOT mutate props. Use `defineEmits()` or `defineModel()` for two-way binding.",
      "DO NOT use `v-if` and `v-for` on the same element. `v-if` has priority and creates confusing behavior.",
      "DO NOT create a Vuex/Pinia store for state that's only used in one component tree. Local state or composables are simpler.",
      "DO NOT use `this` in `<script setup>`. It doesn't exist.",
    ],
  };
}
