import type { RuleSet } from "../../types.js";

export function getFastifyRules(): RuleSet {
  return {
    projectContext: "This is a Fastify application.",
    codingPatterns: [
      "Use JSON Schema for request/response validation. Fastify COMPILES schemas for performance — this is a core advantage.",
      "Use the plugin system for modularity. `fastify.register(plugin)` with encapsulation.",
      "Use TypeBox for schemas that double as TypeScript types. Write the schema once, get validation AND types.",
      "Use hooks (`onRequest`, `preHandler`, `onSend`) for cross-cutting concerns. Not middleware functions.",
      "Use `fastify-autoload` to auto-register plugins from a directory structure.",
    ],
    doNot: [
      "DO NOT use Express middleware directly. Fastify has its own hook system that's faster.",
      "DO NOT skip schema validation. Fastify without schemas is just a slower Express.",
      "DO NOT create controller classes. Fastify routes are functions registered as plugins. That's the architecture.",
      "DO NOT throw in handlers. Use `reply.code(400).send()` or `fastify.httpErrors` from fastify-sensible.",
    ],
  };
}
