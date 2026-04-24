import type { RuleSet } from "../../types.js";

export function getActixRules(): RuleSet {
  return {
    projectContext: "This is a Rust application using the Actix-web framework.",
    codingPatterns: [
      "Use extractors (`web::Json`, `web::Path`, `web::Query`, `web::Data`) for typed request parsing.",
      "Use `web::Data<AppState>` for shared application state. Wrap in `Arc` if needed for mutability.",
      "Use middleware with `wrap()` for cross-cutting concerns. Actix middleware is composable.",
      "Return `impl Responder` from handlers. Use `HttpResponse::Ok().json()` for JSON responses.",
      "Use `#[actix_web::main]` for the async runtime. Actix runs on its own multi-threaded runtime.",
    ],
    doNot: [
      "DO NOT use `.unwrap()` in handlers. Return `Result<impl Responder, actix_web::Error>` and use `?`.",
      "DO NOT block the async runtime with synchronous I/O. Use `web::block()` for CPU-heavy work.",
      "DO NOT create handler trait hierarchies. Actix handlers are async functions. Keep them as functions.",
    ],
  };
}
