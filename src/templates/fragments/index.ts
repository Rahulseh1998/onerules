import type { Framework, RuleSet } from "../../types.js";
import { getNextjsRules } from "./nextjs.js";
import { getReactRules } from "./react.js";
import { getFastapiRules } from "./fastapi.js";
import { getVueRules } from "./vue.js";
import { getNuxtRules } from "./nuxt.js";
import { getSveltekitRules } from "./sveltekit.js";
import { getDjangoRules } from "./django.js";
import { getRailsRules } from "./rails.js";
import { getExpressRules } from "./express.js";
import { getHonoRules } from "./hono.js";
import { getGinRules } from "./gin.js";
import { getAxumRules } from "./axum.js";
import { getAstroRules } from "./astro.js";
import { getRemixRules } from "./remix.js";
import { getFlaskRules } from "./flask.js";

const frameworkRules: Partial<Record<Framework, () => RuleSet>> = {
  nextjs: getNextjsRules,
  react: getReactRules,
  vue: getVueRules,
  nuxt: getNuxtRules,
  sveltekit: getSveltekitRules,
  astro: getAstroRules,
  remix: getRemixRules,
  express: getExpressRules,
  hono: getHonoRules,
  fastapi: getFastapiRules,
  django: getDjangoRules,
  flask: getFlaskRules,
  rails: getRailsRules,
  gin: getGinRules,
  axum: getAxumRules,
};

export function getFrameworkRules(framework: Framework | null): RuleSet | null {
  if (!framework) return null;
  const getter = frameworkRules[framework];
  return getter ? getter() : null;
}
