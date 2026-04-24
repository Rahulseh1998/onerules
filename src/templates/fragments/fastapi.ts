import type { RuleSet } from "../../types.js";

export function getFastapiRules(): RuleSet {
  return {
    projectContext: "This is a FastAPI application.",
    codingPatterns: [
      "Pydantic models for all request and response schemas. Never return raw dicts from endpoints — type the response.",
      "Use `Depends()` for shared logic (auth, db session, current user). Don't repeat yourself across endpoints.",
      "Use `async def` for endpoints that do I/O (database, HTTP calls). Use plain `def` for CPU-only work.",
      "Path parameters for resource identifiers (`/users/{id}`). Query parameters for filtering/sorting/pagination.",
      "Group routes with `APIRouter`. One router per feature domain. Register with `app.include_router()`.",
      "Use `HTTPException` for expected errors (404, 403). Use custom exception handlers for domain errors.",
    ],
    architecture: [
      "Keep endpoints thin. Endpoint validates input → calls service → returns response. No business logic in route handlers.",
      "Organize by feature: `users/router.py`, `users/schemas.py`, `users/service.py`. Not by layer: `routers/`, `schemas/`, `services/`.",
      "Use Alembic for database migrations. Never modify schema manually or with raw SQL in app code.",
    ],
    security: [
      "Never use `allow_origins=['*']` in CORS middleware in production. Whitelist specific origins.",
      "Use OAuth2 with proper scopes, or API key auth via Depends(). Never roll your own auth token logic.",
    ],
    doNot: [
      "DO NOT create an AbstractBaseService, BaseRepository, GenericCRUDMixin stack for a simple CRUD app. A function that calls the ORM is fine.",
      "DO NOT create a separate repository layer wrapping SQLAlchemy for 'testability'. SQLAlchemy's Session is already your unit of work.",
      "DO NOT return ORM models directly from endpoints. Use Pydantic response_model to control serialization.",
      "DO NOT use global database connections. Use `Depends(get_db)` to inject sessions per request.",
      "DO NOT create an `exceptions.py` with 15 custom exception classes. Use HTTPException with status codes.",
    ],
  };
}
