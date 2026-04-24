import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
import type { StackProfile, Language, Framework, PackageManager, CISystem } from "../types.js";
import { detectJavaScript } from "./javascript.js";
import { detectPython } from "./python.js";
import { detectGo } from "./go.js";
import { detectRust } from "./rust.js";
import { detectRuby } from "./ruby.js";

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function detectCI(dir: string): Promise<CISystem | null> {
  if (await fileExists(join(dir, ".github/workflows"))) return "github-actions";
  if (await fileExists(join(dir, ".gitlab-ci.yml"))) return "gitlab-ci";
  if (await fileExists(join(dir, ".circleci/config.yml"))) return "circleci";
  return null;
}

async function detectMonorepo(dir: string): Promise<boolean> {
  if (await fileExists(join(dir, "pnpm-workspace.yaml"))) return true;
  if (await fileExists(join(dir, "lerna.json"))) return true;
  if (await fileExists(join(dir, "nx.json"))) return true;
  if (await fileExists(join(dir, "turbo.json"))) return true;
  try {
    const pkg = JSON.parse(await readFile(join(dir, "package.json"), "utf-8"));
    if (pkg.workspaces) return true;
  } catch {}
  return false;
}

export async function detectStack(dir: string): Promise<StackProfile> {
  const profile: StackProfile = {
    languages: [],
    framework: null,
    libraries: [],
    packageManager: null,
    testFramework: null,
    linter: null,
    formatter: null,
    ci: null,
    monorepo: false,
  };

  const detectors = [
    detectJavaScript(dir, profile),
    detectPython(dir, profile),
    detectGo(dir, profile),
    detectRust(dir, profile),
    detectRuby(dir, profile),
  ];

  await Promise.all(detectors);

  profile.ci = await detectCI(dir);
  profile.monorepo = await detectMonorepo(dir);

  return profile;
}
