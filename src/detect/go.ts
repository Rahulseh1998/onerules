import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { StackProfile, Framework } from "../types.js";

export async function detectGo(dir: string, profile: StackProfile): Promise<void> {
  let content: string;
  try {
    content = await readFile(join(dir, "go.mod"), "utf-8");
  } catch {
    return;
  }

  profile.languages.push("go");
  profile.packageManager = "go";

  const requires = content.match(/require\s*\(([\s\S]*?)\)/)?.[1] ?? "";
  const singleRequires = content.match(/^require\s+(\S+)/gm) ?? [];
  const allDeps = [
    ...requires.split("\n").map((l) => l.trim().split(/\s/)[0]),
    ...singleRequires.map((l) => l.replace("require ", "").trim()),
  ].filter(Boolean);

  // Framework
  if (allDeps.some((d) => d.includes("gin-gonic/gin"))) profile.framework = "gin";
  else if (allDeps.some((d) => d.includes("gofiber/fiber"))) profile.framework = "fiber";

  // Libraries
  const notable: Record<string, string> = {
    "gorm.io/gorm": "gorm",
    "github.com/jackc/pgx": "pgx",
    "github.com/redis/go-redis": "go-redis",
    "go.uber.org/zap": "zap",
    "github.com/spf13/cobra": "cobra",
    "github.com/spf13/viper": "viper",
    "google.golang.org/grpc": "grpc",
    "google.golang.org/protobuf": "protobuf",
  };
  for (const [dep, name] of Object.entries(notable)) {
    if (allDeps.some((d) => d.includes(dep))) profile.libraries.push(name);
  }

  // Test: Go always has built-in testing
  profile.testFramework = "go-test";
}
