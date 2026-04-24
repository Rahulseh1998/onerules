import type { RuleSet } from "../../types.js";

export function getAngularRules(): RuleSet {
  return {
    projectContext: "This is an Angular application.",
    codingPatterns: [
      "Use standalone components by default. Avoid NgModules for new components.",
      "Use signals (`signal()`, `computed()`, `effect()`) for reactive state management.",
      "Use the `inject()` function for dependency injection instead of constructor injection.",
      "Use `@defer` blocks for lazy loading components.",
      "Use the new control flow syntax (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`.",
      "Use `input()`, `output()`, and `model()` signal-based APIs for component I/O.",
    ],
    architecture: [
      "Organize by feature, not by type. Each feature gets its own directory with components, services, and models.",
      "Use services for business logic and data access. Components should only handle presentation.",
      "Use route-level lazy loading with `loadComponent` for code splitting.",
      "Use interceptors for cross-cutting HTTP concerns (auth headers, error handling).",
    ],
    doNot: [
      "Do not use `any` type. Angular's strict mode should be enabled.",
      "Do not subscribe to Observables in components without managing unsubscription. Use `async` pipe or `takeUntilDestroyed()`.",
      "Do not use `NgModules` for new code. Use standalone components.",
      "Do not use `*ngIf` or `*ngFor` structural directives. Use `@if` and `@for` control flow.",
    ],
    testing: [
      "Use `TestBed` for component and service tests.",
      "Use `HttpTestingController` for HTTP service tests.",
      "Prefer testing component behavior over implementation details.",
    ],
  };
}
