import type { RuleSet } from "../../types.js";

export function getAxumRules(): RuleSet {
  return {
    projectContext: "This is a Rust application using the Axum web framework.",
    codingPatterns: [
      "Use extractors (`Json`, `Path`, `Query`, `State`) for typed request parsing.",
      "Use `IntoResponse` for custom response types. Return `Result<impl IntoResponse, AppError>` from handlers.",
      "Use `Extension` or `State` for shared application state (database pools, config).",
      "Use Tower middleware layers for cross-cutting concerns (tracing, CORS, compression).",
      "Use `#[derive(Deserialize)]` with serde for request body types and `#[derive(Serialize)]` for responses.",
    ],
    architecture: [
      "Organize by feature: group handlers, models, and services per domain.",
      "Use a shared `AppState` struct with `Arc` for database pools and config.",
      "Use `Router::nest()` for sub-routers organized by API version or feature.",
      "Use `tower-http` crate for common middleware (CORS, tracing, compression).",
    ],
    doNot: [
      "Do not use `.unwrap()` in handlers — return proper error responses.",
      "Do not clone `AppState` — wrap in `Arc` and extract via `State`.",
      "Do not block the async runtime with synchronous I/O — use `tokio::task::spawn_blocking()`.",
    ],
  };
}
