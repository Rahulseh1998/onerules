import type { RuleSet } from "../../types.js";

export function getFastifyRules(): RuleSet {
  return {
    projectContext: "This is a Fastify application.",
    codingPatterns: [
      "Use JSON Schema for request/response validation. Fastify compiles schemas for performance.",
      "Use the plugin system for modularity. Register features as Fastify plugins with `fastify.register()`.",
      "Use `fastify.decorateRequest()` and `fastify.decorateReply()` to extend request/reply objects.",
      "Use hooks (`onRequest`, `preHandler`, `onSend`) for cross-cutting concerns.",
      "Use TypeBox or Typebox for type-safe schema definitions that double as TypeScript types.",
    ],
    architecture: [
      "Use `fastify-autoload` to automatically load plugins from a directory structure.",
      "Group routes by feature using plugins. Each plugin gets its own prefix.",
      "Use `fastify-sensible` for standard HTTP errors and utilities.",
    ],
    doNot: [
      "Do not use Express middleware directly. Use `fastify-express` compatibility layer only for migration.",
      "Do not throw errors in handlers. Use `reply.code().send()` or `fastify.httpErrors`.",
      "Do not mutate the `request` or `reply` objects outside of decorators.",
    ],
  };
}
