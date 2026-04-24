import type { RuleSet } from "../../types.js";

export function getExpressRules(): RuleSet {
  return {
    projectContext: "This is an Express.js application.",
    codingPatterns: [
      "Use `express.Router()` for route groups. One file per feature, not one giant app.js.",
      "Async errors MUST be caught. Use a wrapper: `const asyncHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next)`. Or use express-async-errors.",
      "Validate request bodies with zod or joi at the route level. Don't validate deep inside business logic.",
      "One centralized error handler as the LAST middleware. `app.use((err, req, res, next) => ...)`. Don't try/catch in every route.",
      "Use middleware for cross-cutting concerns: auth, rate limiting, request logging. Not for business logic.",
    ],
    architecture: [
      "Separate routes from business logic. Route handler parses request → calls a function → sends response. That's it.",
      "Use environment variables for config. `process.env.PORT`, not `const PORT = 3000`.",
    ],
    security: [
      "Use `helmet()` for security headers. One line of code, significant protection.",
      "Use `cors()` with explicit `origin` whitelist. Never `cors()` with no options in production.",
      "Rate limit public endpoints. `express-rate-limit` is one line to add.",
    ],
    doNot: [
      "DO NOT create an AbstractRouterControllerBase or ControllerFactory. Express routes are functions. Keep them as functions.",
      "DO NOT create a service layer with interfaces for a simple Express app. A function that talks to the database is fine.",
      "DO NOT store sessions in memory. It leaks and doesn't scale. Use Redis or a database.",
      "DO NOT send stack traces in production error responses. Generic error message to the client, detailed log to the server.",
    ],
  };
}
