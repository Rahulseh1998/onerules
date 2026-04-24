import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, writeFile, rm, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { generateAll } from "./index.js";
import type { StackProfile } from "../types.js";

let tempDir: string;

const profile: StackProfile = {
  languages: ["typescript"],
  framework: "nextjs",
  libraries: [],
  packageManager: "pnpm",
  testFramework: "vitest",
  linter: null,
  formatter: null,
  ci: null,
  monorepo: false,
};

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "onerules-rc-"));
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

describe(".onerulesrc", () => {
  it("merges custom rules into generated output", async () => {
    await writeFile(
      join(tempDir, ".onerulesrc"),
      JSON.stringify({
        principles: ["Always explain reasoning before writing code."],
        doNot: ["DO NOT use any ORM."],
      }),
    );

    const { outputs } = await generateAll(tempDir, profile, { tools: ["claude"], force: true });
    const claude = outputs[0].content;
    expect(claude).toContain("Always explain reasoning before writing code.");
    expect(claude).toContain("DO NOT use any ORM.");
  });

  it("generates normally when no .onerulesrc exists", async () => {
    const { outputs } = await generateAll(tempDir, profile, { tools: ["claude"], force: true });
    expect(outputs[0].content).toContain("Principles");
    expect(outputs[0].content).toContain("DO NOT");
  });

  it("reports hasCustomRules correctly", async () => {
    const result1 = await generateAll(tempDir, profile, { tools: ["claude"], force: true });
    expect(result1.hasCustomRules).toBe(false);

    await writeFile(join(tempDir, ".onerulesrc"), JSON.stringify({ principles: ["test"] }));
    const result2 = await generateAll(tempDir, profile, { tools: ["claude"], force: true });
    expect(result2.hasCustomRules).toBe(true);
  });
});
