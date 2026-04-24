import { describe, it, expect } from "vitest";
import { getLibraryRules } from "./index.js";

describe("getLibraryRules", () => {
  it("returns empty rules for unknown libraries", () => {
    const rules = getLibraryRules(["unknown-lib", "another-fake"]);
    expect(rules.codingPatterns).toBeUndefined();
    expect(rules.doNot).toBeUndefined();
  });

  it("returns Prisma rules for prisma-client", () => {
    const rules = getLibraryRules(["prisma-client"]);
    expect(rules.codingPatterns).toBeDefined();
    expect(rules.codingPatterns!.some((r) => r.includes("Prisma"))).toBe(true);
    expect(rules.doNot!.some((r) => r.includes("repository wrapper"))).toBe(true);
  });

  it("returns Zod rules", () => {
    const rules = getLibraryRules(["zod"]);
    expect(rules.codingPatterns!.some((r) => r.includes("z.infer"))).toBe(true);
  });

  it("returns Tailwind rules", () => {
    const rules = getLibraryRules(["tailwindcss"]);
    expect(rules.doNot!.some((r) => r.includes("@apply"))).toBe(true);
  });

  it("returns NextAuth rules for next-auth", () => {
    const rules = getLibraryRules(["next-auth"]);
    expect(rules.doNot!.some((r) => r.includes("JWT"))).toBe(true);
  });

  it("merges rules from multiple libraries", () => {
    const rules = getLibraryRules(["prisma-client", "zod", "tailwindcss"]);
    expect(rules.codingPatterns!.length).toBeGreaterThan(5);
    expect(rules.doNot!.length).toBeGreaterThan(3);
  });

  it("deduplicates aliased libraries", () => {
    const rules = getLibraryRules(["prisma", "prisma-client"]);
    const prismaRules = rules.codingPatterns!.filter((r) => r.includes("Prisma Client"));
    expect(prismaRules.length).toBe(1);
  });

  it("maps Redux Toolkit alias to redux rules", () => {
    const rules = getLibraryRules(["reduxjs-toolkit"]);
    expect(rules.codingPatterns!.some((r) => r.includes("createSlice"))).toBe(true);
  });

  it("returns Stripe security rules", () => {
    const rules = getLibraryRules(["stripe"]);
    expect(rules.security).toBeDefined();
    expect(rules.security!.some((r) => r.includes("webhook"))).toBe(true);
  });

  it("returns SQLAlchemy rules", () => {
    const rules = getLibraryRules(["sqlalchemy"]);
    expect(rules.codingPatterns!.some((r) => r.includes("2.0 style"))).toBe(true);
  });
});
