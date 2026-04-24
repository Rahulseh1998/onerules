import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdtemp, writeFile, readFile, rm, mkdir, access } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execSync } from "node:child_process";

const CLI = join(import.meta.dirname, "..", "dist", "cli.js");
const run = (args: string, cwd: string) =>
  execSync(`node ${CLI} ${args}`, { cwd, encoding: "utf-8", timeout: 10000 });

// ==========================================
// Fixture: Next.js + Prisma + Zod + Tailwind
// ==========================================
describe("E2E: Next.js project", () => {
  let dir: string;

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), "onerules-e2e-nextjs-"));
    await writeFile(
      join(dir, "package.json"),
      JSON.stringify({
        name: "test-nextjs",
        dependencies: { next: "15.0.0", react: "19.0.0", "@prisma/client": "6.0.0", zod: "3.24.0", tailwindcss: "4.0.0" },
        devDependencies: { typescript: "5.7.0", vitest: "3.0.0" },
        packageManager: "pnpm@9.15.0",
      }),
    );
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("generate creates 12 files", () => {
    const output = run("--force", dir);
    expect(output).toContain("Generated 12 files");
    expect(output).toContain("CLAUDE.md");
    expect(output).toContain("Cursor");
  });

  it("generated CLAUDE.md contains framework + library rules", async () => {
    const claude = await readFile(join(dir, "CLAUDE.md"), "utf-8");
    expect(claude).toContain("Next.js");
    expect(claude).toContain("Server Components");
    expect(claude).toContain("Prisma");
    expect(claude).toContain("Zod");
    expect(claude).toContain("Tailwind");
    expect(claude).toContain("DO NOT");
    expect(claude).toContain("pnpm");
    expect(claude).toContain("vitest");
  });

  it("generated Cursor file has MDC frontmatter", async () => {
    const cursor = await readFile(join(dir, ".cursor/rules/onerules.mdc"), "utf-8");
    expect(cursor).toMatch(/^---\n/);
    expect(cursor).toContain("alwaysApply: true");
  });

  it("inspect shows detected libraries", () => {
    const output = run("inspect", dir);
    expect(output).toContain("prisma-client");
    expect(output).toContain("zod");
    expect(output).toContain("tailwindcss");
    expect(output).toContain("nextjs");
    expect(output).toContain("typescript");
  });

  it("doctor scores 100 on generated files", () => {
    const output = run("doctor", dir);
    expect(output).toContain("Score: 100/100");
  });

  it("diff outputs without writing files", async () => {
    await rm(join(dir, "AGENTS.md"));
    const output = run("diff", dir);
    expect(output).toContain("CLAUDE.md (Claude Code)");
    expect(output).toContain("AGENTS.md (OpenAI Codex)");
    // diff shouldn't recreate the deleted file
    await expect(access(join(dir, "AGENTS.md"))).rejects.toThrow();
  });

  it("--dry-run does not write files", async () => {
    const newDir = await mkdtemp(join(tmpdir(), "onerules-e2e-dry-"));
    await writeFile(join(newDir, "package.json"), JSON.stringify({ dependencies: { react: "19.0.0" }, devDependencies: { typescript: "5.0.0" } }));
    const output = run("--dry-run", newDir);
    expect(output).toContain("Would generate");
    await expect(access(join(newDir, "CLAUDE.md"))).rejects.toThrow();
    await rm(newDir, { recursive: true, force: true });
  });

  it("second run skips existing files", () => {
    const output = run("", dir);
    expect(output).toContain("Skipped");
  });

  it("--force overwrites existing files", () => {
    const output = run("--force", dir);
    expect(output).toContain("Generated 12 files");
  });

  it("ai command generates a prompt", () => {
    const output = run("ai", dir);
    expect(output).toContain("Generate Project-Specific Coding Rules");
    expect(output).toContain("Next.js");
    expect(output).toContain("File Structure");
    expect(output).toContain("Your Task");
  });

  it("--strict generates more rules than default", () => {
    const defaultOut = run("diff", dir);
    const strictOut = run("diff --strict", dir);
    const defaultLines = defaultOut.split("\n").filter((l: string) => l.startsWith("- ")).length;
    const strictLines = strictOut.split("\n").filter((l: string) => l.startsWith("- ")).length;
    expect(strictLines).toBeGreaterThan(defaultLines);
  });

  it("--minimal generates fewer rules than default", () => {
    const defaultOut = run("diff", dir);
    const minimalOut = run("diff --minimal", dir);
    const defaultLines = defaultOut.split("\n").filter((l: string) => l.startsWith("- ")).length;
    const minimalLines = minimalOut.split("\n").filter((l: string) => l.startsWith("- ")).length;
    expect(minimalLines).toBeLessThan(defaultLines);
  });
});

