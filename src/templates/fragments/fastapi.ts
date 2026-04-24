import type { RuleSet } from "../../types.js";

export function getFastapiRules(): RuleSet {
  return {
    projectContext: "This is a FastAPI application.",
    codingPatterns: [
      "Use Pydantic models for all request/response schemas.",
      "Use dependency injection (`Depends()`) for shared logic (auth, database sessions).",
      "Use `async def` for endpoints that do I/O. Use `def` only for CPU-bound sync operations.",
      "Use `HTTPException` for error responses. Define custom exception handlers for domain errors.",
      "Use path parameters for resource identifiers, query parameters for filtering/pagination.",
      "Group routes with `APIRouter`. One router per domain/feature.",
    ],
    architecture: [
      "Separate concerns: routes (endpoints), schemas (Pydantic), models (ORM), services (business logic).",
      "Use `app/` or `src/` as the source root. Group by feature, not by layer.",
      "Use Alembic for database migrations. Never modify the database schema manually.",
    ],
    security: [
      "Use `OAuth2PasswordBearer` or API key dependencies for authentication.",
      "Always validate and sanitize path/query parameters via Pydantic.",
      "Use CORS middleware with explicit allowed origins. Never use `allow_origins=['*']` in production.",
    ],
    doNot: [
      "Do not use global database connections. Use dependency injection with session factories.",
      "Do not put business logic in route handlers. Extract to service functions.",
      "Do not return raw database models from endpoints. Use response schemas.",
    ],
  };
}
