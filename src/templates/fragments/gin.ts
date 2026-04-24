import type { RuleSet } from "../../types.js";

export function getGinRules(): RuleSet {
  return {
    projectContext: "This is a Go application using the Gin web framework.",
    codingPatterns: [
      "Use `c.ShouldBindJSON()` for request body binding with validation tags.",
      "Use middleware for authentication, logging, CORS, and rate limiting.",
      "Use Gin's `RouterGroup` to organize routes by version or feature.",
      "Return consistent JSON error responses using a helper function.",
      "Use `c.Set()` / `c.Get()` for passing values through middleware context.",
    ],
    architecture: [
      "Separate handlers, services, and repositories into distinct packages.",
      "Use interfaces for service dependencies to enable testing.",
      "Use `gin.H{}` for quick JSON responses in handlers.",
    ],
    doNot: [
      "Do not use `c.JSON()` with inline error messages — create a consistent error response struct.",
      "Do not use `gin.Default()` in production without customizing the logger and recovery middleware.",
      "Do not panic in handlers. Return error responses via `c.AbortWithStatusJSON()`.",
    ],
  };
}
