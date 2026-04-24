import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, readFile, rm, access } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { generateAll } from "./index.js";
import type { StackProfile } from "../types.js";

let tempDir: string;

const nextjsProfile: StackProfile = {
  languages: ["typescript"],
  framework: "nextjs",
  libraries: ["tailwindcss", "prisma"],
  packageManager: "pnpm",
  testFramework: "vitest",
  linter: "eslint",
  formatter: "prettier",
  ci: "github-actions",
  monorepo: false,
};

const pythonProfile: StackProfile = {
  languages: ["python"],
  framework: "fastapi",
  libraries: ["pydantic", "sqlalchemy"],
  packageManager: "uv",
  testFramework: "pytest",
  linter: "ruff",
  formatter: "ruff",
  ci: null,
  monorepo: false,
};

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "onerules-gen-"));
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

describe("generateAll", () => {
  it("generates all 8 files for a Next.js project", async () => {
    const { outputs } = await generateAll(tempDir, nextjsProfile, { force: true });
    expect(outputs).toHaveLength(8);

    const fileNames = outputs.map((o) => o.filePath);
    expect(fileNames).toContain("CLAUDE.md");
    expect(fileNames).toContain(".cursor/rules/onerules.mdc");
    expect(fileNames).toContain(".github/copilot-instructions.md");
    expect(fileNames).toContain("AGENTS.md");
    expect(fileNames).toContain("GEMINI.md");
    expect(fileNames).toContain(".windsurfrules");
    expect(fileNames).toContain(".clinerules");
    expect(fileNames).toContain("CONVENTIONS.md");
  });

  it("writes files to disk", async () => {
    await generateAll(tempDir, nextjsProfile);
    const claude = await readFile(join(tempDir, "CLAUDE.md"), "utf-8");
    expect(claude).toContain("Next.js");
    expect(claude).toContain("Server Components");
  });

  it("includes framework-specific rules in output", async () => {
    const { outputs } = await generateAll(tempDir, nextjsProfile, { force: true });
    const claude = outputs.find((o) => o.toolId === "claude")!;
    expect(claude.content).toContain("Server Components");
    expect(claude.content).toContain("next/image");
    expect(claude.content).toContain("pnpm");
    expect(claude.content).toContain("vitest");
  });

  it("generates Python-specific rules", async () => {
    const { outputs } = await generateAll(tempDir, pythonProfile, { force: true });
    const claude = outputs.find((o) => o.toolId === "claude")!;
    expect(claude.content).toContain("FastAPI");
    expect(claude.content).toContain("Pydantic");
    expect(claude.content).toContain("type hints");
    expect(claude.content).toContain("ruff");
  });

  it("skips existing files when force is false", async () => {
    await generateAll(tempDir, nextjsProfile);
    const { outputs, skipped } = await generateAll(tempDir, nextjsProfile);
    expect(outputs).toHaveLength(0);
    expect(skipped).toHaveLength(8);
  });

  it("overwrites existing files when force is true", async () => {
    await generateAll(tempDir, nextjsProfile);
    const { outputs } = await generateAll(tempDir, nextjsProfile, { force: true });
    expect(outputs).toHaveLength(8);
  });

  it("dry-run does not write files", async () => {
    const { outputs } = await generateAll(tempDir, nextjsProfile, { dryRun: true, force: true });
    expect(outputs).toHaveLength(8);

    await expect(access(join(tempDir, "CLAUDE.md"))).rejects.toThrow();
  });

  it("generates only specified tools", async () => {
    const { outputs } = await generateAll(tempDir, nextjsProfile, {
      tools: ["claude", "cursor"],
      force: true,
    });
    expect(outputs).toHaveLength(2);
    expect(outputs[0].toolId).toBe("claude");
    expect(outputs[1].toolId).toBe("cursor");
  });

  it("cursor output has MDC frontmatter", async () => {
    const { outputs } = await generateAll(tempDir, nextjsProfile, { force: true });
    const cursor = outputs.find((o) => o.toolId === "cursor")!;
    expect(cursor.content).toMatch(/^---\n/);
    expect(cursor.content).toContain("alwaysApply: true");
  });
});
