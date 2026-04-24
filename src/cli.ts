import { Command } from "commander";
import pc from "picocolors";
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { detectStack, detectWorkspaces } from "./detect/index.js";
import { generateAll } from "./generate/index.js";
import { formatStackSummary } from "./generate/common.js";
import type { ToolId, ToolOutput } from "./types.js";
import { runInit } from "./init.js";
import { runDoctor, printDoctorResults } from "./doctor.js";
import { generateAIPrompt } from "./ai/prompt.js";
import { relative } from "node:path";

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

const VERSION = "1.1.0";

const program = new Command();

program
  .name("onerules")
  .description("Stop your AI from writing slop.")
  .version(VERSION);

program
  .command("init")
  .description("Interactive setup — choose which AI tools to generate rules for")
  .option("-d, --dir <path>", "Project directory", ".")
  .action(async (opts) => {
    await runInit(opts.dir);
  });

program
  .command("ai")
  .description("Generate a prompt for your AI tool to create project-specific rules")
  .option("-d, --dir <path>", "Project directory", ".")
  .option("--copy", "Copy prompt to clipboard")
  .option("-o, --output <file>", "Write prompt to a file")
  .action(async (opts) => {
    const dir = resolve(opts.dir);

    const profile = await detectStack(dir);
    if (profile.languages.length === 0) {
      console.error(pc.yellow("  ⚠ No recognized project files found."));
      process.exit(1);
    }

    const prompt = await generateAIPrompt(dir, profile);

    if (opts.output) {
      const { writeFile: wf } = await import("node:fs/promises");
      await wf(resolve(opts.output), prompt, "utf-8");
      console.log();
      console.log(`  ${pc.green("✓")} Prompt written to ${pc.bold(opts.output)}`);
      console.log(pc.dim(`  Feed this to your AI tool to generate project-specific rules.`));
      console.log();
      return;
    }

    if (opts.copy) {
      try {
        const { execSync } = await import("node:child_process");
        execSync("pbcopy", { input: prompt });
        console.log();
        console.log(`  ${pc.green("✓")} Prompt copied to clipboard (${Math.ceil(prompt.length / 4)} tokens)`);
        console.log();
        console.log(`  ${pc.bold("Next steps:")}`);
        console.log(`    1. Open Claude Code, Cursor, or ChatGPT`);
        console.log(`    2. Paste the prompt`);
        console.log(`    3. Review the generated rules`);
        console.log(`    4. Save to CLAUDE.md (or your tool's rules file)`);
        console.log();
        return;
      } catch {
        console.error(pc.yellow("  ⚠ Clipboard not available. Printing to stdout instead."));
      }
    }

    // Default: print to stdout for piping
    process.stdout.write(prompt);
  });

