import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { mergeWithExisting } from "./merge.js";

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "onerules-merge-"));
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

describe("mergeWithExisting", () => {
  it("returns null when file does not exist", async () => {
    const result = await mergeWithExisting(tempDir, "CLAUDE.md", "- Some rule");
    expect(result).toBeNull();
  });

  it("adds new rules to existing file", async () => {
    await writeFile(
      join(tempDir, "CLAUDE.md"),
      "# My Rules\n\n- Always use strict mode\n",
    );

    const generated = "# Generated\n\n- DO NOT use any type in TypeScript\n- DO NOT create AbstractFactoryProviderManager\n";
    const result = await mergeWithExisting(tempDir, "CLAUDE.md", generated);

    expect(result).not.toBeNull();
    expect(result!.addedCount).toBeGreaterThan(0);
    expect(result!.merged).toContain("# My Rules");
    expect(result!.merged).toContain("onerules — Auto-detected Rules");
    expect(result!.merged).toContain("AbstractFactoryProviderManager");
  });

  it("preserves existing content when merging", async () => {
    const existing = "# Project Rules\n\nThis is a trading platform.\n\n## Architecture\n\n- Use event sourcing\n- CQRS pattern\n";
    await writeFile(join(tempDir, "CLAUDE.md"), existing);

    const generated = "- DO NOT over-abstract\n- Test behavior not implementation\n";
    const result = await mergeWithExisting(tempDir, "CLAUDE.md", generated);

    expect(result!.merged).toContain("This is a trading platform.");
    expect(result!.merged).toContain("event sourcing");
    expect(result!.merged).toContain("CQRS pattern");
  });

  it("skips rules with high keyword overlap", async () => {
    await writeFile(
      join(tempDir, "CLAUDE.md"),
      "# Rules\n\n- Use TypeScript strict mode. any is a bug, use unknown with type guards.\n- Use pnpm as the package manager.\n",
    );

    const generated = "- Use TypeScript strict mode. `any` is a bug — use `unknown` with type guards or proper generic constraints.\n- Use `pnpm` as the package manager. Do not switch to another package manager.\n- DO NOT create AbstractFactoryProviderManager\n";
    const result = await mergeWithExisting(tempDir, "CLAUDE.md", generated);

    expect(result!.skippedCount).toBeGreaterThanOrEqual(2);
    expect(result!.merged).toContain("AbstractFactoryProviderManager");
  });

  it("returns 0 added when all rules already present", async () => {
    await writeFile(
      join(tempDir, "CLAUDE.md"),
      "# Rules\n\n- DO NOT over-abstract. No AbstractFactoryProviderManager. No BaseServiceInterface.\n",
    );

    const generated = "- DO NOT over-abstract. No AbstractFactoryProviderManager. No BaseServiceInterface.\n";
    const result = await mergeWithExisting(tempDir, "CLAUDE.md", generated);

    expect(result!.addedCount).toBe(0);
  });
});
