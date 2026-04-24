import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { StackProfile, ToolOutput, ToolId, RuleSet, RuleMode, GenerateOptions } from "../types.js";
import { loadCustomRules, buildRuleSet, renderMarkdownRules, formatStackSummary } from "./common.js";
import { mergeWithExisting } from "../merge.js";
import { generateClaude } from "./claude.js";
import { generateCursor } from "./cursor.js";
import { generateCopilot } from "./copilot.js";
import { generateCodex } from "./codex.js";
import { generateGemini } from "./gemini.js";
import { generateWindsurf } from "./windsurf.js";
import { generateCline } from "./cline.js";
import { generateAider } from "./aider.js";
import { generateRoo } from "./roo.js";
import { generateTrae } from "./trae.js";
import { generateKiro } from "./kiro.js";
import { generateContinue } from "./continue.js";
import { generateZed } from "./zed.js";
import { generateVoid } from "./void.js";
import { generateGoose } from "./goose.js";
import { generateOpenhands } from "./openhands.js";
import { generateJunie } from "./junie.js";
import { generateAmazonQ } from "./amazonq.js";
import { generateAugment } from "./augment.js";
import { generateBolt } from "./bolt.js";
import { generateWarp } from "./warp.js";

const generators: Record<ToolId, (profile: StackProfile, customRules?: RuleSet, mode?: RuleMode) => ToolOutput> = {
  claude: generateClaude,
  cursor: generateCursor,
  copilot: generateCopilot,
  codex: generateCodex,
  gemini: generateGemini,
  windsurf: generateWindsurf,
  cline: generateCline,
  aider: generateAider,
  roo: generateRoo,
  trae: generateTrae,
  kiro: generateKiro,
  continue: generateContinue,
  zed: generateZed,
  void: generateVoid,
  goose: generateGoose,
  openhands: generateOpenhands,
  junie: generateJunie,
  amazonq: generateAmazonQ,
  augment: generateAugment,
  bolt: generateBolt,
  warp: generateWarp,
};

const ALL_TOOLS: ToolId[] = [
  "claude", "cursor", "copilot", "codex", "gemini", "windsurf", "cline", "aider",
  "roo", "trae", "kiro", "continue", "zed", "void", "goose", "openhands",
  "junie", "amazonq", "augment", "bolt", "warp",
];

export interface MergedOutput {
  toolOutput: ToolOutput;
  addedCount: number;
  skippedCount: number;
}

export interface GenerateResult {
  outputs: ToolOutput[];
  skipped: ToolOutput[];
  merged: MergedOutput[];
  hasCustomRules: boolean;
}

export async function generateAll(
  dir: string,
  profile: StackProfile,
  options: GenerateOptions = {},
): Promise<GenerateResult> {
  const toolIds = options.tools ?? ALL_TOOLS;
  const outputs: ToolOutput[] = [];
  const skipped: ToolOutput[] = [];
  const merged: MergedOutput[] = [];
  const customRules = await loadCustomRules(dir);
  const mode = options.mode ?? "default";

  for (const toolId of toolIds) {
    const generator = generators[toolId];
    if (!generator) continue;

    const output = generator(profile, customRules, mode);
    const fullPath = join(dir, output.filePath);

    // Check if file exists
    let fileExists = false;
    try {
      await access(fullPath);
      fileExists = true;
    } catch {}

    if (fileExists && options.merge) {
      const result = await mergeWithExisting(dir, output.filePath, output.content);
      if (result && result.addedCount > 0) {
        if (!options.dryRun) {
          await writeFile(fullPath, result.merged, "utf-8");
        }
        merged.push({ toolOutput: output, addedCount: result.addedCount, skippedCount: result.skippedCount });
      } else {
        skipped.push(output);
      }
      continue;
    }

    if (fileExists && !options.force) {
      skipped.push(output);
      continue;
    }

    if (!options.dryRun) {
      await mkdir(dirname(fullPath), { recursive: true });
      await writeFile(fullPath, output.content, "utf-8");
    }

    outputs.push(output);
  }

  return { outputs, skipped, merged, hasCustomRules: !!customRules };
}
