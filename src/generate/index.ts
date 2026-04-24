import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { StackProfile, ToolOutput, ToolId, RuleSet, GenerateOptions } from "../types.js";
import { loadCustomRules, buildRuleSet, renderMarkdownRules, formatStackSummary } from "./common.js";
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

const generators: Record<ToolId, (profile: StackProfile, customRules?: RuleSet) => ToolOutput> = {
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
};

const ALL_TOOLS: ToolId[] = ["claude", "cursor", "copilot", "codex", "gemini", "windsurf", "cline", "aider", "roo", "trae", "kiro", "continue"];

export interface GenerateResult {
  outputs: ToolOutput[];
  skipped: ToolOutput[];
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
  const customRules = await loadCustomRules(dir);

  for (const toolId of toolIds) {
    const generator = generators[toolId];
    if (!generator) continue;

    const output = generator(profile, customRules);
    const fullPath = join(dir, output.filePath);

    if (!options.force) {
      try {
        await access(fullPath);
        skipped.push(output);
        continue;
      } catch {}
    }

    if (!options.dryRun) {
      await mkdir(dirname(fullPath), { recursive: true });
      await writeFile(fullPath, output.content, "utf-8");
    }

    outputs.push(output);
  }

  return { outputs, skipped, hasCustomRules: !!customRules };
}
