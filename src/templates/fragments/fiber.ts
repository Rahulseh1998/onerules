import type { RuleSet } from "../../types.js";

export function getFiberRules(): RuleSet {
  return {
    projectContext: "This is a Go application using the Fiber web framework.",
    codingPatterns: [
      "Use `c.BodyParser()` for request body parsing with struct tags for validation.",
      "Use Fiber's built-in middleware for common concerns (CORS, Logger, Recover, Limiter).",
      "Use route groups (`app.Group()`) to organize routes by version or feature.",
      "Return JSON responses with `c.JSON()` and set status with `c.Status()`.",
      "Use `c.Locals()` to pass data between middleware and handlers.",
    ],
    architecture: [
      "Separate handlers, services, and repository layers.",
      "Use interfaces for dependencies to enable testing and mocking.",
      "Use `app.Use()` for middleware registration. Order matters.",
    ],
    doNot: [
      "Do not use `c.Next()` without understanding the middleware chain.",
      "Do not store references to `c` (Fiber context) outside the handler — it's pooled and reused.",
      "Do not use `panic` for error handling. Return errors via `c.Status().JSON()`.",
    ],
  };
}
