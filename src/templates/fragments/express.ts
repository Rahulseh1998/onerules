import type { RuleSet } from "../../types.js";

export function getExpressRules(): RuleSet {
  return {
    projectContext: "This is an Express.js application.",
    codingPatterns: [
      "Use `express.Router()` to organize routes by feature/domain.",
      "Use middleware for cross-cutting concerns (auth, logging, validation, error handling).",
      "Always pass errors to `next(error)` in async handlers. Use a wrapper for async route handlers.",
      "Use `express.json()` and `express.urlencoded()` for body parsing.",
      "Validate request bodies with zod, joi, or express-validator before processing.",
    ],
    architecture: [
      "Separate routes, controllers, services, and data access layers.",
      "Use a centralized error handler as the last middleware: `app.use((err, req, res, next) => ...)`.",
      "Use environment variables for configuration. Never hardcode ports, URLs, or secrets.",
    ],
    security: [
      "Use `helmet` for security headers.",
      "Use `cors` middleware with explicit origins. Never use `cors()` without options in production.",
      "Use rate limiting (`express-rate-limit`) for public endpoints.",
      "Sanitize user input. Use parameterized queries for database operations.",
    ],
    doNot: [
      "Do not use `app.use(cors())` without specifying allowed origins in production.",
      "Do not send stack traces in error responses. Use generic messages in production.",
      "Do not store sessions in memory. Use Redis or a database-backed session store.",
    ],
  };
}
