<p align="center">
  <h1 align="center">onerules</h1>
  <p align="center"><strong>一条命令，所有 AI 工具，完美规则。</strong></p>
  <p align="center">
    自动检测项目技术栈，为 10 个 AI 编码工具生成优化的编码规则 — 不到 2 秒。
  </p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@blackforge/onerules"><img src="https://img.shields.io/npm/v/@blackforge/onerules.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@blackforge/onerules"><img src="https://img.shields.io/npm/dm/@blackforge/onerules.svg" alt="npm downloads"></a>
  <a href="https://github.com/onerules/onerules/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license"></a>
</p>

<p align="center">
  <a href="../README.md">English</a> | 简体中文
</p>

---

## 问题

每个 AI 编码工具都有自己的规则文件。如果你使用多个工具，就需要在多种格式中维护相同的规则：

| 工具 | 文件 |
|------|------|
| Claude Code | `CLAUDE.md` |
| Cursor | `.cursor/rules/*.mdc` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| OpenAI Codex | `AGENTS.md` |
| Gemini CLI | `GEMINI.md` |
| Windsurf | `.windsurfrules` |
| Cline | `.clinerules` |
| Aider | `CONVENTIONS.md` |
| Roo Code | `.roo/rules/*.md` |
| Trae | `.trae/rules/*.md` |

**onerules** 一条命令生成所有文件。

## 快速开始

```bash
# 全局安装（推荐）
npm i -g @blackforge/onerules

# 在任何项目中运行
onerules
```

无需 API 密钥，无需配置。完全离线运行。

```
  onerules v0.2.0

  Detected: Next.js + TypeScript + Tailwind CSS + Prisma + pnpm

  Generated 10 files:
    ✓ CLAUDE.md                         (Claude Code)
    ✓ .cursor/rules/onerules.mdc        (Cursor)
    ✓ .github/copilot-instructions.md   (GitHub Copilot)
    ✓ AGENTS.md                         (OpenAI Codex)
    ✓ GEMINI.md                         (Gemini CLI)
    ✓ .windsurfrules                    (Windsurf)
    ✓ .clinerules                       (Cline)
    ✓ CONVENTIONS.md                    (Aider)
    ✓ .roo/rules/onerules.md            (Roo Code)
    ✓ .trae/rules/onerules.md           (Trae)

  Done in 1.2s
```

## 特性

- **零配置** — 自动从 package.json、pyproject.toml、go.mod、Cargo.toml 或 Gemfile 检测技术栈
- **10 个 AI 工具** — 为每个工具生成正确的文件格式
- **18 个框架** — 为 Next.js、React、Vue、Nuxt、SvelteKit、Angular、Astro、Remix、Express、Fastify、Hono、FastAPI、Django、Flask、Rails、Gin、Fiber、Axum 提供深度规则
- **无需 LLM** — 确定性生成，快速（<2秒），完全离线
- **智能规则** — 基于原则的最佳实践，不是 500 行的规则堆砌
- **安全默认** — 默认跳过已存在的文件

## 支持的技术栈

### 语言
TypeScript, JavaScript, Python, Go, Rust, Ruby

### 框架（深度规则）
Next.js, React, Vue, Nuxt, SvelteKit, Angular, Astro, Remix, Express, Fastify, Hono, FastAPI, Django, Flask, Rails, Gin, Fiber, Axum

### 工具链
pnpm, yarn, bun, npm, uv, poetry, pip, cargo, bundler | Vitest, Jest, Playwright, Cypress, pytest, RSpec | ESLint, Biome, Ruff, RuboCop | Prettier, dprint, Black

## 命令

```bash
npx @blackforge/onerules                     # 为所有 10 个工具生成规则
npx @blackforge/onerules -t claude,cursor    # 只为指定工具生成
npx @blackforge/onerules --force             # 覆盖已存在的文件
npx @blackforge/onerules --dry-run           # 预览而不写入
npx @blackforge/onerules -d ./my-project     # 指定项目目录
npx @blackforge/onerules diff                # 显示将要生成的内容
```

## 常见问题

**会覆盖我现有的 CLAUDE.md 吗？**
不会。默认跳过已存在的文件。使用 `--force` 来覆盖。

**需要调用 AI API 吗？**
不需要。onerules 完全确定性运行，离线工作。无需 API 密钥。

**可以自定义生成的规则吗？**
可以。运行 onerules 后直接编辑生成的文件。它们都是纯 Markdown。

## 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详情。

## 许可证

MIT
