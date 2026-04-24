import type { RuleSet } from "../../types.js";

export function getRailsRules(): RuleSet {
  return {
    projectContext: "This is a Ruby on Rails application.",
    codingPatterns: [
      "Convention over configuration. Follow Rails conventions: RESTful routes, standard directory structure, naming patterns.",
      "Use strong parameters. `params.require(:user).permit(:name, :email)`. Never `params.permit!`.",
      "Use scopes for reusable queries. `scope :active, -> { where(active: true) }`. Keep them chainable.",
      "Use `find_each` for batched iteration over large datasets. Never `.all.each` — it loads everything into memory.",
      "Callbacks are for simple model lifecycle logic only. Complex workflows → service objects.",
    ],
    architecture: [
      "Thin controllers, fat models. But not TOO fat — when a model exceeds 200 lines, extract service objects to `app/services/`.",
      "Use concerns for shared model behavior. But not as a dumping ground — each concern should have a clear, single purpose.",
      "Background jobs (Sidekiq/GoodJob) for anything that takes more than 200ms: emails, API calls, reports.",
    ],
    testing: [
      "Request specs for API testing. System specs for E2E with Capybara. Model specs for business logic.",
      "Use FactoryBot, not fixtures. Factories are explicit and composable.",
      "Use `let` for lazy-evaluated test data. Use `let!` when you need it to exist before the test runs.",
    ],
    doNot: [
      "DO NOT create a ServiceObject base class with `call` method, validation, error handling, and logging. A plain Ruby class with one public method is a service object.",
      "DO NOT use `update_attribute` — it skips validations. Use `update` or `update!`.",
      "DO NOT use `default_scope`. It affects every query including joins and causes bugs that are nearly impossible to debug.",
      "DO NOT rescue `Exception`. Rescue `StandardError` or specific error types.",
      "DO NOT create a `Concerns::Trackable` module for adding `created_at` and `updated_at` — Rails does this automatically.",
    ],
  };
}
