# Before vs After: Generic Rules vs Anti-Slop Rules

## Why This Matters

Most CLAUDE.md / .cursorrules files look like this:

```markdown
## Generic Rules (what everyone writes)

- Follow best practices
- Write clean code
- Use TypeScript strict mode
- Add proper error handling
- Write tests for new features
- Keep components small
- Use meaningful variable names
```

These are vague, unenforceable, and AI tools ignore them because they're already trained on these principles.

**onerules generates rules that target specific AI failure modes:**

```markdown
## Anti-Slop Rules (what onerules generates)

- DO NOT over-abstract. No AbstractFactoryProviderManager. No BaseServiceInterface.
  If the class name needs 3+ words to describe what it does, it's doing too much
  or too little.

- DO NOT add try/catch around code that cannot throw. Do not wrap every function
  in error handling 'just in case'.

- DO NOT create interfaces/types for a single implementation. Interface `IUserService`
  with one class `UserService` is pointless indirection.

- Three similar lines are better than a premature abstraction. Do not DRY code
  until a pattern has repeated 3+ times with identical structure.

- A function that wraps another function without adding behavior is not an
  abstraction — it's noise. Delete it.
```

---

## Next.js: Before vs After

### Before (generic)
```markdown
- Use Server Components
- Follow App Router conventions
- Use Next.js Image component
```

### After (onerules)
```markdown
- Components are Server Components by default. Only add 'use client' when the
  component NEEDS browser APIs, event handlers, or useState/useEffect. Not every
  component that renders dynamic data needs 'use client'.

- DO NOT add 'use client' to a component just because it receives props or renders
  conditionally. Server Components can do both.

- DO NOT use useEffect(() => { fetch('/api/...') }, []) for data loading. Use a
  Server Component with async/await.

- DO NOT install axios. The Fetch API is built-in, cached by Next.js, and has
  extended options. axios adds 14KB for nothing.

- DO NOT create API routes (route.ts) for operations that should be Server Actions.
  If a client component needs to mutate data, use a server action, not a REST endpoint.
```

---

## React: Before vs After

### Before (generic)
```markdown
- Use functional components
- Use hooks properly
- Memoize expensive computations
```

### After (onerules)
```markdown
- DO NOT use useMemo or useCallback by default. Only add them when you've measured
  a performance problem. React re-renders are fast — premature memoization adds
  complexity for zero benefit.

- DO NOT use useEffect to sync state. If changing A should change B, compute B
  from A during render. The useState + useEffect sync pattern is the #1 React
  antipattern.

- DO NOT create a context for every piece of shared state. Prop drilling 2-3 levels
  is fine and more readable than context indirection.

- DO NOT create wrapper components that just pass all props through. <Button> that
  wraps <button> without adding behavior is noise.
```

---

## FastAPI: Before vs After

### Before (generic)
```markdown
- Use Pydantic for validation
- Organize code properly
- Handle errors
```

### After (onerules)
```markdown
- DO NOT create an AbstractBaseService, BaseRepository, GenericCRUDMixin stack for
  a simple CRUD app. A function that calls the ORM is fine.

- DO NOT create a separate repository layer wrapping SQLAlchemy for 'testability'.
  SQLAlchemy's Session is already your unit of work.

- DO NOT create an exceptions.py with 15 custom exception classes. Use HTTPException
  with status codes.

- Keep endpoints thin. Endpoint validates input → calls service → returns response.
  No business logic in route handlers.
```

---

## Testing: Before vs After

### Before (generic)
```markdown
- Write tests
- Achieve good coverage
- Use mocks when needed
```

### After (onerules)
```markdown
- No mocks unless the real thing is slow, flaky, or has side effects (network,
  database, filesystem). Mocking everything produces tests that verify mock
  behavior, not real behavior.

- Test failure modes, not just the happy path. If you only test that createUser
  works, you'll miss that duplicate emails crash the app.

- Do not use snapshot tests for components with behavioral assertions.
  expect(container).toMatchSnapshot() breaks on every CSS change and tests
  nothing meaningful.
```

---

The difference: generic rules tell AI what it already knows. Anti-slop rules tell AI what it specifically does wrong.
