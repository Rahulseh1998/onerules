import type { Framework, RuleSet } from "../../types.js";
import { getNextjsRules } from "./nextjs.js";
import { getReactRules } from "./react.js";
import { getFastapiRules } from "./fastapi.js";

const frameworkRules: Partial<Record<Framework, () => RuleSet>> = {
  nextjs: getNextjsRules,
  react: getReactRules,
  fastapi: getFastapiRules,
};

export function getFrameworkRules(framework: Framework | null): RuleSet | null {
  if (!framework) return null;
  const getter = frameworkRules[framework];
  return getter ? getter() : null;
}
