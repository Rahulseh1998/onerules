import { Command } from "commander";
import pc from "picocolors";
import { resolve } from "node:path";
import { detectStack } from "./detect/index.js";
import { generateAll } from "./generate/index.js";
import { formatStackSummary } from "./generate/common.js";
import type { ToolId } from "./types.js";

const VERSION = "0.2.1";

const program = new Command();

program
  .name("onerules")
  .description("One command. Every AI tool. Perfect rules.")
  .version(VERSION);

program
  .command("generate", { isDefault: true })
  .description("Detect your stack and generate AI coding rules for all tools")
  .option("-d, --dir <path>", "Project directory", ".")
  .option("-t, --tools <tools>", "Comma-separated list of tools (claude,cursor,copilot,codex,gemini,windsurf,cline,aider,roo,trae)")
  .option("-f, --force", "Overwrite existing files")
  .option("--dry-run", "Preview what would be generated without writing files")
  .action(async (opts) => {
    const dir = resolve(opts.dir);

    console.log();
    console.log(pc.bold("  onerules") + pc.dim(` v${VERSION}`));
    console.log();

    // Detect stack
    const profile = await detectStack(dir);

    if (profile.languages.length === 0) {
      console.log(pc.yellow("  ⚠ No recognized project files found in this directory."));
      console.log(pc.dim("    Run this command in a project with package.json, pyproject.toml, go.mod, Cargo.toml, or Gemfile."));
      console.log();
      process.exit(1);
    }

    const summary = formatStackSummary(profile);
    console.log(`  ${pc.green("Detected:")} ${pc.bold(summary)}`);
    console.log();

    // Parse tool filter
    const tools: ToolId[] | undefined = opts.tools
      ? (opts.tools as string).split(",").map((t: string) => t.trim() as ToolId)
      : undefined;

    // Generate
    const { outputs, skipped } = await generateAll(dir, profile, {
      tools,
      force: opts.force,
      dryRun: opts.dryRun,
    });

    if (outputs.length > 0) {
      const label = opts.dryRun ? "Would generate" : "Generated";
      console.log(`  ${pc.green(`${label} ${outputs.length} file${outputs.length > 1 ? "s" : ""}:`)}`);
      for (const out of outputs) {
        const check = opts.dryRun ? pc.dim("○") : pc.green("✓");
        console.log(`    ${check} ${pc.bold(padRight(out.filePath, 40))} ${pc.dim(`(${out.toolName})`)}`);
      }
    }

    if (skipped.length > 0) {
      console.log();
      console.log(`  ${pc.yellow(`Skipped ${skipped.length} existing file${skipped.length > 1 ? "s" : ""}:`)} ${pc.dim("(use --force to overwrite)")}`);
      for (const out of skipped) {
        console.log(`    ${pc.yellow("–")} ${pc.dim(out.filePath)} ${pc.dim(`(${out.toolName})`)}`);
      }
    }

    if (outputs.length === 0 && skipped.length === 0) {
      console.log(pc.dim("  No files to generate."));
    }

    console.log();

    if (!opts.dryRun && outputs.length > 0) {
      console.log(pc.dim("  Done. Add these files to your repo and your AI tools will follow them."));
      console.log();
    }
  });

program
  .command("update")
  .description("Re-detect stack and regenerate all rules files (overwrites existing)")
  .option("-d, --dir <path>", "Project directory", ".")
  .option("-t, --tools <tools>", "Comma-separated list of tools")
  .action(async (opts) => {
    const dir = resolve(opts.dir);

    console.log();
    console.log(pc.bold("  onerules update") + pc.dim(` v${VERSION}`));
    console.log();

    const profile = await detectStack(dir);

    if (profile.languages.length === 0) {
      console.log(pc.yellow("  ⚠ No recognized project files found."));
      console.log();
      process.exit(1);
    }

    const summary = formatStackSummary(profile);
    console.log(`  ${pc.green("Detected:")} ${pc.bold(summary)}`);
    console.log();

    const tools: ToolId[] | undefined = opts.tools
      ? (opts.tools as string).split(",").map((t: string) => t.trim() as ToolId)
      : undefined;

    const { outputs } = await generateAll(dir, profile, { tools, force: true });

    console.log(`  ${pc.green(`Updated ${outputs.length} file${outputs.length > 1 ? "s" : ""}:`)}`);
    for (const out of outputs) {
      console.log(`    ${pc.green("✓")} ${pc.bold(padRight(out.filePath, 40))} ${pc.dim(`(${out.toolName})`)}`);
    }
    console.log();
  });

program
  .command("diff")
  .description("Preview what would be generated without writing files")
  .option("-d, --dir <path>", "Project directory", ".")
  .action(async (opts) => {
    const dir = resolve(opts.dir);
    const profile = await detectStack(dir);
    const { outputs } = await generateAll(dir, profile, { dryRun: true, force: true });

    for (const out of outputs) {
      console.log(pc.bold(pc.cyan(`\n--- ${out.filePath} (${out.toolName}) ---\n`)));
      console.log(out.content);
    }
  });

function padRight(str: string, len: number): string {
  return str + " ".repeat(Math.max(0, len - str.length));
}

program.parse();
