# app/api/packing_routes.py
from flask import Blueprint, request, jsonify, current_app, send_file
from pydantic import ValidationError

from app.schemas.packing import PackingRequest, PackingResponse, BoxPlacement
from app.services.ga_packing import run_ga_packing
from app.services.report import generate_report_packing
from app.models.packing_result import PackingResult
from app.models.db import db
from app.utils.validators import (
    validate_positive_dimensions,
    validate_items_non_empty,
)

packing_bp = Blueprint("packing", __name__)


@packing_bp.post("/optimize")
def optimize_packing():
    data = request.get_json()
    try:
        req = PackingRequest(**data)
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 400

    container = req.container.dict()
    boxes = [b.dict() for b in req.boxes]

    try:
        validate_positive_dimensions(container)
        validate_items_non_empty(boxes)
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400

    placements, utilization = run_ga_packing(boxes, container)

    result = PackingResult(
        container_length=container["length"],
        container_width=container["width"],
        container_height=container["height"],
        boxes_json=boxes,
        placements_json=placements,
    )
    db.session.add(result)
    db.session.commit()

    report_path = generate_report_packing(
        container,
        placements,
        utilization,
        base_dir=current_app.root_path + "/../reports",
    )
    result.report_path = report_path
    db.session.commit()

    resp = PackingResponse(
        placements=[BoxPlacement(**p) for p in placements],
        utilization=utilization,
        result_id=result.id,
        report_url=f"/api/packing/report/{result.id}",
    )
    return jsonify(resp.dict())
