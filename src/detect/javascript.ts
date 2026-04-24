import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
import type { StackProfile, Framework } from "../types.js";

export async function detectJavaScript(dir: string, profile: StackProfile): Promise<void> {
  let pkg: Record<string, any>;
  try {
    pkg = JSON.parse(await readFile(join(dir, "package.json"), "utf-8"));
  } catch {
    return;
  }

  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  // Language
  if (allDeps["typescript"] || pkg.devDependencies?.["typescript"]) {
    profile.languages.push("typescript");
  } else {
    profile.languages.push("javascript");
  }

  // Framework
  profile.framework = detectFramework(allDeps);

  // Libraries
  const notable = [
    "tailwindcss", "prisma", "@prisma/client",
    "drizzle-orm", "zod", "trpc", "@trpc/server",
    "react-query", "@tanstack/react-query",
    "zustand", "jotai", "redux", "@reduxjs/toolkit",
    "socket.io", "graphql", "apollo-server",
    "stripe", "next-auth", "lucia", "better-auth",
    "shadcn-ui", "@radix-ui/react-slot",
    "framer-motion", "three",
    "mongoose", "typeorm", "sequelize", "knex",
  ];
  for (const lib of notable) {
    if (allDeps[lib]) profile.libraries.push(lib.replace("@", "").replace("/", "-"));
  }

  // Package manager
  if (pkg.packageManager?.startsWith("pnpm")) profile.packageManager = "pnpm";
  else if (pkg.packageManager?.startsWith("yarn")) profile.packageManager = "yarn";
  else if (pkg.packageManager?.startsWith("bun")) profile.packageManager = "bun";
  else {
    try {
      await access(join(dir, "pnpm-lock.yaml"));
      profile.packageManager = "pnpm";
    } catch {
      try {
        await access(join(dir, "yarn.lock"));
        profile.packageManager = "yarn";
      } catch {
        try {
          await access(join(dir, "bun.lockb"));
          profile.packageManager = "bun";
        } catch {
          profile.packageManager = "npm";
        }
      }
    }
  }

  // Test framework
  if (allDeps["vitest"]) profile.testFramework = "vitest";
  else if (allDeps["jest"]) profile.testFramework = "jest";
  else if (allDeps["mocha"]) profile.testFramework = "mocha";
  else if (allDeps["playwright"] || allDeps["@playwright/test"]) {
    profile.testFramework = "playwright";
    profile.libraries.push("playwright");
  }
  else if (allDeps["cypress"]) {
    profile.testFramework = "cypress";
    profile.libraries.push("cypress");
  }

  // Linter
  if (allDeps["@biomejs/biome"]) profile.linter = "biome";
  else if (allDeps["eslint"]) profile.linter = "eslint";
  else if (allDeps["oxlint"]) profile.linter = "oxlint";

  // Formatter
  if (allDeps["@biomejs/biome"]) profile.formatter = "biome";
  else if (allDeps["prettier"]) profile.formatter = "prettier";
  else if (allDeps["dprint"]) profile.formatter = "dprint";
}

function detectFramework(deps: Record<string, string>): Framework | null {
  if (deps["next"]) return "nextjs";
  if (deps["nuxt"]) return "nuxt";
  if (deps["@sveltejs/kit"]) return "sveltekit";
  if (deps["svelte"]) return "svelte";
  if (deps["astro"]) return "astro";
  if (deps["@remix-run/react"] || deps["remix"]) return "remix";
  if (deps["@angular/core"]) return "angular";
  if (deps["vue"]) return "vue";
  if (deps["react-native"]) return "react-native";
  if (deps["react"]) return "react";
  if (deps["hono"]) return "hono";
  if (deps["fastify"]) return "fastify";
  if (deps["express"]) return "express";
  if (deps["tauri"] || deps["@tauri-apps/api"]) return "tauri";
  if (deps["electron"]) return "electron";
  return null;
}
