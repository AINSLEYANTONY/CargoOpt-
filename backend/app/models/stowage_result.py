from .db import db
from datetime import datetime

class StowageResult(db.Model):
    __tablename__ = "stowage_results"

    id = db.Column(db.Integer, primary_key=True)
    ship_length = db.Column(db.Float, nullable=False)
    ship_width = db.Column(db.Float, nullable=False)
    ship_height = db.Column(db.Float, nullable=False)

    cargos_json = db.Column(db.JSON, nullable=False)
    placements_json = db.Column(db.JSON, nullable=False)
    report_path = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
