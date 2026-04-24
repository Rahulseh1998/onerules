import type { RuleSet } from "../../types.js";

export function getHonoRules(): RuleSet {
  return {
    projectContext: "This is a Hono application.",
    codingPatterns: [
      "Use Hono generics for typed env bindings: `new Hono<{ Bindings: Env }>()`. Type the context once.",
      "Use `zValidator()` for request validation. Zod schemas in, typed data out. Don't validate manually.",
      "Use `c.json()`, `c.text()`, `c.html()` for typed responses. Not raw `new Response()`.",
      "Use `app.route()` to compose sub-apps. One file per feature.",
      "Use RPC mode with `hc` client for end-to-end type safety between server and client.",
    ],
    architecture: [
      "Hono runs everywhere — Cloudflare Workers, Deno, Bun, Node. Use Web Standard APIs (Request, Response, fetch) not Node-specific APIs.",
    ],
    doNot: [
      "DO NOT use Express patterns (`req.body`, `res.json()`). Use Hono's `c` context object.",
      "DO NOT import Node-specific modules (`fs`, `path`) when targeting edge runtimes.",
      "DO NOT create middleware classes. Hono middleware are functions: `app.use(async (c, next) => { ... })`.",
    ],
  };
}
