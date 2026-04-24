import type { StackProfile, RuleSet, RuleMode } from "../types.js";

export function getBaseRules(): RuleSet {
  return {
    principles: [
      "STOP and understand the full requirement before writing a single line. Do not guess what the user wants — ask if unclear.",
      "Every change should be the MINIMAL diff that solves the problem. Touch only what is necessary. Leave unrelated code alone.",
      "Three similar lines are better than a premature abstraction. Do not DRY code until a pattern has repeated 3+ times with identical structure.",
      "If removing a piece of code would not confuse a reader, it should not exist: no dead code, no commented-out blocks, no unused imports.",
      "Before creating a new file, function, or component, search the codebase for existing ones that already do what you need.",
    ],
    codingPatterns: [
      "Inline simple logic. A 3-line helper called once is worse than 3 lines at the call site.",
      "A function that wraps another function without adding behavior is not an abstraction — it's noise. Delete it.",
      "Write code that a junior developer can read top-to-bottom without jumping between files. Locality of behavior over separation of concerns.",
      "Default to writing NO comments. The code should be self-documenting. Only comment the WHY when it would surprise a reader. No section banners (`// ======`), no JSDoc that restates the function name, no `// Define the user interface` above `interface User`.",
      "If a variable is used once and its name is obvious from context, inline it. `const url = getUrl(); fetch(url)` → `fetch(getUrl())`.",
      "Prefer flat code over nested code. Early returns over if/else chains. Guard clauses over deep nesting.",
      "Follow the existing patterns in the codebase. If the project uses callbacks, don't introduce Promises just for one function.",
      "When two code blocks are 90% identical, parameterize — don't copy-paste with slight variations. Duplication is cheaper than the wrong abstraction, but identical duplication is always wrong.",
      "Keep names proportional to scope. Loop variable `i` is fine. Module-level `listOfActiveUsersFilteredBySubscriptionStatus` is not — use `activeSubscribers`.",
    ],
    doNot: [
      "DO NOT over-abstract. No AbstractFactoryProviderManager. No BaseServiceInterface. If the class name needs 3+ words to describe what it does, it's doing too much or too little.",
      "DO NOT add layers that don't exist yet. If there's no service layer, don't create one for a single database call. If there's no middleware, don't add one for a single check.",
      "DO NOT add error handling for impossible cases. If a function only receives validated input, don't re-validate it. Trust the caller.",
      "DO NOT add try/catch around code that cannot throw. Do not wrap every function in error handling 'just in case'.",
      "DO NOT create interfaces/types for a single implementation. Interface `IUserService` with one class `UserService` is pointless indirection.",
      "DO NOT add logging, metrics, or telemetry unless asked. These are cross-cutting concerns that the user will add when ready.",
      "DO NOT generate TODO, FIXME, HACK, or placeholder comments. Either implement it or don't.",
      "DO NOT add feature flags, configuration options, or environment variables for things that have one value. YAGNI.",
      "DO NOT rename or reorganize existing code that works. A bug fix is not an invitation to refactor the module. If asked to fix line 50, do not touch lines 1-49.",
      "DO NOT create a utils, helpers, or common file. These become junk drawers. Put code where it's used.",
      "DO NOT duplicate code with slight variations. If `getActiveUsers()` and `getInactiveUsers()` differ by one string, write `getUsersByStatus(status)`.",
      "DO NOT create event emitters, pub/sub systems, or message buses when two functions just need to call each other. Direct calls are simpler.",
    ],
    testing: [
      "Test behavior, not implementation. Tests that break when you refactor internals are bad tests.",
      "One assertion per test that tests one thing. Not five assertions testing five different behaviors.",
      "No mocks unless the real thing is slow, flaky, or has side effects (network, database, filesystem). Mocking everything produces tests that verify mock behavior, not real behavior.",
      "Write the test that would have caught the bug. Not a test suite for every possible input combination.",
      "Test failure modes, not just the happy path. If you only test that `createUser` works, you'll miss that duplicate emails crash the app.",
      "Do not use snapshot tests for components with behavioral assertions. `expect(container).toMatchSnapshot()` breaks on every CSS change and tests nothing meaningful.",
    ],
    security: [
      "Never hardcode secrets, API keys, or credentials. Use environment variables.",
      "Sanitize ALL user input at system boundaries. Never trust query params, request bodies, or URL segments.",
      "Use parameterized queries. Never string-concatenate user input into SQL, commands, or HTML.",
      "Validate on the server, not just the client. Client-side validation is UX — server-side validation is security. Both are required.",
      "Never use `cors({ origin: '*' })` in production. Whitelist specific origins.",
      "Never store auth tokens in localStorage — it's vulnerable to XSS. Use httpOnly secure cookies.",
    ],
  };
}