// ==========================================
// Fixture: Python FastAPI + SQLAlchemy
// ==========================================
describe("E2E: FastAPI project", () => {
  let dir: string;

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), "onerules-e2e-fastapi-"));
    await writeFile(
      join(dir, "pyproject.toml"),
      `
[project]
name = "test-api"
dependencies = ["fastapi>=0.100.0", "pydantic>=2.0", "sqlalchemy>=2.0", "pytest>=8.0", "ruff>=0.5"]
`,
    );
    await writeFile(join(dir, "uv.lock"), "");
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("detects Python + FastAPI stack", () => {
    const output = run("inspect", dir);
    expect(output).toContain("python");
    expect(output).toContain("fastapi");
    expect(output).toContain("pydantic");
    expect(output).toContain("sqlalchemy");
    expect(output).toContain("uv");
    expect(output).toContain("pytest");
    expect(output).toContain("ruff");
  });

  it("generates rules with FastAPI + Pydantic + SQLAlchemy content", () => {
    run("--force", dir);
    const output = run("diff", dir);
    expect(output).toContain("Pydantic");
    expect(output).toContain("FastAPI");
    expect(output).toContain("SQLAlchemy");
    expect(output).toContain("type hints");
    expect(output).toContain("ruff");
  });
});

// ==========================================
// Fixture: Go + Gin
// ==========================================
describe("E2E: Go project", () => {
  let dir: string;

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), "onerules-e2e-go-"));
    await writeFile(
      join(dir, "go.mod"),
      `module example.com/app

go 1.22

require (
    github.com/gin-gonic/gin v1.10.0
    gorm.io/gorm v1.25.0
)
`,
    );
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("detects Go + Gin + GORM", () => {
    const output = run("inspect", dir);
    expect(output).toContain("go");
    expect(output).toContain("gin");
    expect(output).toContain("gorm");
  });

  it("generates Go-specific rules", () => {
    const output = run("diff", dir);
    expect(output).toContain("error");
    expect(output).toContain("context.Context");
    expect(output).toContain("ShouldBindJSON");
  });
});

// ==========================================
// Fixture: Rust + Axum
// ==========================================
describe("E2E: Rust project", () => {
  let dir: string;

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), "onerules-e2e-rust-"));
    await writeFile(
      join(dir, "Cargo.toml"),
      `
[package]
name = "myapp"

[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
`,
    );
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("detects Rust + Axum + tokio + serde", () => {
    const output = run("inspect", dir);
    expect(output).toContain("rust");
    expect(output).toContain("axum");
    expect(output).toContain("tokio");
    expect(output).toContain("serde");
  });
});

