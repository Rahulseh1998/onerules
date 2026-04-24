import type { RuleSet } from "../../types.js";

const libraryRules: Record<string, RuleSet> = {
  prisma: {
    codingPatterns: [
      "Use Prisma Client for all database queries. Use `include` for relations, `select` for partial fields.",
      "Use Prisma's `createMany`, `updateMany`, `deleteMany` for batch operations. Not loops with individual `create`.",
      "Use `prisma.$transaction()` for operations that must succeed or fail together.",
      "Use Prisma Migrate (`npx prisma migrate dev`) for schema changes. Never edit the database manually.",
    ],
    doNot: [
      "DO NOT use raw SQL with Prisma unless you need a query Prisma can't express. `prisma.$queryRaw` is the escape hatch, not the default.",
      "DO NOT create a repository wrapper around Prisma. Prisma IS the repository. `db.users.findMany()` is already clean — wrapping it in `UserRepository.findAll()` adds nothing.",
      "DO NOT forget to handle unique constraint violations. Use try/catch with `PrismaClientKnownRequestError` code `P2002` for duplicates.",
    ],
  },

  "drizzle-orm": {
    codingPatterns: [
      "Define schemas in `drizzle/schema.ts`. Use `pgTable`, `mysqlTable`, or `sqliteTable` for type-safe table definitions.",
      "Use Drizzle's query builder for type-safe queries: `db.select().from(users).where(eq(users.id, id))`.",
      "Use `drizzle-kit` for migrations. `npx drizzle-kit generate` then `npx drizzle-kit migrate`.",
      "Use relational queries with `db.query.users.findMany({ with: { posts: true } })` for eager loading.",
    ],
    doNot: [
      "DO NOT mix raw SQL with Drizzle queries. Use `sql` template tag if you need custom SQL.",
      "DO NOT create an ORM abstraction layer on top of Drizzle. It's already a thin query builder — another layer is redundant.",
    ],
  },

  zod: {
    codingPatterns: [
      "Define schemas once, derive TypeScript types with `z.infer<typeof schema>`. Don't duplicate types manually.",
      "Use `.safeParse()` when you need the error details. Use `.parse()` when invalid data is a bug.",
      "Compose schemas: `const createUserSchema = baseUserSchema.omit({ id: true })`. Don't copy-paste schemas.",
      "Use `z.coerce.number()` for string-to-number coercion from form data and query params.",
    ],
    doNot: [
      "DO NOT write manual validation logic when Zod can express it. `if (!email.includes('@'))` → `z.string().email()`.",
      "DO NOT create a validation utility layer that wraps Zod. Just call `.parse()` directly.",
    ],
  },

  trpc: {
    codingPatterns: [
      "Define routers per feature: `userRouter`, `postRouter`. Merge with `t.router({ user: userRouter })`.",
      "Use Zod schemas for input validation in procedures: `.input(z.object({ id: z.string() }))`.",
      "Use `useQuery` and `useMutation` hooks from the tRPC React client. They handle caching and invalidation.",
      "Use middleware for shared concerns (auth, logging): `t.procedure.use(isAuthed)`.",
    ],
    doNot: [
      "DO NOT create REST API routes alongside tRPC. Pick one. tRPC gives you type safety end-to-end.",
      "DO NOT use `fetch` to call your own tRPC endpoints. Use the typed client.",
    ],
  },

  tailwindcss: {
    codingPatterns: [
      "Use Tailwind utility classes directly. Don't create CSS files for things Tailwind can express.",
      "Extract repeated class combinations into components, not `@apply` rules. Components > class extraction.",
      "Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) for responsive design. Not CSS media queries.",
      "Use `cn()` or `clsx()` for conditional class merging. Not string concatenation.",
    ],
    doNot: [
      "DO NOT use `@apply` in CSS files to extract utilities. Create a component instead — `@apply` defeats the purpose of utility-first CSS.",
      "DO NOT write custom CSS for margins, padding, colors, or typography that Tailwind classes can handle.",
      "DO NOT use both Tailwind and a CSS-in-JS library. Pick one styling approach.",
    ],
  },

  "tanstack-react-query": {
    codingPatterns: [
      "Use `useQuery` for GET requests. Use `useMutation` for POST/PUT/DELETE.",
      "Use query keys that include all parameters: `['users', userId]` not just `['users']`.",
      "Use `queryClient.invalidateQueries` after mutations to refetch stale data.",
      "Use `staleTime` to control how often data refetches. Default (0) refetches on every mount.",
    ],
    doNot: [
      "DO NOT use `useEffect` + `useState` for data fetching when React Query is available. That's reinventing React Query poorly.",
      "DO NOT use `refetchInterval` for data that doesn't change frequently. It wastes API calls.",
    ],
  },

  "react-query": {
    codingPatterns: [
      "Use `useQuery` for GET requests. Use `useMutation` for POST/PUT/DELETE.",
      "Use query keys that include all parameters: `['users', userId]` not just `['users']`.",
      "Use `queryClient.invalidateQueries` after mutations to refetch stale data.",
    ],
    doNot: [
      "DO NOT use `useEffect` + `useState` for data fetching when React Query is available.",
    ],
  },

  zustand: {
    codingPatterns: [
      "Keep stores small and focused. One store per domain: `useAuthStore`, `useCartStore`. Not one global store.",
      "Use selectors to avoid unnecessary re-renders: `const name = useStore(s => s.name)`. Not `const store = useStore()`.",
      "Use `immer` middleware if your state updates are complex. Otherwise, spread operators are fine.",
    ],
    doNot: [
      "DO NOT put server/fetched data in Zustand. Use React Query for server state, Zustand for client state only.",
      "DO NOT create a Zustand store for state that lives in one component. `useState` is simpler.",
    ],
  },

  jotai: {
    codingPatterns: [
      "Use atoms for individual pieces of state. Derive with `atom((get) => get(baseAtom) * 2)`.",
      "Use `atomWithStorage` for state that persists across sessions.",
    ],
    doNot: [
      "DO NOT create atoms for state that only one component uses. `useState` is simpler.",
    ],
  },

  redux: {
    codingPatterns: [
      "Use Redux Toolkit (`createSlice`, `configureStore`). Never write Redux boilerplate by hand.",
      "Use `createAsyncThunk` for async operations. Use RTK Query for data fetching.",
      "Keep slices focused: one slice per feature domain.",
    ],
    doNot: [
      "DO NOT write `switch` statement reducers. Use `createSlice` with `reducers` object.",
      "DO NOT use `connect()` HOC. Use `useSelector` and `useDispatch` hooks.",
      "DO NOT store server data in Redux when RTK Query or React Query is available.",
    ],
  },

  "radix-ui-react-slot": {
    codingPatterns: [
      "Use Radix primitives as the base for custom components. Don't rebuild accessible dropdown/dialog/tooltip from scratch.",
      "Use the `asChild` prop to merge Radix behavior with your own components.",
      "Style Radix components with `data-state` attributes for state-based styling: `data-[state=open]:bg-blue-500`.",
    ],
    doNot: [
      "DO NOT add `aria-*` attributes manually to Radix components. They're already accessible.",
      "DO NOT rebuild modal/dialog/popover from scratch. Use Radix Dialog/Popover. Accessibility is harder than it looks.",
    ],
  },

  "framer-motion": {
    codingPatterns: [
      "Use `motion.div` variants for reusable animations. Define `initial`, `animate`, `exit` states.",
      "Use `AnimatePresence` for exit animations on unmounting components.",
      "Use `layout` prop for automatic layout animations when elements reorder.",
    ],
    doNot: [
      "DO NOT animate with CSS transitions when Framer Motion is available. Consistency matters.",
      "DO NOT animate `width`/`height` — animate `scale` or use `layout` prop for better performance.",
    ],
  },

  stripe: {
    codingPatterns: [
      "Use Stripe's server-side SDK for all payment operations. Never create charges from the client.",
      "Use Stripe webhooks for payment confirmation. Don't poll for payment status.",
      "Use `stripe.checkout.sessions.create()` for one-time payments. Use Subscriptions API for recurring.",
    ],
    security: [
      "Verify webhook signatures with `stripe.webhooks.constructEvent()`. Never trust unverified webhooks.",
      "Never log or expose full card numbers or Stripe secret keys. Use publishable key on the client only.",
    ],
    doNot: [
      "DO NOT store card details in your database. Stripe handles PCI compliance — use their tokenization.",
      "DO NOT use floating point for money calculations. Use integers (cents) or Stripe's amount format.",
    ],
  },

  "next-auth": {
    codingPatterns: [
      "Configure in `auth.ts` at the project root. Use `auth()` in Server Components, `useSession()` in Client Components.",
      "Use middleware (`middleware.ts`) for route-level auth protection. Not per-page checks.",
      "Use the `session` callback to add custom fields (role, org) to the session object.",
    ],
    doNot: [
      "DO NOT roll your own JWT/session logic. NextAuth handles token rotation, CSRF, and session management.",
      "DO NOT store auth state in React context or Zustand. Use NextAuth's built-in session management.",
    ],
  },

  lucia: {
    codingPatterns: [
      "Use Lucia's session management with your database adapter. Sessions are stored server-side.",
      "Use middleware to validate sessions on each request. `lucia.validateSession(sessionId)`.",
      "Use Lucia's CSRF protection. Don't skip it.",
    ],
    doNot: [
      "DO NOT store session tokens in localStorage. Use httpOnly cookies (Lucia's default).",
    ],
  },

  mongoose: {
    codingPatterns: [
      "Define schemas with proper types and validation: `{ email: { type: String, required: true, unique: true } }`.",
      "Use `.lean()` for read-only queries — it returns plain objects instead of Mongoose documents, 5-10x faster.",
      "Use `populate()` for references. Define refs in the schema: `{ author: { type: Schema.Types.ObjectId, ref: 'User' } }`.",
    ],
    doNot: [
      "DO NOT use `Model.find()` without `.lean()` for read-only operations. The hydration overhead is unnecessary.",
      "DO NOT modify documents without `.save()` or use `findOneAndUpdate()`. Direct property assignment without save does nothing.",
      "DO NOT use `Schema.Types.Mixed` without a good reason. Type your embedded documents properly.",
    ],
  },

  pydantic: {
    codingPatterns: [
      "Use Pydantic v2 `BaseModel` for all data validation. Use `model_validator` for cross-field validation.",
      "Use `Field()` for constraints: `Field(min_length=1, max_length=100)`. Not manual if-checks.",
      "Use `model_dump()` to serialize, `model_validate()` to parse. Not `.dict()` (deprecated in v2).",
    ],
    doNot: [
      "DO NOT use dataclasses for API input/output when Pydantic is available. Pydantic adds validation, serialization, and OpenAPI schema generation.",
      "DO NOT catch `ValidationError` and re-raise with a custom message. Let FastAPI's exception handler return the structured errors.",
    ],
  },

  sqlalchemy: {
    codingPatterns: [
      "Use the 2.0 style: `select(User).where(User.id == id)` not `session.query(User).filter_by(id=id)`.",
      "Use `sessionmaker` with `expire_on_commit=False` for async contexts.",
      "Use Alembic for all schema migrations. `alembic revision --autogenerate` then review the generated migration.",
      "Use `relationship()` with `lazy='selectin'` or explicit `joinedload()` to avoid N+1 queries.",
    ],
    doNot: [
      "DO NOT use the legacy 1.x query API (`session.query()`). Use 2.0 `select()` style.",
      "DO NOT create a custom repository class wrapping SQLAlchemy Session. The Session IS the unit of work pattern.",
    ],
  },

  celery: {
    codingPatterns: [
      "Use `@shared_task` decorator for tasks that should be importable across apps.",
      "Use `task.delay()` for fire-and-forget. Use `task.apply_async()` when you need options (countdown, eta, retries).",
      "Use `autoretry_for` and `max_retries` on tasks that call external services.",
    ],
    doNot: [
      "DO NOT pass large objects as task arguments. Pass IDs and fetch from the database inside the task.",
      "DO NOT use `task.get()` synchronously — it blocks the caller. Use callbacks or poll asynchronously.",
    ],
  },

  redis: {
    codingPatterns: [
      "Use connection pooling. Create one Redis client/pool at startup, reuse across requests.",
      "Use appropriate data structures: strings for simple values, hashes for objects, sorted sets for leaderboards, lists for queues.",
      "Set TTL on all cache keys. No TTL = memory leak. `SETEX` or `SET key value EX seconds`.",
    ],
    doNot: [
      "DO NOT use `KEYS *` in production. It blocks Redis. Use `SCAN` for iteration.",
      "DO NOT store large objects (>100KB) in Redis. It's an in-memory store — be conscious of memory.",
    ],
  },

  "socket.io": {
    codingPatterns: [
      "Use rooms for group messaging. `socket.join('room-id')`, `io.to('room-id').emit()`.",
      "Use namespaces to separate concerns: `/chat`, `/notifications`, `/admin`.",
      "Handle disconnection and reconnection gracefully. Clients will disconnect — plan for it.",
    ],
    doNot: [
      "DO NOT broadcast to all clients when you mean to send to a specific room.",
      "DO NOT store session state only in socket memory. Sockets disconnect — persist state in Redis or database.",
    ],
  },

  graphql: {
    codingPatterns: [
      "Use DataLoader to batch and deduplicate database queries. This solves the N+1 problem in GraphQL resolvers.",
      "Define clear input types for mutations. Don't accept arbitrary JSON.",
      "Use fragments for shared field selections on the client side.",
    ],
    doNot: [
      "DO NOT resolve fields with individual database queries. Use DataLoader or eager loading.",
      "DO NOT expose your entire database schema as GraphQL types. Design the API for the client's needs.",
    ],
  },

  three: {
    codingPatterns: [
      "Dispose of geometries, materials, and textures when removing objects. Three.js does NOT garbage collect GPU resources.",
      "Use `requestAnimationFrame` for the render loop. Never use `setInterval`.",
      "Use `BufferGeometry` not `Geometry` (removed in r125+).",
      "Use `OrbitControls` from `three/addons/controls/OrbitControls` not from a separate package.",
    ],
    performance: [
      "Reuse materials and geometries across meshes where possible. Each unique material = another draw call.",
      "Use `InstancedMesh` for many identical objects. 1000 instances > 1000 separate meshes.",
      "Use `Object3D.frustumCulled = true` (default) and don't disable it without reason.",
    ],
    doNot: [
      "DO NOT create new materials/geometries inside the render loop. Create once, reuse.",
      "DO NOT forget to call `.dispose()` on materials, geometries, and textures when removing objects.",
    ],
  },

  playwright: {
    codingPatterns: [
      "Use locators (`page.getByRole()`, `page.getByText()`, `page.getByLabel()`) not CSS selectors. Locators are more resilient to DOM changes.",
      "Use `expect(locator).toBeVisible()` over `waitForSelector`. Playwright auto-waits with locators.",
      "Use `test.describe` to group related tests. Use `test.beforeEach` for shared setup.",
      "Use `page.route()` to mock API responses in tests. Don't hit real APIs in E2E tests.",
    ],
    doNot: [
      "DO NOT use `page.$()` or `page.$$()`. Use locators — they auto-wait and auto-retry.",
      "DO NOT use `page.waitForTimeout()`. Use `expect(locator).toBeVisible()` or `page.waitForResponse()`. Hard waits are flaky.",
      "DO NOT use CSS selectors like `.btn-primary` — they break when classes change. Use role/text/label locators.",
    ],
  },

  cypress: {
    codingPatterns: [
      "Use `cy.get()` with `data-cy` attributes for stable selectors: `cy.get('[data-cy=submit]')`.",
      "Use `cy.intercept()` to mock API responses. Don't depend on real backends in E2E tests.",
      "Use `cy.session()` for login caching across tests. Don't log in via UI for every test.",
      "Chain assertions: `cy.get('[data-cy=list]').should('have.length', 3)`.",
    ],
    doNot: [
      "DO NOT use `cy.wait(5000)`. Use `cy.intercept()` + `cy.wait('@alias')` for deterministic waits.",
      "DO NOT use `async/await` with Cypress commands. Cypress has its own command queue — mixing async breaks it.",
      "DO NOT test implementation details. Test user-visible behavior.",
    ],
  },
};

// Map normalized names (from detection) to rule keys
const aliases: Record<string, string> = {
  "prisma-client": "prisma",
  "tanstack-react-query": "tanstack-react-query",
  "trpc-server": "trpc",
  "radix-ui-react-slot": "radix-ui-react-slot",
  "reduxjs-toolkit": "redux",
  "apollo-server": "graphql",
  "better-auth": "lucia",
  "socket.io": "socket.io",
};

export function getLibraryRules(libraries: string[]): RuleSet {
  const merged: RuleSet = {};
  const seen = new Set<string>();
  const keys: (keyof RuleSet)[] = [
    "codingPatterns", "doNot", "testing", "security", "performance",
  ];

  for (const lib of libraries) {
    const ruleKey = aliases[lib] ?? lib;
    if (seen.has(ruleKey)) continue;
    seen.add(ruleKey);
    const rules = libraryRules[ruleKey];
    if (!rules) continue;

    for (const key of keys) {
      const val = rules[key];
      if (!val) continue;
      if (!merged[key]) (merged as any)[key] = [];
      (merged[key] as string[]).push(...val);
    }
  }

  return merged;
}
