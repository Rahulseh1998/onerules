import type { RuleSet } from "../../types.js";

export function getAngularRules(): RuleSet {
  return {
    projectContext: "This is an Angular application.",
    codingPatterns: [
      "Use standalone components. No NgModules for new code — they're legacy.",
      "Use signals: `signal()` for state, `computed()` for derived values, `effect()` for side effects. Not BehaviorSubject for everything.",
      "Use `inject()` for dependency injection, not constructor injection. Cleaner and works in functions.",
      "Use `@defer` blocks for lazy loading components. Not dynamic imports with ViewContainerRef.",
      "Use new control flow: `@if`, `@for`, `@switch`. Not `*ngIf`, `*ngFor`, `*ngSwitch`.",
      "Use `input()`, `output()`, `model()` signal-based APIs. Not `@Input()` and `@Output()` decorators.",
    ],
    architecture: [
      "Organize by feature. Each feature is a standalone component tree with its own routes, services, and models.",
      "Use lazy loading with `loadComponent` in routes for code splitting.",
      "Services hold business logic and state. Components handle presentation only.",
    ],
    doNot: [
      "DO NOT create NgModules. Standalone components are the standard since Angular 17.",
      "DO NOT use `*ngIf` or `*ngFor`. Use `@if` and `@for` control flow.",
      "DO NOT subscribe to Observables in components without cleanup. Use `async` pipe in templates or `takeUntilDestroyed()` in code.",
      "DO NOT create a base component class that 30 components extend. Angular composition > inheritance.",
      "DO NOT use `any`. Enable strict mode. If types are hard, the architecture is wrong.",
    ],
  };
}
