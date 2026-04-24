import * as p from "@clack/prompts";
import pc from "picocolors";
import { resolve } from "node:path";
import { detectStack } from "./detect/index.js";
import { generateAll } from "./generate/index.js";
import { formatStackSummary } from "./generate/common.js";
import type { ToolId } from "./types.js";

const ALL_TOOLS: { value: ToolId; label: string; hint: string }[] = [
  { value: "claude", label: "Claude Code", hint: "CLAUDE.md" },
  { value: "cursor", label: "Cursor", hint: ".cursor/rules/onerules.mdc" },
  { value: "copilot", label: "GitHub Copilot", hint: ".github/copilot-instructions.md" },
  { value: "codex", label: "OpenAI Codex", hint: "AGENTS.md" },
  { value: "gemini", label: "Gemini CLI", hint: "GEMINI.md" },
  { value: "windsurf", label: "Windsurf", hint: ".windsurfrules" },
  { value: "cline", label: "Cline", hint: ".clinerules" },
  { value: "aider", label: "Aider", hint: "CONVENTIONS.md" },
  { value: "roo", label: "Roo Code", hint: ".roo/rules/onerules.md" },
  { value: "trae", label: "Trae", hint: ".trae/rules/onerules.md" },
  { value: "kiro", label: "Kiro (AWS)", hint: ".kiro/rules/onerules.md" },
  { value: "continue", label: "Continue", hint: ".continue/rules/onerules.md" },
];

export async function runInit(dir: string) {
  p.intro(pc.bold("onerules init"));

  const spinner = p.spinner();
  spinner.start("Scanning project...");
  const profile = await detectStack(resolve(dir));
  spinner.stop("Project scanned");

  if (profile.languages.length === 0) {
    p.cancel("No recognized project files found. Run this in a project directory.");
    process.exit(1);
  }

  const summary = formatStackSummary(profile);
  p.note(
    [
      `${pc.bold("Stack:")}      ${summary}`,
      `${pc.bold("Languages:")}  ${profile.languages.join(", ")}`,
      `${pc.bold("Framework:")}  ${profile.framework || "none"}`,
      `${pc.bold("Libraries:")}  ${profile.libraries.length > 0 ? profile.libraries.join(", ") : "none"}`,
      `${pc.bold("Tooling:")}    ${[profile.packageManager, profile.testFramework, profile.linter, profile.formatter].filter(Boolean).join(", ")}`,
    ].join("\n"),
    "Detected",
  );

  const tools = await p.multiselect({
    message: "Which AI tools do you use?",
    options: ALL_TOOLS,
    initialValues: ["claude", "cursor", "copilot"] as ToolId[],
    required: true,
  });

  if (p.isCancel(tools)) {
    p.cancel("Setup cancelled.");
    process.exit(0);
  }

  const overwrite = await p.confirm({
    message: "Overwrite existing rule files?",
    initialValue: false,
  });

  if (p.isCancel(overwrite)) {
    p.cancel("Setup cancelled.");
    process.exit(0);
  }

  spinner.start("Generating rules...");
  const { outputs, skipped } = await generateAll(resolve(dir), profile, {
    tools: tools as ToolId[],
    force: overwrite as boolean,
  });
  spinner.stop("Rules generated");

  if (outputs.length > 0) {
    const fileList = outputs.map((o) => `${pc.green("✓")} ${o.filePath} ${pc.dim(`(${o.toolName})`)}`).join("\n");
    p.note(fileList, `Generated ${outputs.length} files`);
  }

  if (skipped.length > 0) {
    const skipList = skipped.map((o) => `${pc.yellow("–")} ${o.filePath}`).join("\n");
    p.note(skipList, `Skipped ${skipped.length} existing files`);
  }

  p.outro("Done! Your AI tools will now follow these rules.");
}
