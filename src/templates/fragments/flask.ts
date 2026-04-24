import type { RuleSet } from "../../types.js";

export function getFlaskRules(): RuleSet {
  return {
    projectContext: "This is a Flask application.",
    codingPatterns: [
      "Use the application factory pattern (`create_app()`). Not a global `app = Flask(__name__)` at module level.",
      "Use Blueprints to organize routes by feature. One Blueprint per domain.",
      "Validate input with Pydantic or marshmallow. Not manual `if not request.json.get('name')` chains.",
      "Use `abort(404)` for HTTP errors. Use `@app.errorhandler` for custom error responses.",
      "Use Flask-SQLAlchemy for database access. Use Alembic (Flask-Migrate) for migrations.",
    ],
    architecture: [
      "Organize by feature: `auth/routes.py`, `auth/models.py`, `auth/schemas.py`. Not by layer.",
      "Config in classes: `Config`, `DevConfig(Config)`, `ProdConfig(Config)`. Load from environment.",
    ],
    doNot: [
      "DO NOT create a global `app` object used everywhere. Use the factory pattern with `current_app` in Blueprints.",
      "DO NOT create abstract service classes for simple database operations. A function that queries SQLAlchemy is a service.",
      "DO NOT use `flask.g` to pass data between unrelated parts of a request. It's for request-scoped resources (db session), not a global state bag.",
    ],
  };
}
