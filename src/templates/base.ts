import type { StackProfile, RuleSet } from "../types.js";

export function getBaseRules(): RuleSet {
  return {
    principles: [
      "Think before coding. Understand the full requirement before writing any code.",
      "Simplicity first. Prefer the simplest solution that works. Avoid premature abstraction.",
      "Make surgical changes. Only modify what is necessary. Don't refactor unrelated code.",
      "No dead code. Remove unused imports, variables, and functions. Don't comment out code.",
      "Write self-documenting code. Use descriptive names. Only add comments when the WHY is non-obvious.",
    ],
    codingPatterns: [
      "Prefer editing existing files over creating new ones.",
      "Follow the existing code style and patterns in the project.",
      "Handle errors at system boundaries (user input, external APIs). Trust internal code.",
      "Prefer explicit over implicit. Avoid magic numbers and strings.",
    ],
    doNot: [
      "Do not add features beyond what was requested.",
      "Do not introduce unnecessary abstractions or helper functions.",
      "Do not add backwards-compatibility shims or feature flags unless asked.",
      "Do not generate placeholder or TODO comments.",
      "Do not add excessive error handling for impossible scenarios.",
    ],
    testing: [
      "Write tests for new functionality.",
      "Test edge cases and error paths, not just the happy path.",
      "Keep tests focused and independent.",
    ],
    security: [
      "Never hardcode secrets, API keys, or credentials.",
      "Sanitize user input. Prevent injection attacks (SQL, XSS, command injection).",
      "Use parameterized queries for database operations.",
    ],
  };
}

export function getLanguageRules(profile: StackProfile): RuleSet {
  const rules: RuleSet = {};

  if (profile.languages.includes("typescript")) {
    rules.codingPatterns = [
      "Use TypeScript strict mode. Avoid `any` — use `unknown` with type narrowing instead.",
      "Prefer interfaces for object shapes, type aliases for unions/intersections.",
      "Use `const` by default, `let` only when reassignment is needed. Never use `var`.",
      "Prefer `async/await` over raw Promises and callbacks.",
      "Use optional chaining (`?.`) and nullish coalescing (`??`) over manual null checks.",
    ];
    rules.doNot = [
      "Do not use `@ts-ignore` or `@ts-expect-error` without explanation.",
      "Do not use `enum` — prefer `as const` objects or union types.",
      "Do not use `namespace`. Use ES modules.",
    ];
  }

  if (profile.languages.includes("python")) {
    rules.codingPatterns = [
      "Use type hints for all function signatures.",
      "Use dataclasses or Pydantic models for structured data.",
      "Use pathlib.Path instead of os.path for file operations.",
      "Use f-strings for string formatting.",
      "Use context managers (`with`) for resource management.",
    ];
    rules.doNot = [
      "Do not use mutable default arguments.",
      "Do not use bare `except:` — always specify exception types.",
      "Do not use `import *`.",
    ];
  }

  if (profile.languages.includes("go")) {
    rules.codingPatterns = [
      "Handle errors explicitly. Never ignore returned errors.",
      "Use meaningful variable names. Avoid single-letter names except in short loops.",
      "Use interfaces for behavior abstraction, structs for data.",
      "Prefer table-driven tests.",
      "Use `context.Context` for cancellation and timeouts.",
    ];
    rules.doNot = [
      "Do not use `panic` for normal error handling.",
      "Do not use `init()` functions unless absolutely necessary.",
      "Do not use global mutable state.",
    ];
  }

  if (profile.languages.includes("rust")) {
    rules.codingPatterns = [
      "Use `Result<T, E>` for fallible operations. Avoid `unwrap()` in production code.",
      "Prefer `&str` over `String` for function parameters when ownership isn't needed.",
      "Use iterators and combinators over manual loops when it improves clarity.",
      "Derive common traits (`Debug`, `Clone`, `PartialEq`) on structs.",
      "Use `thiserror` for library errors, `anyhow` for application errors.",
    ];
    rules.doNot = [
      "Do not use `unsafe` without a safety comment explaining the invariant.",
      "Do not use `.clone()` to appease the borrow checker without understanding why.",
    ];
  }

  if (profile.languages.includes("ruby")) {
    rules.codingPatterns = [
      "Follow Ruby style conventions (snake_case methods, CamelCase classes).",
      "Use keyword arguments for methods with more than 2 parameters.",
      "Prefer `each` and `map` over `for` loops.",
      "Use `frozen_string_literal: true` pragma in all files.",
    ];
  }

  return rules;
}

export function getToolingRules(profile: StackProfile): RuleSet {
  const rules: RuleSet = {};
  const style: string[] = [];

  if (profile.packageManager) {
    const pm = profile.packageManager;
    if (["npm", "pnpm", "yarn", "bun"].includes(pm)) {
      style.push(`Use \`${pm}\` as the package manager. Do not use other package managers.`);
      if (pm === "pnpm") style.push("Use `pnpm dlx` instead of `npx`.");
      if (pm === "bun") style.push("Use `bunx` instead of `npx`.");
    }
  }

  if (profile.testFramework) {
    rules.testing = [`Use ${profile.testFramework} for testing.`];
  }

  if (profile.linter) {
    style.push(`Use ${profile.linter} for linting. Fix lint errors before committing.`);
  }

  if (profile.formatter) {
    style.push(`Use ${profile.formatter} for formatting. Format code before committing.`);
  }

  if (style.length > 0) rules.style = style;

  return rules;
}
