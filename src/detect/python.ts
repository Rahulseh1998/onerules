import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
import type { StackProfile, Framework } from "../types.js";

export async function detectPython(dir: string, profile: StackProfile): Promise<void> {
  let deps: string[] = [];

  // Try pyproject.toml
  try {
    const content = await readFile(join(dir, "pyproject.toml"), "utf-8");
    deps = extractPyprojectDeps(content);
    profile.languages.push("python");
  } catch {
    // Try requirements.txt
    try {
      const content = await readFile(join(dir, "requirements.txt"), "utf-8");
      deps = content
        .split("\n")
        .map((l) => l.trim().split(/[>=<!\[]/)[0].toLowerCase())
        .filter(Boolean);
      profile.languages.push("python");
    } catch {
      return;
    }
  }

  // Package manager
  try {
    await access(join(dir, "uv.lock"));
    profile.packageManager = "uv";
  } catch {
    try {
      await access(join(dir, "poetry.lock"));
      profile.packageManager = "poetry";
    } catch {
      profile.packageManager = "pip";
    }
  }

  // Framework
  if (deps.includes("fastapi")) profile.framework = "fastapi";
  else if (deps.includes("django")) profile.framework = "django";
  else if (deps.includes("flask")) profile.framework = "flask";

  // Libraries
  const notable = [
    "pydantic", "sqlalchemy", "alembic", "celery",
    "redis", "httpx", "aiohttp", "boto3",
    "pandas", "numpy", "scipy", "scikit-learn",
    "torch", "tensorflow", "transformers",
    "anthropic", "openai", "langchain",
    "typer", "click", "rich",
  ];
  for (const lib of notable) {
    if (deps.includes(lib)) profile.libraries.push(lib);
  }

  // Test framework
  if (deps.includes("pytest")) profile.testFramework = "pytest";
  else if (deps.includes("unittest")) profile.testFramework = "unittest";

  // Linter
  if (deps.includes("ruff")) profile.linter = "ruff";
  else if (deps.includes("flake8")) profile.linter = "flake8";
  else if (deps.includes("pylint")) profile.linter = "pylint";

  // Formatter
  if (deps.includes("ruff")) profile.formatter = "ruff";
  else if (deps.includes("black")) profile.formatter = "black";
}

function extractPyprojectDeps(content: string): string[] {
  const deps: string[] = [];
  const depPatterns = [
    /dependencies\s*=\s*\[([\s\S]*?)\]/g,
    /requires\s*=\s*\[([\s\S]*?)\]/g,
  ];
  for (const pattern of depPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const block = match[1];
      const packages = block.match(/"([^"]+)"/g) || [];
      for (const pkg of packages) {
        const name = pkg.replace(/"/g, "").split(/[>=<!\[]/)[0].trim().toLowerCase();
        if (name) deps.push(name);
      }
    }
  }

  // Also check [tool.poetry.dependencies] style
  const lines = content.split("\n");
  let inDeps = false;
  for (const line of lines) {
    if (line.match(/\[(tool\.poetry\.)?dependencies\]/)) {
      inDeps = true;
      continue;
    }
    if (line.startsWith("[") && inDeps) {
      inDeps = false;
      continue;
    }
    if (inDeps) {
      const name = line.split("=")[0].trim().toLowerCase();
      if (name && !name.startsWith("#") && name !== "python") {
        deps.push(name);
      }
    }
  }

  return [...new Set(deps)];
}
