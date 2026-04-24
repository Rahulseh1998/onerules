import { Command } from "commander";
import pc from "picocolors";
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { detectStack } from "./detect/index.js";
import { generateAll } from "./generate/index.js";
import { formatStackSummary } from "./generate/common.js";
import type { ToolId, ToolOutput } from "./types.js";

async function checkGitignore(dir: string, outputs: ToolOutput[]): Promise<string[]> {
  try {
    const content = await readFile(join(dir, ".gitignore"), "utf-8");
    const patterns = content.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
    const ignored: string[] = [];
    for (const out of outputs) {
      for (const pattern of patterns) {
        if (out.filePath.startsWith(pattern) || out.filePath.includes(pattern)) {
          ignored.push(out.filePath);
          break;
        }
      }
    }
    return ignored;
  } catch {
    return [];
  }
}

const VERSION = "0.6.0";

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
    const { outputs, skipped, hasCustomRules } = await generateAll(dir, profile, {
      tools,
      force: opts.force,
      dryRun: opts.dryRun,
    });

    if (hasCustomRules) {
      console.log(`  ${pc.cyan("Custom:")} ${pc.dim(".onerulesrc loaded")}`);
      console.log();
    }

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
      const ignored = await checkGitignore(dir, outputs);
      if (ignored.length > 0) {
        console.log(`  ${pc.yellow("⚠ Warning:")} These files may be in .gitignore:`);
        for (const f of ignored) {
          console.log(`    ${pc.yellow("!")} ${pc.dim(f)}`);
        }
        console.log(pc.dim("    Remove them from .gitignore so AI tools can read them."));
        console.log();
      }
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
  .command("inspect")
  .description("Show what onerules detected in your project")
  .option("-d, --dir <path>", "Project directory", ".")
  .action(async (opts) => {
    const dir = resolve(opts.dir);

    console.log();
    console.log(pc.bold("  onerules inspect") + pc.dim(` v${VERSION}`));
    console.log();

    const profile = await detectStack(dir);

    if (profile.languages.length === 0) {
      console.log(pc.yellow("  ⚠ No recognized project files found."));
      console.log();
      process.exit(1);
    }

    console.log(`  ${pc.bold("Languages:")}    ${profile.languages.map(l => pc.cyan(l)).join(", ") || pc.dim("none")}`);
    console.log(`  ${pc.bold("Framework:")}    ${profile.framework ? pc.cyan(profile.framework) : pc.dim("none")}`);
    console.log(`  ${pc.bold("Libraries:")}    ${profile.libraries.length > 0 ? profile.libraries.map(l => pc.cyan(l)).join(", ") : pc.dim("none")}`);
    console.log(`  ${pc.bold("Package mgr:")}  ${profile.packageManager ? pc.cyan(profile.packageManager) : pc.dim("none")}`);
    console.log(`  ${pc.bold("Test fwk:")}     ${profile.testFramework ? pc.cyan(profile.testFramework) : pc.dim("none")}`);
    console.log(`  ${pc.bold("Linter:")}       ${profile.linter ? pc.cyan(profile.linter) : pc.dim("none")}`);
    console.log(`  ${pc.bold("Formatter:")}    ${profile.formatter ? pc.cyan(profile.formatter) : pc.dim("none")}`);
    console.log(`  ${pc.bold("CI:")}           ${profile.ci ? pc.cyan(profile.ci) : pc.dim("none")}`);
    console.log(`  ${pc.bold("Monorepo:")}     ${profile.monorepo ? pc.cyan("yes") : pc.dim("no")}`);

    console.log();

    const ruleCategories: string[] = ["base anti-slop rules"];
    if (profile.languages.length > 0) ruleCategories.push(`${profile.languages.join(" + ")} language rules`);
    if (profile.framework) ruleCategories.push(`${profile.framework} framework rules`);
    for (const lib of profile.libraries) {
      ruleCategories.push(`${lib} library rules`);
    }
    if (profile.testFramework) ruleCategories.push(`${profile.testFramework} testing conventions`);
    if (profile.linter) ruleCategories.push(`${profile.linter} linting`);
    if (profile.formatter) ruleCategories.push(`${profile.formatter} formatting`);

    console.log(`  ${pc.bold("Rules that will be generated:")}`);
    for (const cat of ruleCategories) {
      console.log(`    ${pc.green("✓")} ${cat}`);
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
