import { readFile } from "node:fs/promises";
import { join } from "node:path";

export interface MergeResult {
  merged: string;
  addedCount: number;
  skippedCount: number;
}

export async function mergeWithExisting(
  dir: string,
  filePath: string,
  generatedContent: string,
): Promise<MergeResult | null> {
  let existing: string;
  try {
    existing = await readFile(join(dir, filePath), "utf-8");
  } catch {
    return null;
  }

  const existingKeywords = extractKeywords(existing);
  const generatedRules = extractRules(generatedContent);
  const newRules: string[] = [];
  let skippedCount = 0;

  for (const rule of generatedRules) {
    const ruleKeywords = extractKeywords(rule);
    if (ruleKeywords.size < 2) continue;

    const overlap = keywordOverlap(ruleKeywords, existingKeywords);
    if (overlap >= 0.4) {
      skippedCount++;
    } else {
      newRules.push(rule);
    }
  }

  if (newRules.length === 0) {
    return { merged: existing, addedCount: 0, skippedCount };
  }

  const section = [
    "",
    "## onerules — Auto-detected Rules",
    "",
    "> Added by [onerules](https://github.com/Rahulseh1998/onerules). These rules were detected from your stack but not found in your existing rules.",
    "",
    ...newRules.map((r) => `- ${r}`),
    "",
  ].join("\n");

  const merged = existing.trimEnd() + "\n" + section;

  return { merged, addedCount: newRules.length, skippedCount };
}

function extractRules(content: string): string[] {
  const rules: string[] = [];
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") && trimmed.length > 15) {
      rules.push(trimmed.slice(2));
    }
  }
  return rules;
}

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "must", "shall", "can", "need", "dare",
  "to", "of", "in", "for", "on", "with", "at", "by", "from", "as",
  "into", "through", "during", "before", "after", "above", "below",
  "between", "out", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "each",
  "every", "both", "few", "more", "most", "other", "some", "such", "no",
  "nor", "not", "only", "own", "same", "so", "than", "too", "very",
  "just", "don", "should", "now", "and", "but", "or", "if", "while",
  "that", "this", "it", "its", "use", "using", "used", "your", "you",
  "them", "they", "their", "what", "which", "who", "whom",
]);

function extractKeywords(text: string): Set<string> {
  const words = text.toLowerCase()
    .replace(/`[^`]*`/g, (m) => m.replace(/`/g, ""))
    .replace(/[^a-z0-9_\-/.]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  return new Set(words);
}

function keywordOverlap(ruleKeywords: Set<string>, existingKeywords: Set<string>): number {
  if (ruleKeywords.size === 0) return 0;
  let matches = 0;
  for (const kw of ruleKeywords) {
    if (existingKeywords.has(kw)) matches++;
  }
  return matches / ruleKeywords.size;
}