export function getLanguageRules(profile: StackProfile): RuleSet {
  const rules: RuleSet = {};

  if (profile.languages.includes("typescript")) {
    rules.codingPatterns = [
      "Use TypeScript strict mode. `any` is a bug — use `unknown` with type guards or proper generic constraints.",
      "Prefer `type` over `interface` unless you need declaration merging. Never create `interface IFoo` — the `I` prefix is a code smell from C#.",
      "Use `as const` objects over enums. Enums have runtime behavior that surprises people.",
      "Infer types when TypeScript can. `const x: string = 'hello'` is redundant — `const x = 'hello'` is sufficient.",
      "Use discriminated unions over class hierarchies. `type Shape = Circle | Square` over `abstract class Shape`.",
      "Prefer `async/await` over `.then()` chains. Never mix the two styles.",
    ];
    rules.doNot = [
      "DO NOT create a type/interface for every object. Inline `{ name: string; age: number }` is fine for local use.",
      "DO NOT use `@ts-ignore`. If the types are wrong, fix the types, don't suppress the error.",
      "DO NOT create barrel files (index.ts re-exports) unless the module has a genuine public API. They slow builds and obscure dependencies.",
      "DO NOT use `namespace`. This is not C#. Use ES modules.",
      "DO NOT create a `types.ts` file that holds every type in the project. Colocate types with the code that uses them.",
    ];
  }

  if (profile.languages.includes("python")) {
    rules.codingPatterns = [
      "Use type hints for all function signatures and return types. Not for local variables where the type is obvious.",
      "Use dataclasses for data. Use Pydantic for validation. Don't write `__init__` methods by hand for data containers.",
      "Use pathlib.Path, not os.path. Use f-strings, not .format() or %. Use `with` for files.",
      "Comprehensions are fine for simple transforms. If the comprehension needs an `if` and a nested loop, use a regular for loop.",
      "Use `from __future__ import annotations` for forward references. Avoid `TYPE_CHECKING` import blocks unless you have circular imports.",
    ];
    rules.doNot = [
      "DO NOT create abstract base classes with a single concrete implementation. That's ceremony, not architecture.",
      "DO NOT use bare `except:` or `except Exception:`. Catch specific exceptions.",
      "DO NOT create a `utils.py` that grows forever. Put helpers next to where they're used.",
      "DO NOT use `import *`. Not in code, not in `__init__.py`. Explicit imports always.",
      "DO NOT use mutable default arguments (`def foo(items=[]):`). This is a known Python trap.",
    ];
  }

  if (profile.languages.includes("go")) {
    rules.codingPatterns = [
      "Handle errors immediately where they occur. `if err != nil { return err }` is fine. Don't wrap in custom error types unless you need to add context.",
      "Use `fmt.Errorf(\"doing X: %w\", err)` to add context. Don't create custom error types for every function.",
      "Accept interfaces, return structs. Define interfaces at the call site, not next to the implementation.",
      "Prefer table-driven tests. One test function with test cases, not ten test functions.",
      "Use `context.Context` as the first parameter for anything that does I/O.",
    ];
    rules.doNot = [
      "DO NOT use `panic` for error handling. Panic is for programmer bugs, not runtime errors.",
      "DO NOT create interfaces before you have two implementations. Go interfaces are satisfied implicitly — add them when you need the abstraction.",
      "DO NOT use `init()`. It makes code hard to test and reason about. Explicit initialization in main.",
      "DO NOT over-use channels. A mutex is simpler when you just need to protect shared state.",
    ];
  }

  if (profile.languages.includes("rust")) {
    rules.codingPatterns = [
      "Use `?` operator for error propagation. Don't write `match result { Ok(v) => v, Err(e) => return Err(e) }`.",
      "Use `thiserror` for library errors, `anyhow` for application errors. Don't implement Error by hand.",
      "Accept `&str`, return `String`. Accept `&[T]`, return `Vec<T>`. Borrow where you can, own where you must.",
      "Derive `Debug` on everything. Derive `Clone`, `PartialEq` when it makes sense. Don't hand-implement what derive can do.",
    ];
    rules.doNot = [
      "DO NOT use `.unwrap()` in production code. Use `?`, `.unwrap_or()`, or `.expect(\"reason\")` with an explanation.",
      "DO NOT `.clone()` to make the borrow checker happy without understanding why. Clone is a code smell that often hides a design issue.",
      "DO NOT use `unsafe` without a `// SAFETY:` comment explaining the invariant you're upholding.",
      "DO NOT create trait objects (`dyn Trait`) when generics (`impl Trait`) work. Dynamic dispatch has a cost.",
    ];
  }

  if (profile.languages.includes("ruby")) {
    rules.codingPatterns = [
      "Follow Ruby conventions: snake_case methods, CamelCase classes, SCREAMING_SNAKE constants.",
      "Use keyword arguments for methods with 2+ params. Positional arguments are unreadable at call sites.",
      "Prefer `each`/`map`/`select`/`reject` over `for` loops. Ruby is not Java.",
      "Use guard clauses. `return unless condition` is better than wrapping the entire method body in an `if`.",
    ];
    rules.doNot = [
      "DO NOT create a module for every 3 lines of shared code. Ruby mixins become untraceable spaghetti at scale.",
      "DO NOT use `method_missing` unless you're building a DSL. It makes code impossible to navigate.",
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
      style.push(`Use \`${pm}\` as the package manager. Do not switch to another package manager.`);
      if (pm === "pnpm") style.push("Use `pnpm dlx` instead of `npx`.");
      if (pm === "bun") style.push("Use `bunx` instead of `npx`.");
    }
  }

  if (profile.testFramework) {
    rules.testing = [`Use ${profile.testFramework} for tests. Follow existing test patterns in the codebase.`];
  }

  if (profile.linter) {
    style.push(`Use ${profile.linter} for linting. Fix lint errors before considering the task done.`);
  }

  if (profile.formatter) {
    style.push(`Use ${profile.formatter} for formatting. Never manually format code — let the tool do it.`);
  }

  if (style.length > 0) rules.style = style;

  return rules;
}

