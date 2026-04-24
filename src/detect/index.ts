import { readFile, access, readdir, stat } from "node:fs/promises";
import { join, basename } from "node:path";
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

export interface WorkspaceInfo {
  name: string;
  path: string;
  profile: StackProfile;
}

async function resolveGlob(dir: string, pattern: string): Promise<string[]> {
  const parts = pattern.replace(/\/\*$/, "").replace(/\/\*\*$/, "");
  const baseDir = join(dir, parts);
  try {
    const entries = await readdir(baseDir);
    const dirs: string[] = [];
    for (const entry of entries) {
      const fullPath = join(baseDir, entry);
      const s = await stat(fullPath).catch(() => null);
      if (s?.isDirectory()) {
        const hasPkg = await fileExists(join(fullPath, "package.json"));
        if (hasPkg) dirs.push(fullPath);
      }
    }
    return dirs;
  } catch {
    return [];
  }
}

export async function detectWorkspaces(dir: string): Promise<WorkspaceInfo[]> {
  const workspaces: string[] = [];

  // pnpm-workspace.yaml
  try {
    const content = await readFile(join(dir, "pnpm-workspace.yaml"), "utf-8");
    const patterns = content.match(/- ['"]?([^'"\n]+)['"]?/g) ?? [];
    for (const p of patterns) {
      const pattern = p.replace(/^- ['"]?/, "").replace(/['"]?$/, "");
      workspaces.push(...await resolveGlob(dir, pattern));
    }
  } catch {}

  // package.json workspaces
  if (workspaces.length === 0) {
    try {
      const pkg = JSON.parse(await readFile(join(dir, "package.json"), "utf-8"));
      const patterns: string[] = Array.isArray(pkg.workspaces) ? pkg.workspaces : pkg.workspaces?.packages ?? [];
      for (const pattern of patterns) {
        workspaces.push(...await resolveGlob(dir, pattern));
      }
    } catch {}
  }

  const results: WorkspaceInfo[] = [];
  for (const wsPath of workspaces) {
    const profile = await detectStack(wsPath);
    if (profile.languages.length > 0) {
      results.push({ name: basename(wsPath), path: wsPath, profile });
    }
  }

  return results;
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
