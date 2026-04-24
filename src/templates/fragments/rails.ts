import type { RuleSet } from "../../types.js";

export function getRailsRules(): RuleSet {
  return {
    projectContext: "This is a Ruby on Rails application.",
    codingPatterns: [
      "Follow Rails conventions. Convention over configuration.",
      "Use strong parameters in controllers. Never use `params.permit!`.",
      "Use Active Record callbacks sparingly. Prefer service objects for complex logic.",
      "Use scopes for reusable queries. Keep scopes simple and chainable.",
      "Use `find_each` or `in_batches` for large record sets. Never load all records into memory.",
      "Use `I18n` for all user-facing strings.",
    ],
    architecture: [
      "Keep controllers thin. Extract business logic to service objects or models.",
      "Use concerns for shared model/controller behavior.",
      "Use `app/services/` for complex operations that span multiple models.",
      "Use database migrations for schema changes. Use `change` method for reversible migrations.",
      "Use background jobs (Sidekiq/GoodJob) for long-running operations.",
    ],
    testing: [
      "Use RSpec with FactoryBot for model and request specs.",
      "Write request specs for API endpoints. Write system specs for user-facing features.",
      "Use `let` and `subject` for test setup. Prefer `let!` when eager evaluation is needed.",
    ],
    security: [
      "Use `has_secure_password` for authentication or a gem like Devise.",
      "Use Pundit or CanCanCan for authorization.",
      "Always use parameterized queries. Never interpolate user input into SQL.",
      "Validate file uploads: type, size, and content.",
    ],
    doNot: [
      "Do not use `update_attribute` — it skips validations. Use `update` or `update!`.",
      "Do not put SQL in views or controllers. Use scopes and model methods.",
      "Do not use `default_scope`. It causes subtle bugs. Use explicit scopes.",
      "Do not use `rescue Exception`. Rescue specific error types.",
    ],
  };
}
