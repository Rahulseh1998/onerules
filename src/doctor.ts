import { readFile } from "node:fs/promises";
import { join } from "node:path";
import pc from "picocolors";

interface DiagnosticResult {
  file: string;
  issues: Issue[];
  score: number;
}

interface Issue {
  severity: "warn" | "error";
  message: string;
  suggestion: string;
}

const WEAK_PATTERNS: { pattern: RegExp; message: string; suggestion: string }[] = [
  { pattern: /follow best practices/i, message: "\"Follow best practices\" is too vague — AI ignores it", suggestion: "Replace with specific anti-patterns: \"DO NOT create wrapper classes for single implementations\"" },
  { pattern: /write clean code/i, message: "\"Write clean code\" is meaningless to an AI", suggestion: "Replace with concrete rules: \"Max 40 lines per function. Early returns over nested if/else.\"" },
  { pattern: /use meaningful (variable )?names/i, message: "\"Use meaningful names\" — AI already tries this", suggestion: "Replace with: \"Keep names proportional to scope. Loop var `i` is fine. Module-level `listOfActiveUsersFilteredByStatus` is not.\"" },
  { pattern: /add proper error handling/i, message: "\"Add proper error handling\" leads to try/catch around everything", suggestion: "Replace with: \"Handle errors at system boundaries. Trust internal code. DO NOT add try/catch around code that cannot throw.\"" },
  { pattern: /keep (it |things )?simple/i, message: "\"Keep it simple\" without specifics is ignored", suggestion: "Replace with: \"Three similar lines > premature abstraction. DO NOT DRY until a pattern repeats 3+ times.\"" },
  { pattern: /^-?\s*write tests?\s*$/im, message: "\"Write tests\" without guidance leads to useless tests", suggestion: "Replace with: \"Test behavior not implementation. No mocks unless the real thing has side effects. Test failure modes.\"" },
  { pattern: /follow existing patterns/i, message: "Good but too vague — which patterns?", suggestion: "Be specific: \"Use Server Components by default. Server Actions for mutations. Route Groups for organization.\"" },
  { pattern: /^-?\s*use typescript\s*$/im, message: "Just saying \"use TypeScript\" doesn't prevent AI from using `any` everywhere", suggestion: "Replace with: \"`any` is a bug. Use `unknown` with type guards. Infer types when TypeScript can.\"" },
  { pattern: /^#+ ?TODO/im, message: "TODO sections in rules files are not actionable", suggestion: "Either add the rules or remove the section." },
  { pattern: /be consistent/i, message: "\"Be consistent\" — with what? AI needs specifics.", suggestion: "Replace with explicit patterns: \"Use `async/await` not `.then()`. Use `type` not `interface` unless merging.\"" },
  { pattern: /avoid unnecessary/i, message: "\"Avoid unnecessary X\" — AI thinks everything it generates is necessary", suggestion: "Replace with: \"DO NOT create X when Y. [specific condition]\"" },
  { pattern: /when possible/i, message: "\"When possible\" is an escape hatch — AI always decides it's not possible", suggestion: "Make the rule unconditional, or specify the exact exception." },
];

const MISSING_SECTIONS: { name: string; keywords: string[]; message: string }[] = [
  { name: "DO NOT rules", keywords: ["do not", "don't", "never", "avoid"], message: "No explicit prohibitions. AI needs to know what NOT to do — that's more effective than what to do." },
  { name: "Security rules", keywords: ["security", "xss", "injection", "csrf", "auth", "cors"], message: "No security rules. AI generates `cors({origin: '*'})` and `localStorage.setItem('token')` without guidance." },
  { name: "Testing rules", keywords: ["test", "mock", "assert", "spec"], message: "No testing rules. AI generates snapshot tests and mocks everything without guidance." },
];

export async function runDoctor(dir: string): Promise<DiagnosticResult[]> {
  const files = [
    { path: "CLAUDE.md", tool: "Claude Code" },
    { path: ".cursorrules", tool: "Cursor (legacy)" },
    { path: ".cursor/rules", tool: "Cursor" },
    { path: ".github/copilot-instructions.md", tool: "GitHub Copilot" },
    { path: "AGENTS.md", tool: "OpenAI Codex" },
    { path: "GEMINI.md", tool: "Gemini CLI" },
    { path: ".windsurfrules", tool: "Windsurf" },
    { path: ".clinerules", tool: "Cline" },
  ];

  const results: DiagnosticResult[] = [];

  for (const { path, tool } of files) {
    let content: string;
    try {
      content = await readFile(join(dir, path), "utf-8");
    } catch {
      continue;
    }

    const issues: Issue[] = [];

    for (const { pattern, message, suggestion } of WEAK_PATTERNS) {
      if (pattern.test(content)) {
        issues.push({ severity: "warn", message, suggestion });
      }
    }

    const contentLower = content.toLowerCase();
    for (const { name, keywords, message } of MISSING_SECTIONS) {
      const hasSection = keywords.some((kw) => contentLower.includes(kw));
      if (!hasSection) {
        issues.push({ severity: "error", message: `Missing: ${name}. ${message}`, suggestion: `Run \`onerules --force\` to generate rules with ${name.toLowerCase()}.` });
      }
    }

    const lineCount = content.split("\n").length;
    if (lineCount < 10) {
      issues.push({ severity: "warn", message: `Only ${lineCount} lines. Most effective rule files have 40-80 lines.`, suggestion: "Run `onerules --force` to generate comprehensive rules." });
    }

    const score = Math.max(0, 100 - issues.filter((i) => i.severity === "error").length * 15 - issues.filter((i) => i.severity === "warn").length * 8);

    results.push({ file: `${path} (${tool})`, issues, score });
  }

  return results;
}

export function printDoctorResults(results: DiagnosticResult[]) {
  if (results.length === 0) {
    console.log(pc.dim("  No existing rule files found. Run `onerules` to generate them."));
    return;
  }

  for (const result of results) {
    const scoreColor = result.score >= 70 ? pc.green : result.score >= 40 ? pc.yellow : pc.red;
    console.log(`  ${pc.bold(result.file)} — ${scoreColor(`Score: ${result.score}/100`)}`);

    if (result.issues.length === 0) {
      console.log(`    ${pc.green("✓")} No issues found`);
    } else {
      for (const issue of result.issues) {
        const icon = issue.severity === "error" ? pc.red("✗") : pc.yellow("⚠");
        console.log(`    ${icon} ${issue.message}`);
        console.log(`      ${pc.dim("→")} ${pc.dim(issue.suggestion)}`);
      }
    }
    console.log();
  }

  const avgScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);
  const avgColor = avgScore >= 70 ? pc.green : avgScore >= 40 ? pc.yellow : pc.red;
  console.log(`  ${pc.bold("Overall:")} ${avgColor(`${avgScore}/100`)}`);

  if (avgScore < 70) {
    console.log(pc.dim("  Run `onerules --force` to replace with anti-slop rules."));
  }
  console.log();
}
