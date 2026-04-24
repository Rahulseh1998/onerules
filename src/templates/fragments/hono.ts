import type { RuleSet } from "../../types.js";

export function getHonoRules(): RuleSet {
  return {
    projectContext: "This is a Hono application.",
    codingPatterns: [
      "Use `Hono` generics for typed environment bindings: `new Hono<{ Bindings: Env }>()`.",
      "Use `zValidator()` middleware for request validation with Zod schemas.",
      "Use `c.json()`, `c.text()`, `c.html()` for typed responses.",
      "Use middleware with `app.use()` for cross-cutting concerns.",
      "Use `hono/factory` `createFactory()` for creating reusable handlers with typed context.",
    ],
    architecture: [
      "Use `app.route()` to compose sub-applications by feature.",
      "Use RPC mode (`hc` client) for end-to-end type safety between server and client.",
      "Hono is runtime-agnostic. Prefer Web Standard APIs (Request, Response, fetch) over Node-specific APIs.",
    ],
    doNot: [
      "Do not use Node.js `req`/`res` patterns. Use Hono's `c` (context) object.",
      "Do not import Node-specific modules when targeting edge runtimes (Cloudflare Workers, Deno).",
    ],
  };
}