// ==========================================
// Fixture: Ruby + Rails
// ==========================================
describe("E2E: Rails project", () => {
  let dir: string;

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), "onerules-e2e-rails-"));
    await writeFile(
      join(dir, "Gemfile"),
      `
source 'https://rubygems.org'
gem 'rails', '~> 7.1'
gem 'pg'
gem 'rspec-rails', group: :test
gem 'rubocop', group: :development
`,
    );
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("detects Ruby + Rails + RSpec + RuboCop", () => {
    const output = run("inspect", dir);
    expect(output).toContain("ruby");
    expect(output).toContain("rails");
    expect(output).toContain("rspec");
    expect(output).toContain("rubocop");
  });

  it("generates Rails-specific rules", () => {
    const output = run("diff", dir);
    expect(output).toContain("strong parameters");
    expect(output).toContain("default_scope");
  });
});

// ==========================================
// Fixture: .onerulesrc merge
// ==========================================
describe("E2E: .onerulesrc custom rules", () => {
  let dir: string;

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), "onerules-e2e-rc-"));
    await writeFile(
      join(dir, "package.json"),
      JSON.stringify({ dependencies: { react: "19.0.0" }, devDependencies: { typescript: "5.0.0" } }),
    );
    await writeFile(
      join(dir, ".onerulesrc"),
      JSON.stringify({
        projectContext: "This is a medical records system.",
        doNot: ["DO NOT store PHI in localStorage.", "DO NOT log patient names."],
      }),
    );
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("merges custom rules into output", () => {
    run("--force", dir);
    const output = run("diff", dir);
    expect(output).toContain("medical records system");
    expect(output).toContain("PHI");
    expect(output).toContain("patient names");
  });

  it("reports custom rules loaded", () => {
    const output = run("--force", dir);
    expect(output).toContain(".onerulesrc loaded");
  });
});

// ==========================================
// Fixture: Doctor on weak rules
// ==========================================
describe("E2E: Doctor scoring", () => {
  let dir: string;

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), "onerules-e2e-doctor-"));
    await writeFile(
      join(dir, "package.json"),
      JSON.stringify({ dependencies: { next: "15.0.0" }, devDependencies: { typescript: "5.0.0" } }),
    );
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("scores weak rules low", async () => {
    await writeFile(
      join(dir, "CLAUDE.md"),
      "# Rules\n\n- Follow best practices\n- Write clean code\n- Use TypeScript\n- Add proper error handling\n",
    );
    const output = run("doctor", dir);
    expect(output).toContain("Follow best practices");
    expect(output).not.toContain("Score: 100/100");
    const match = output.match(/Score: (\d+)/);
    expect(match).toBeTruthy();
    expect(Number(match![1])).toBeLessThan(50);
  });

  it("scores generated rules 100", async () => {
    run("--force", dir);
    const output = run("doctor", dir);
    expect(output).toContain("Score: 100/100");
  });
});

// ==========================================
// Fixture: --merge with existing CLAUDE.md
// ==========================================
describe("E2E: Smart merge", () => {
  let dir: string;

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), "onerules-e2e-merge-"));
    await writeFile(
      join(dir, "package.json"),
      JSON.stringify({
        dependencies: { next: "15.0.0", react: "19.0.0", stripe: "17.0.0" },
        devDependencies: { typescript: "5.0.0" },
      }),
    );
    await writeFile(
      join(dir, "CLAUDE.md"),
      "# My Project Rules\n\nThis is a SaaS billing platform.\n\n## Architecture\n\n- Use event sourcing for all billing events\n- Keep payment logic in src/billing/\n",
    );
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("merge adds rules without destroying existing content", () => {
    const output = run("--merge -t claude", dir);
    expect(output).toContain("Merged into 1");
    expect(output).toContain("rules added");
  });

  it("preserves project-specific content after merge", async () => {
    const claude = await readFile(join(dir, "CLAUDE.md"), "utf-8");
    expect(claude).toContain("SaaS billing platform");
    expect(claude).toContain("event sourcing");
    expect(claude).toContain("src/billing/");
    expect(claude).toContain("onerules — Auto-detected Rules");
  });

  it("merged file contains Stripe-specific rules", async () => {
    const claude = await readFile(join(dir, "CLAUDE.md"), "utf-8");
    expect(claude).toContain("webhook");
  });
});

