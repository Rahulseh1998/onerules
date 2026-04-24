import type { RuleSet } from "../../types.js";

export function getTauriRules(): RuleSet {
  return {
    projectContext: "This is a Tauri desktop application.",
    codingPatterns: [
      "Use Tauri commands (`#[tauri::command]`) for Rust↔frontend communication. Keep commands thin — call service functions from commands.",
      "Use the event system (`app.emit()`, `app.listen()`) for backend-to-frontend push notifications.",
      "Use Tauri's plugin system for platform APIs (file system, shell, dialog, clipboard). Don't use Node.js equivalents.",
      "Frontend is a web view. Use your web framework (React, Vue, Svelte) normally — Tauri doesn't change frontend patterns.",
    ],
    architecture: [
      "Rust backend in `src-tauri/`. Frontend in `src/`. Keep them clearly separated.",
      "Business logic in Rust. UI logic in the frontend. Don't put business logic in JavaScript.",
    ],
    doNot: [
      "DO NOT use `unsafe` Tauri APIs without understanding the security implications. Use the allowlist in `tauri.conf.json` to restrict API access.",
      "DO NOT use Node.js APIs. Tauri is not Electron — there is no Node.js runtime. Use Tauri commands for system access.",
      "DO NOT put sensitive logic in the frontend. The web view is inspectable. Keep secrets and business logic in Rust.",
    ],
  };
}