program
  .command("generate", { isDefault: true })
  .description("Detect your stack and generate AI coding rules for all tools")
  .option("-d, --dir <path>", "Project directory", ".")
  .option("-t, --tools <tools>", "Comma-separated list of tools (claude,cursor,copilot,codex,gemini,windsurf,cline,aider,roo,trae)")
  .option("-f, --force", "Overwrite existing files")
  .option("-m, --merge", "Smart merge: add missing rules to existing files without overwriting")
  .option("--dry-run", "Preview what would be generated without writing files")
  .option("--strict", "Add extra aggressive rules (max function length, no default exports, etc.)")
  .option("--minimal", "Generate only base anti-slop rules, skip framework/library-specific rules")
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
    const mode = opts.strict ? "strict" : opts.minimal ? "minimal" : "default";
    const { outputs, skipped, merged, hasCustomRules } = await generateAll(dir, profile, {
      tools,
      force: opts.force,
      merge: opts.merge,
      dryRun: opts.dryRun,
      mode: mode as any,
    });

    if (hasCustomRules) {
      console.log(`  ${pc.cyan("Custom:")} ${pc.dim(".onerulesrc loaded")}`);
      console.log();
    }

    if (merged.length > 0) {
      console.log(`  ${pc.green(`Merged into ${merged.length} existing file${merged.length > 1 ? "s" : ""}:`)}`);
      for (const m of merged) {
        console.log(`    ${pc.green("+")} ${pc.bold(padRight(m.toolOutput.filePath, 40))} ${pc.green(`${m.addedCount} rules added`)} ${pc.dim(`(${m.skippedCount} already present)`)}`);
      }
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
  .command("doctor")
  .description("Analyze existing rule files and suggest improvements")
  .option("-d, --dir <path>", "Project directory", ".")
  .action(async (opts) => {
    const dir = resolve(opts.dir);

    console.log();
    console.log(pc.bold("  onerules doctor") + pc.dim(` v${VERSION}`));
    console.log();

    const results = await runDoctor(dir);
    printDoctorResults(results);
  });

program
  .command("monorepo")
  .description("Generate rules for all workspaces in a monorepo")
  .option("-d, --dir <path>", "Monorepo root directory", ".")
  .option("-f, --force", "Overwrite existing files")
  .option("--strict", "Include strict rules")
  .option("--minimal", "Only base anti-slop rules")
  .action(async (opts) => {
    const dir = resolve(opts.dir);

    console.log();
    console.log(pc.bold("  onerules monorepo") + pc.dim(` v${VERSION}`));
    console.log();

    const rootProfile = await detectStack(dir);
    if (!rootProfile.monorepo) {
      console.log(pc.yellow("  ⚠ No monorepo detected (no pnpm-workspace.yaml, workspaces field, turbo.json, or nx.json)."));
      console.log(pc.dim("    Run `onerules` instead for single-project generation."));
      console.log();
      process.exit(1);
    }

    const workspaces = await detectWorkspaces(dir);
    if (workspaces.length === 0) {
      console.log(pc.yellow("  ⚠ Monorepo detected but no workspaces found with recognizable code."));
      console.log();
      process.exit(1);
    }

    console.log(`  ${pc.green("Found")} ${pc.bold(String(workspaces.length))} workspaces:`);
    console.log();

    const mode = opts.strict ? "strict" : opts.minimal ? "minimal" : "default";

    // Generate for root
    const { outputs: rootOutputs } = await generateAll(dir, rootProfile, { force: opts.force, mode: mode as any });
    if (rootOutputs.length > 0) {
      console.log(`  ${pc.bold("root/")}`);
      for (const out of rootOutputs) {
        console.log(`    ${pc.green("✓")} ${out.filePath}`);
      }
      console.log();
    }

    // Generate for each workspace
    for (const ws of workspaces) {
      const summary = formatStackSummary(ws.profile);
      const relPath = relative(dir, ws.path);
      const { outputs, skipped } = await generateAll(ws.path, ws.profile, { force: opts.force, mode: mode as any });

      console.log(`  ${pc.bold(relPath + "/")} ${pc.dim(`(${summary})`)}`);
      for (const out of outputs) {
        console.log(`    ${pc.green("✓")} ${out.filePath}`);
      }
      for (const out of skipped) {
        console.log(`    ${pc.yellow("–")} ${pc.dim(out.filePath)} ${pc.dim("(exists)")}`);
      }
      console.log();
    }

    const totalFiles = rootOutputs.length + workspaces.reduce((sum, ws) => sum, 0);
    console.log(pc.dim(`  Done. Generated rules for ${workspaces.length} workspaces.`));
    console.log();
  });

program
  .command("diff")
  .description("Preview what would be generated without writing files")
  .option("-d, --dir <path>", "Project directory", ".")
  .option("--strict", "Include strict rules")
  .option("--minimal", "Only base anti-slop rules")
  .action(async (opts) => {
    const dir = resolve(opts.dir);
    const profile = await detectStack(dir);
    const mode = opts.strict ? "strict" : opts.minimal ? "minimal" : "default";
    const { outputs } = await generateAll(dir, profile, { dryRun: true, force: true, mode: mode as any });

    for (const out of outputs) {
      console.log(pc.bold(pc.cyan(`\n--- ${out.filePath} (${out.toolName}) ---\n`)));
      console.log(out.content);
    }
  });

function padRight(str: string, len: number): string {
  return str + " ".repeat(Math.max(0, len - str.length));
}

program.parse();