// ==========================================
// Fixture: Tool filter (-t)
// ==========================================
describe("E2E: Tool filter", () => {
  let dir: string;

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), "onerules-e2e-filter-"));
    await writeFile(
      join(dir, "package.json"),
      JSON.stringify({ dependencies: { react: "19.0.0" }, devDependencies: { typescript: "5.0.0" } }),
    );
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("-t claude,cursor generates only 2 files", () => {
    const output = run("-t claude,cursor --force", dir);
    expect(output).toContain("Generated 2 files");
    expect(output).toContain("CLAUDE.md");
    expect(output).toContain("Cursor");
  });

  it("-t copilot generates only 1 file", () => {
    const output = run("-t copilot --force", dir);
    expect(output).toContain("Generated 1 file");
    expect(output).toContain("Copilot");
  });
});

// ==========================================
// Fixture: ai --output
// ==========================================
describe("E2E: AI prompt output", () => {
  let dir: string;

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), "onerules-e2e-ai-"));
    await writeFile(
      join(dir, "package.json"),
      JSON.stringify({ dependencies: { next: "15.0.0" }, devDependencies: { typescript: "5.0.0" } }),
    );
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("ai -o writes prompt to file", async () => {
    const outputFile = join(dir, "prompt.md");
    run(`ai -o ${outputFile}`, dir);
    const content = await readFile(outputFile, "utf-8");
    expect(content).toContain("Generate Project-Specific Coding Rules");
    expect(content).toContain("nextjs");
  });

  it("ai stdout contains project structure", () => {
    const output = run("ai", dir);
    expect(output).toContain("File Structure");
    expect(output).toContain("package.json");
  });
});

// ==========================================
// Fixture: Monorepo
// ==========================================
describe("E2E: Monorepo", () => {
  let dir: string;

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), "onerules-e2e-mono-"));
    await writeFile(join(dir, "package.json"), JSON.stringify({ workspaces: ["apps/*", "packages/*"] }));
    await writeFile(join(dir, "pnpm-workspace.yaml"), "packages:\n  - 'apps/*'\n  - 'packages/*'\n");
    await mkdir(join(dir, "apps/web"), { recursive: true });
    await writeFile(
      join(dir, "apps/web/package.json"),
      JSON.stringify({ dependencies: { next: "15.0.0", react: "19.0.0" }, devDependencies: { typescript: "5.0.0" } }),
    );
    await mkdir(join(dir, "packages/shared"), { recursive: true });
    await writeFile(
      join(dir, "packages/shared/package.json"),
      JSON.stringify({ devDependencies: { typescript: "5.0.0" } }),
    );
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("detects monorepo", () => {
    const output = run("inspect", dir);
    expect(output).toContain("Monorepo:");
    expect(output).toContain("yes");
  });

  it("monorepo command finds workspaces", () => {
    const output = run("monorepo --force", dir);
    expect(output).toContain("Found");
    expect(output).toContain("workspaces");
  });
});

// ==========================================
// Fixture: Empty directory
// ==========================================
describe("E2E: Edge cases", () => {
  it("exits with error on empty directory", async () => {
    const dir = await mkdtemp(join(tmpdir(), "onerules-e2e-empty-"));
    try {
      run("", dir);
      expect.unreachable("should have thrown");
    } catch (e: any) {
      expect(e.stderr || e.stdout).toContain("No recognized project files");
    }
    await rm(dir, { recursive: true, force: true });
  });

  it("--version outputs version", () => {
    const output = run("--version", tmpdir());
    expect(output.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("--help shows all commands", () => {
    const output = run("--help", tmpdir());
    expect(output).toContain("generate");
    expect(output).toContain("doctor");
    expect(output).toContain("inspect");
    expect(output).toContain("ai");
    expect(output).toContain("init");
    expect(output).toContain("monorepo");
  });
});
