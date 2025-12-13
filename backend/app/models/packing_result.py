from .db import db
from datetime import datetime

class PackingResult(db.Model):
    __tablename__ = "packing_results"

    id = db.Column(db.Integer, primary_key=True)
    container_length = db.Column(db.Float, nullable=False)
    container_width = db.Column(db.Float, nullable=False)
    container_height = db.Column(db.Float, nullable=False)

    boxes_json = db.Column(db.JSON, nullable=False)
    placements_json = db.Column(db.JSON, nullable=False)
    report_path = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
