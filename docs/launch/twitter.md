# Twitter/X Launch Posts

## Main launch tweet

```
I built a tool that scores your CLAUDE.md 0-100 and tells you why your AI ignores it.

My rules scored 6/100. "Follow best practices" → AI ignores it. "Write clean code" → meaningless.

onerules generates anti-slop rules that actually change AI behavior:

npm i -g @blackforge/onerules
onerules doctor

[demo GIF attached]

github.com/Rahulseh1998/onerules
```

## Thread (reply to main tweet)

```
1/ Here's what most CLAUDE.md files look like:

- Follow best practices
- Write clean code  
- Use TypeScript
- Add proper error handling

Score: 6/100. AI ignores all of it.

2/ Here's what onerules generates:

- DO NOT over-abstract. No AbstractFactoryProviderManager
- DO NOT add try/catch around code that cannot throw
- DO NOT install axios. Fetch is built-in and cached by Next.js
- DO NOT create interfaces for single implementations

3/ It auto-detects your stack. If you use Prisma:

"DO NOT create a repository wrapper around Prisma. db.users.findMany() is already clean."

If you use Zustand:

"DO NOT put server data in Zustand. Use React Query for server state."

4/ Works for 21 AI tools simultaneously:
Claude Code, Cursor, Copilot, Codex, Gemini CLI, Windsurf, Cline, Aider, Roo Code, Trae, Kiro, Continue

One command. All tools. 2 seconds. Offline. No API keys.

5/ Try it now:
npm i -g @blackforge/onerules
onerules doctor

Or try the web playground (no install):
rahulseh1998.github.io/onerules/playground/

github.com/Rahulseh1998/onerules
```

## Tags to use
@AnthropicAI @cursor_ai @GitHubCopilot

## Hashtags
#AI #CodingTools #ClaudeCode #Cursor #DeveloperTools #OpenSource
```
