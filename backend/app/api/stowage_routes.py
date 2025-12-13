# app/api/stowage_routes.py
from flask import Blueprint, request, jsonify, current_app, send_file
from pydantic import ValidationError

from app.schemas.stowage import (
    StowageRequest,
    StowageResponse,
    CargoPlacement,
)
from app.services.cp_stowage import run_stowage_cp
from app.services.report import generate_report_packing  # reuse report generator
from app.models.stowage_result import StowageResult
from app.models.db import db
from app.utils.validators import (
    validate_positive_dimensions,
    validate_items_non_empty,
)

stowage_bp = Blueprint("stowage", __name__)


@stowage_bp.post("/optimize")
def optimize_stowage():
    """
    POST /api/stowage/optimize

    JSON body:
    {
      "ship": { "length": 100, "width": 30, "height": 20 },
      "cargos": [
        { "id": "C1", "length": 2, "width": 2, "height": 2, "caution": "fragile" },
        ...
      ]
    }
    """
    data = request.get_json()
    try:
        req = StowageRequest(**data)
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 400

    ship = req.ship.dict()
    cargos = [c.dict() for c in req.cargos]

    # Extra validation
    try:
        validate_positive_dimensions(ship)
        validate_items_non_empty(cargos)
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400

    # Call OR-Tools CP stowage solver
    placements, utilization = run_stowage_cp(ship, cargos)

    # Persist to Neon via SQLAlchemy
    result = StowageResult(
        ship_length=ship["length"],
        ship_width=ship["width"],
        ship_height=ship["height"],
        cargos_json=cargos,
        placements_json=placements,
    )
    db.session.add(result)
    db.session.commit()

    # Generate PDF report
    report_path = generate_report_packing(
        ship,
        placements,
        utilization,
        base_dir=current_app.root_path + "/../reports",
    )
    result.report_path = report_path
    db.session.commit()

    # Build response
    resp = StowageResponse(
        placements=[CargoPlacement(**p) for p in placements],
        utilization=utilization,
        result_id=result.id,
        report_url=f"/api/stowage/report/{result.id}",
    )
    return jsonify(resp.dict())


@stowage_bp.get("/report/<int:result_id>")
def get_stowage_report(result_id: int):
    """
    GET /api/stowage/report/<result_id>
    Returns the generated PDF as a file download.
    """
    result = StowageResult.query.get_or_404(result_id)
    return send_file(result.report_path, as_attachment=True)
