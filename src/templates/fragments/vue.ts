import type { RuleSet } from "../../types.js";

export function getVueRules(): RuleSet {
  return {
    projectContext: "This is a Vue application.",
    codingPatterns: [
      "Use the Composition API with `<script setup>`. Avoid the Options API for new code.",
      "Use `ref()` for primitives and `reactive()` for objects. Prefer `ref()` when in doubt.",
      "Use `computed()` for derived state. Never mutate computed values.",
      "Use `watchEffect()` for side effects that track dependencies automatically. Use `watch()` when you need explicit dependency control.",
      "Use `defineProps()` and `defineEmits()` with TypeScript generics for type-safe component APIs.",
      "Use `v-model` for two-way binding. Use `defineModel()` in child components.",
    ],
    architecture: [
      "Organize by feature, not by type. Colocate components, composables, and utilities.",
      "Extract reusable logic into composables (`use*.ts`).",
      "Use `provide/inject` for deeply nested dependency sharing. Avoid prop drilling beyond 2 levels.",
    ],
    doNot: [
      "Do not mutate props. Emit events or use `defineModel()` instead.",
      "Do not use `this` in `<script setup>` — it doesn't exist.",
      "Do not mix Options API and Composition API in the same component.",
      "Do not use `v-if` and `v-for` on the same element.",
    ],
  };
}
