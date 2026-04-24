import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { StackProfile, Framework } from "../types.js";

export async function detectRust(dir: string, profile: StackProfile): Promise<void> {
  let content: string;
  try {
    content = await readFile(join(dir, "Cargo.toml"), "utf-8");
  } catch {
    return;
  }

  profile.languages.push("rust");
  profile.packageManager = "cargo";

  const deps = extractCargoDeps(content);

  // Framework
  if (deps.includes("actix-web")) profile.framework = "actix";
  else if (deps.includes("axum")) profile.framework = "axum";

  // Libraries
  const notable = [
    "tokio", "serde", "reqwest", "sqlx", "diesel",
    "clap", "tracing", "anyhow", "thiserror",
    "tower", "tonic", "prost",
  ];
  for (const lib of notable) {
    if (deps.includes(lib)) profile.libraries.push(lib);
  }

  profile.testFramework = "cargo-test";
}

function extractCargoDeps(content: string): string[] {
  const deps: string[] = [];
  const lines = content.split("\n");
  let inDeps = false;

  for (const line of lines) {
    if (line.match(/\[(.*dependencies.*)\]/)) {
      inDeps = true;
      continue;
    }
    if (line.startsWith("[") && inDeps) {
      inDeps = false;
      continue;
    }
    if (inDeps) {
      const name = line.split("=")[0].trim().toLowerCase();
      if (name && !name.startsWith("#")) deps.push(name);
    }
  }

  return deps;
}
