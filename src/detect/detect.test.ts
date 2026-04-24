import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, writeFile, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { detectStack } from "./index.js";

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "onerules-test-"));
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

describe("detectStack", () => {
  it("returns empty profile for empty directory", async () => {
    const profile = await detectStack(tempDir);
    expect(profile.languages).toEqual([]);
    expect(profile.framework).toBeNull();
  });

  it("detects Next.js + TypeScript project", async () => {
    await writeFile(
      join(tempDir, "package.json"),
      JSON.stringify({
        dependencies: { next: "15.0.0", react: "19.0.0" },
        devDependencies: { typescript: "5.7.0", vitest: "3.0.0" },
      }),
    );
    await writeFile(join(tempDir, "pnpm-lock.yaml"), "");

    const profile = await detectStack(tempDir);
    expect(profile.languages).toContain("typescript");
    expect(profile.framework).toBe("nextjs");
    expect(profile.packageManager).toBe("pnpm");
    expect(profile.testFramework).toBe("vitest");
  });

  it("detects FastAPI + Python project", async () => {
    await writeFile(
      join(tempDir, "pyproject.toml"),
      `
[project]
dependencies = [
  "fastapi>=0.100.0",
  "pydantic>=2.0",
  "pytest>=8.0",
]
`,
    );
    await writeFile(join(tempDir, "uv.lock"), "");

    const profile = await detectStack(tempDir);
    expect(profile.languages).toContain("python");
    expect(profile.framework).toBe("fastapi");
    expect(profile.packageManager).toBe("uv");
    expect(profile.libraries).toContain("pydantic");
    expect(profile.testFramework).toBe("pytest");
  });

  it("detects Go + Gin project", async () => {
    await writeFile(
      join(tempDir, "go.mod"),
      `module example.com/app

go 1.22

require (
    github.com/gin-gonic/gin v1.10.0
    gorm.io/gorm v1.25.0
)
`,
    );

    const profile = await detectStack(tempDir);
    expect(profile.languages).toContain("go");
    expect(profile.framework).toBe("gin");
    expect(profile.packageManager).toBe("go");
    expect(profile.libraries).toContain("gorm");
  });

  it("detects Rust + Axum project", async () => {
    await writeFile(
      join(tempDir, "Cargo.toml"),
      `
[package]
name = "myapp"

[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
`,
    );

    const profile = await detectStack(tempDir);
    expect(profile.languages).toContain("rust");
    expect(profile.framework).toBe("axum");
    expect(profile.libraries).toContain("tokio");
    expect(profile.libraries).toContain("serde");
  });

  it("detects Ruby + Rails project", async () => {
    await writeFile(
      join(tempDir, "Gemfile"),
      `
source 'https://rubygems.org'
gem 'rails', '~> 7.1'
gem 'pg', '~> 1.5'
gem 'rspec-rails', group: :test
gem 'rubocop', group: :development
`,
    );

    const profile = await detectStack(tempDir);
    expect(profile.languages).toContain("ruby");
    expect(profile.framework).toBe("rails");
    expect(profile.packageManager).toBe("bundler");
    expect(profile.testFramework).toBe("rspec");
    expect(profile.linter).toBe("rubocop");
  });

  it("detects GitHub Actions CI", async () => {
    await mkdir(join(tempDir, ".github/workflows"), { recursive: true });
    await writeFile(join(tempDir, ".github/workflows/ci.yml"), "name: CI");
    await writeFile(join(tempDir, "package.json"), JSON.stringify({ dependencies: { react: "19.0.0" } }));

    const profile = await detectStack(tempDir);
    expect(profile.ci).toBe("github-actions");
  });

  it("detects monorepo", async () => {
    await writeFile(join(tempDir, "pnpm-workspace.yaml"), "packages:\n  - apps/*");
    await writeFile(join(tempDir, "package.json"), JSON.stringify({ devDependencies: { typescript: "5.0.0" } }));

    const profile = await detectStack(tempDir);
    expect(profile.monorepo).toBe(true);
  });
});
