import type { RuleSet } from "../../types.js";

export function getDjangoRules(): RuleSet {
  return {
    projectContext: "This is a Django application.",
    codingPatterns: [
      "Use class-based views for CRUD operations. Use function-based views for simple or unique logic.",
      "Use Django ORM for all database operations. Use `select_related()` and `prefetch_related()` to avoid N+1 queries.",
      "Use Django forms and model forms for input validation.",
      "Use `reverse()` and `{% url %}` for URL resolution. Never hardcode URLs.",
      "Use Django's built-in authentication system. Extend the User model with `AbstractUser` if needed.",
      "Use signals sparingly. Prefer explicit method calls over implicit signal handlers.",
    ],
    architecture: [
      "One app per domain/feature. Keep apps focused and reusable.",
      "Keep business logic in model methods or service modules, not in views.",
      "Use Django REST Framework for API endpoints.",
      "Use database migrations for all schema changes. Never modify the database manually.",
    ],
    security: [
      "Always use CSRF protection. Never exempt views from CSRF without strong justification.",
      "Use `get_object_or_404()` to prevent information disclosure.",
      "Set `DEBUG = False` in production. Use environment variables for secrets.",
      "Use Django's ORM parameterized queries. Never use raw SQL with string interpolation.",
    ],
    doNot: [
      "Do not put business logic in views. Extract to model methods or service layers.",
      "Do not use `objects.all()` in templates — filter in the view.",
      "Do not override `save()` for side effects — use signals or explicit service methods.",
      "Do not use `ForeignKey(on_delete=CASCADE)` without considering data implications.",
    ],
  };
}
