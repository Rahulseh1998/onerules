import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { StackProfile } from "../types.js";

export async function detectRuby(dir: string, profile: StackProfile): Promise<void> {
  let content: string;
  try {
    content = await readFile(join(dir, "Gemfile"), "utf-8");
  } catch {
    return;
  }

  profile.languages.push("ruby");
  profile.packageManager = "bundler";

  const gems = content
    .split("\n")
    .map((l) => l.match(/gem\s+['"]([^'"]+)['"]/)?.[1])
    .filter((g): g is string => g !== undefined);

  if (gems.includes("rails")) profile.framework = "rails";

  const notable = [
    "sidekiq", "devise", "pundit", "rspec",
    "capybara", "factory_bot", "rubocop",
    "pg", "redis", "puma", "dry-rb",
  ];
  for (const gem of notable) {
    if (gems.includes(gem)) profile.libraries.push(gem);
  }

  if (gems.includes("rspec") || gems.includes("rspec-rails")) {
    profile.testFramework = "rspec";
  } else if (gems.includes("minitest")) {
    profile.testFramework = "minitest";
  }

  if (gems.includes("rubocop")) profile.linter = "rubocop";
}
