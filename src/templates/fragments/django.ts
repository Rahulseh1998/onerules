import type { RuleSet } from "../../types.js";

export function getDjangoRules(): RuleSet {
  return {
    projectContext: "This is a Django application.",
    codingPatterns: [
      "Use class-based views for standard CRUD. Use function-based views for unique one-off logic. Don't force every view into a class.",
      "Use `select_related()` for FK lookups, `prefetch_related()` for M2M/reverse FK. Every ORM query without these is a potential N+1.",
      "Use Django forms for input validation. Model forms for model-backed forms. Don't validate manually in views.",
      "Use `reverse()` and `{% url %}` for URLs. Never hardcode URL paths as strings.",
      "Use Django's built-in auth. If you need custom fields, extend `AbstractUser` BEFORE the first migration. Not after.",
    ],
    architecture: [
      "One app per domain. Keep apps focused: `users`, `orders`, `payments`. Not `utils`, `common`, `core`.",
      "Business logic goes in model methods or standalone service functions. NOT in views. Views should be thin.",
      "Use migrations for ALL schema changes. `python manage.py makemigrations` then review the generated migration.",
    ],
    security: [
      "Never exempt views from CSRF without a documented security reason. CSRF protection is on by default — leave it on.",
      "Use `get_object_or_404()` to prevent information disclosure about what IDs exist.",
      "Set `DEBUG = False` in production. Use `django-environ` or `os.environ` for secrets.",
    ],
    doNot: [
      "DO NOT create a `services/` directory with one-method classes for each model operation. A function is fine.",
      "DO NOT override `save()` for complex side effects. Side effects in save() fire on every save — use explicit service functions or signals.",
      "DO NOT use `default_scope` or manager methods that filter by default. Implicit filtering causes subtle bugs.",
      "DO NOT create abstract models for every 2-field overlap. `created_at` and `updated_at` can go in a mixin; `name` and `description` cannot.",
      "DO NOT use `objects.all()` in templates. Filter in the view. Templates should not trigger new queries.",
    ],
  };
}