export function getStrictRules(): RuleSet {
  return {
    principles: [
      "Every function must fit on one screen (~40 lines). If it doesn't, split it.",
      "Every file must have a single, clear purpose. If you need a comment to explain what the file is for, the file is doing too much.",
    ],
    codingPatterns: [
      "Max 3 parameters per function. Use an options object for more.",
      "Max 2 levels of nesting. If you need more, extract a function.",
      "No function should have more than one side effect. Separate computation from mutation.",
      "Every public function must have a single return type — no `string | null | undefined | Error` unions wider than 2.",
    ],
    doNot: [
      "DO NOT use `console.log` for debugging. Use a proper debugger or structured logging.",
      "DO NOT use `setTimeout` or `setInterval` for control flow. Use proper async patterns.",
      "DO NOT use string concatenation for building HTML, SQL, URLs, or file paths. Use template literals, query builders, URL constructors, and path.join.",
      "DO NOT use `new Date()` directly for time-sensitive logic. Inject a clock for testability.",
      "DO NOT use default exports. Named exports are searchable, refactorable, and less error-prone.",
      "DO NOT commit `console.log`, `debugger`, or `.only` test markers.",
    ],
    testing: [
      "Every bug fix must include a regression test. No exceptions.",
      "Test file structure must mirror source structure. `src/users/service.ts` → `src/users/service.test.ts`.",
    ],
    security: [
      "Every API endpoint must validate authentication AND authorization. Auth check alone is not enough.",
      "Use Content-Security-Policy headers. Not having CSP is a vulnerability.",
      "Rate limit all public endpoints. Unauthenticated endpoints get stricter limits.",
    ],
  };
}
