# app/__init__.py
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate

from .config import get_settings
from .models.db import db, init_db
from .api.packing_routes import packing_bp
from .api.stowage_routes import stowage_bp

migrate = Migrate()  # Flask-Migrate


def create_app():
    app = Flask(__name__)
    CORS(app)

    settings = get_settings()
    app.config["SQLALCHEMY_DATABASE_URI"] = settings.database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    init_db(app)

    # dev-only: create tables once so packing_results/stowage_results exist
    with app.app_context():
        db.create_all()

    migrate.init_app(app, db)

    app.register_blueprint(packing_bp, url_prefix="/api/packing")
    app.register_blueprint(stowage_bp, url_prefix="/api/stowage")

    return app
