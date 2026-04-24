import type { RuleSet } from "../../types.js";

export function getGinRules(): RuleSet {
  return {
    projectContext: "This is a Go application using the Gin web framework.",
    codingPatterns: [
      "Use `c.ShouldBindJSON()` for request body binding with struct validation tags. Don't parse JSON manually.",
      "Use middleware for auth, logging, CORS, rate limiting. Register at the router group level.",
      "Use `RouterGroup` to organize routes: `v1 := r.Group(\"/api/v1\")`. Not flat routes.",
      "Return consistent error responses. Create ONE error response helper and use it everywhere.",
      "Use `c.Set()`/`c.Get()` for passing data through the middleware chain (current user, request ID).",
    ],
    doNot: [
      "DO NOT create a handler interface with 15 methods and a base handler struct. Handlers are functions. Keep them as functions.",
      "DO NOT use `gin.Default()` in production without understanding it includes Logger and Recovery. Configure explicitly.",
      "DO NOT panic in handlers. Return error responses with `c.AbortWithStatusJSON()`.",
      "DO NOT create a separate response struct for every endpoint. Reuse response types across similar endpoints.",
    ],
  };
}
