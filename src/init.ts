import pc from "picocolors";
import { resolve } from "node:path";
import { createInterface } from "node:readline";
import { detectStack } from "./detect/index.js";
import { generateAll } from "./generate/index.js";
import { formatStackSummary } from "./generate/common.js";
import type { ToolId } from "./types.js";

const ALL_TOOLS: { id: ToolId; name: string }[] = [
  { id: "claude", name: "Claude Code" },
  { id: "cursor", name: "Cursor" },
  { id: "copilot", name: "GitHub Copilot" },
  { id: "codex", name: "OpenAI Codex" },
  { id: "gemini", name: "Gemini CLI" },
  { id: "windsurf", name: "Windsurf" },
  { id: "cline", name: "Cline" },
  { id: "aider", name: "Aider" },
  { id: "roo", name: "Roo Code" },
  { id: "trae", name: "Trae" },
  { id: "kiro", name: "Kiro (AWS)" },
  { id: "continue", name: "Continue" },
];

function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function runInit(dir: string) {
  console.log();
  console.log(pc.bold("  onerules init"));
  console.log();

  const profile = await detectStack(resolve(dir));

  if (profile.languages.length === 0) {
    console.log(pc.yellow("  ⚠ No recognized project files found. Run this in a project directory."));
    console.log();
    process.exit(1);
  }

  const summary = formatStackSummary(profile);
  console.log(`  ${pc.green("Detected:")} ${pc.bold(summary)}`);
  console.log(`  ${pc.dim("Languages:")}  ${profile.languages.join(", ")}`);
  console.log(`  ${pc.dim("Framework:")}  ${profile.framework || "none"}`);
  console.log(`  ${pc.dim("Libraries:")}  ${profile.libraries.join(", ") || "none"}`);
  console.log(`  ${pc.dim("Tooling:")}    ${[profile.packageManager, profile.testFramework, profile.linter, profile.formatter].filter(Boolean).join(", ")}`);
  console.log();

  console.log("  Available tools:");
  for (let i = 0; i < ALL_TOOLS.length; i++) {
    console.log(`    ${pc.dim(`${i + 1}.`)} ${ALL_TOOLS[i].name}`);
  }
  console.log();

  const answer = await ask(`  Which tools? ${pc.dim("(enter for all, or comma-separated numbers e.g. 1,2,3)")}: `);

  let selectedTools: ToolId[];
  if (!answer || answer.toLowerCase() === "all") {
    selectedTools = ALL_TOOLS.map((t) => t.id);
  } else {
    const indices = answer.split(",").map((s) => parseInt(s.trim()) - 1).filter((i) => i >= 0 && i < ALL_TOOLS.length);
    selectedTools = indices.length > 0 ? indices.map((i) => ALL_TOOLS[i].id) : ALL_TOOLS.map((t) => t.id);
  }

  const forceAnswer = await ask(`  Overwrite existing files? ${pc.dim("(y/N)")}: `);
  const force = forceAnswer.toLowerCase() === "y" || forceAnswer.toLowerCase() === "yes";

  console.log();

  const { outputs, skipped } = await generateAll(resolve(dir), profile, {
    tools: selectedTools,
    force,
  });

  if (outputs.length > 0) {
    console.log(`  ${pc.green(`Generated ${outputs.length} files:`)}`);
    for (const out of outputs) {
      console.log(`    ${pc.green("✓")} ${out.filePath} ${pc.dim(`(${out.toolName})`)}`);
    }
  }

  if (skipped.length > 0) {
    console.log();
    console.log(`  ${pc.yellow(`Skipped ${skipped.length} existing files`)} ${pc.dim("(use --force to overwrite)")}`);
  }

  console.log();
  console.log(pc.dim("  Done! Your AI tools will now follow these rules."));
  console.log();
}
