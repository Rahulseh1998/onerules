import type { RuleSet } from "../../types.js";

export function getFlaskRules(): RuleSet {
  return {
    projectContext: "This is a Flask application.",
    codingPatterns: [
      "Use Blueprints to organize routes by feature/domain.",
      "Use Flask's application factory pattern (`create_app()`) for configuration and testing.",
      "Use `request.get_json()` for JSON body parsing. Validate with Pydantic or marshmallow.",
      "Use `abort()` with HTTP status codes for error responses.",
      "Use `flask.g` for request-scoped data. Use `flask.session` for user sessions.",
    ],
    architecture: [
      "Organize by feature: each Blueprint gets its own directory with routes, models, and schemas.",
      "Use SQLAlchemy with Flask-SQLAlchemy for database operations.",
      "Use Alembic (via Flask-Migrate) for database migrations.",
      "Use a configuration class hierarchy (Config, DevConfig, ProdConfig) for environment-specific settings.",
    ],
    doNot: [
      "Do not use the global `app` object directly. Use the application factory pattern.",
      "Do not put business logic in route handlers. Extract to service functions.",
      "Do not use `flask.g` for data that should persist across requests — use sessions or database.",
    ],
  };
}
