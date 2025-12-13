# app/models/db.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    # Do NOT call create_all in production; use Alembic/Flask-Migrate instead.
