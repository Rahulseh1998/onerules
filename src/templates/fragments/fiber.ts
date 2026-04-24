import type { RuleSet } from "../../types.js";

export function getFiberRules(): RuleSet {
  return {
    projectContext: "This is a Go application using the Fiber web framework.",
    codingPatterns: [
      "Use `c.BodyParser()` for request body parsing with struct validation tags.",
      "Use Fiber's built-in middleware: CORS, Logger, Recover, Limiter. Don't rewrite what's included.",
      "Use route groups: `api := app.Group(\"/api/v1\")`. Not flat routes in one file.",
      "Use `c.Locals()` to pass data between middleware and handlers (user, request ID).",
    ],
    doNot: [
      "DO NOT store references to `c` (Fiber context) outside the handler. Fiber pools and reuses context objects — storing a reference causes data races.",
      "DO NOT create handler interfaces or base handler structs. Fiber handlers are `func(c *fiber.Ctx) error`. Keep them as functions.",
      "DO NOT use `panic` for error handling. Return `c.Status(500).JSON(errorResponse)`.",
    ],
  };
}
