export interface StackProfile {
  languages: Language[];
  framework: Framework | null;
  libraries: string[];
  packageManager: PackageManager | null;
  testFramework: string | null;
  linter: string | null;
  formatter: string | null;
  ci: CISystem | null;
  monorepo: boolean;
}

export type Language = "typescript" | "javascript" | "python" | "go" | "rust" | "ruby";

export type Framework =
  | "nextjs"
  | "react"
  | "vue"
  | "nuxt"
  | "svelte"
  | "sveltekit"
  | "angular"
  | "astro"
  | "remix"
  | "express"
  | "fastify"
  | "hono"
  | "fastapi"
  | "django"
  | "flask"
  | "rails"
  | "gin"
  | "fiber"
  | "actix"
  | "axum"
  | "tauri"
  | "electron"
  | "react-native"
  | "flutter";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun" | "pip" | "poetry" | "uv" | "cargo" | "go" | "bundler";

export type CISystem = "github-actions" | "gitlab-ci" | "circleci";

export type ToolId =
  | "claude"
  | "cursor"
  | "copilot"
  | "codex"
  | "gemini"
  | "windsurf"
  | "cline"
  | "aider"
  | "roo"
  | "trae"
  | "kiro"
  | "continue";

export interface ToolOutput {
  toolId: ToolId;
  toolName: string;
  filePath: string;
  content: string;
}

export interface RulePack {
  name: string;
  description: string;
  framework: Framework;
  rules: RuleSet;
}

export interface RuleSet {
  projectContext?: string;
  principles?: string[];
  codingPatterns?: string[];
  doNot?: string[];
  testing?: string[];
  architecture?: string[];
  performance?: string[];
  security?: string[];
  style?: string[];
}

export interface GenerateOptions {
  tools?: ToolId[];
  pack?: string;
  dryRun?: boolean;
  force?: boolean;
}
