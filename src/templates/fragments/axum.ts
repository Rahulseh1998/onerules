import type { RuleSet } from "../../types.js";

export function getAxumRules(): RuleSet {
  return {
    projectContext: "This is a Rust application using the Axum web framework.",
    codingPatterns: [
      "Use extractors (`Json`, `Path`, `Query`, `State`) for typed request parsing. Axum's type system IS the validation layer.",
      "Return `Result<impl IntoResponse, AppError>` from handlers. Implement `IntoResponse` on your error type once.",
      "Use `State(Arc<AppState>)` for shared application state. Define AppState once with your db pool and config.",
      "Use Tower middleware layers for cross-cutting concerns. `tower-http` has CORS, tracing, compression ready-made.",
    ],
    doNot: [
      "DO NOT use `.unwrap()` in handlers. Every unwrap is a potential 500 error. Use `?` with a proper AppError type.",
      "DO NOT clone the entire AppState to avoid Arc. Wrap in `Arc<AppState>` once in main and extract via `State`.",
      "DO NOT block the tokio runtime. Use `tokio::task::spawn_blocking()` for CPU-heavy or synchronous I/O work.",
      "DO NOT create a handler trait. Axum handlers are functions. The trait system is already built into the framework via extractors.",
    ],
  };
}
