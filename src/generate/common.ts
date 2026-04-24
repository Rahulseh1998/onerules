import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { StackProfile, RuleSet } from "../types.js";
import { getBaseRules, getLanguageRules, getToolingRules } from "../templates/base.js";
import { getFrameworkRules } from "../templates/fragments/index.js";

export function buildRuleSet(profile: StackProfile, customRules?: RuleSet): RuleSet {
  const base = getBaseRules();
  const lang = getLanguageRules(profile);
  const tooling = getToolingRules(profile);
  const framework = getFrameworkRules(profile.framework);

  return mergeRuleSets(base, lang, tooling, framework ?? {}, customRules ?? {});
}

export async function loadCustomRules(dir: string): Promise<RuleSet | undefined> {
  try {
    const content = await readFile(join(dir, ".onerulesrc"), "utf-8");
    return JSON.parse(content) as RuleSet;
  } catch {
    return undefined;
  }
}

function mergeRuleSets(...sets: RuleSet[]): RuleSet {
  const merged: RuleSet = {};
  const keys: (keyof RuleSet)[] = [
    "projectContext",
    "principles",
    "codingPatterns",
    "doNot",
    "testing",
    "architecture",
    "performance",
    "security",
    "style",
  ];

  for (const key of keys) {
    if (key === "projectContext") {
      for (const set of sets) {
        if (set.projectContext) merged.projectContext = set.projectContext;
      }
    } else {
      const all: string[] = [];
      for (const set of sets) {
        const val = set[key];
        if (val) all.push(...val);
      }
      if (all.length > 0) (merged as any)[key] = all;
    }
  }

  return merged;
}

export function formatStackSummary(profile: StackProfile): string {
  const parts: string[] = [];
  if (profile.framework) parts.push(formatName(profile.framework));
  else if (profile.languages.length > 0) parts.push(profile.languages.map(formatName).join(" + "));
  if (profile.languages.includes("typescript") && profile.framework) parts.push("TypeScript");
  if (profile.libraries.length > 0) {
    parts.push(profile.libraries.slice(0, 5).map(formatName).join(", "));
  }
  if (profile.packageManager && ["pnpm", "yarn", "bun", "uv", "poetry"].includes(profile.packageManager)) {
    parts.push(profile.packageManager);
  }
  return parts.join(" + ") || "Unknown stack";
}

function formatName(s: string): string {
  const names: Record<string, string> = {
    nextjs: "Next.js",
    react: "React",
    vue: "Vue",
    nuxt: "Nuxt",
    svelte: "Svelte",
    sveltekit: "SvelteKit",
    angular: "Angular",
    astro: "Astro",
    remix: "Remix",
    express: "Express",
    fastify: "Fastify",
    hono: "Hono",
    fastapi: "FastAPI",
    django: "Django",
    flask: "Flask",
    rails: "Rails",
    gin: "Gin",
    fiber: "Fiber",
    actix: "Actix",
    axum: "Axum",
    typescript: "TypeScript",
    javascript: "JavaScript",
    python: "Python",
    go: "Go",
    rust: "Rust",
    ruby: "Ruby",
    "react-native": "React Native",
    tailwindcss: "Tailwind CSS",
    prisma: "Prisma",
    "prisma-client": "Prisma",
    "drizzle-orm": "Drizzle",
    pydantic: "Pydantic",
    sqlalchemy: "SQLAlchemy",
  };
  return names[s] || s;
}

export function renderMarkdownRules(rules: RuleSet, toolHeader?: string): string {
  const sections: string[] = [];

  if (toolHeader) sections.push(toolHeader);

  if (rules.projectContext) {
    sections.push(rules.projectContext);
  }

  if (rules.principles?.length) {
    sections.push("## Principles\n\n" + rules.principles.map((r) => `- ${r}`).join("\n"));
  }

  if (rules.codingPatterns?.length) {
    sections.push("## Coding Patterns\n\n" + rules.codingPatterns.map((r) => `- ${r}`).join("\n"));
  }

  if (rules.architecture?.length) {
    sections.push("## Architecture\n\n" + rules.architecture.map((r) => `- ${r}`).join("\n"));
  }

  if (rules.doNot?.length) {
    sections.push("## Do Not\n\n" + rules.doNot.map((r) => `- ${r}`).join("\n"));
  }

  if (rules.testing?.length) {
    sections.push("## Testing\n\n" + rules.testing.map((r) => `- ${r}`).join("\n"));
  }

  if (rules.performance?.length) {
    sections.push("## Performance\n\n" + rules.performance.map((r) => `- ${r}`).join("\n"));
  }

  if (rules.security?.length) {
    sections.push("## Security\n\n" + rules.security.map((r) => `- ${r}`).join("\n"));
  }

  if (rules.style?.length) {
    sections.push("## Style & Tooling\n\n" + rules.style.map((r) => `- ${r}`).join("\n"));
  }

  return sections.join("\n\n") + "\n";
}
