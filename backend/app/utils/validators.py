# app/utils/validators.py
from typing import Sequence, Mapping

def validate_positive_dimensions(dim: Mapping[str, float]) -> None:
    for key in ("length", "width", "height"):
        value = dim.get(key, 0)
        if value <= 0:
            raise ValueError(f"{key} must be > 0, got {value}")

def validate_items_non_empty(items: Sequence) -> None:
    if not items:
        raise ValueError("At least one item is required")

def validate_max_items(items: Sequence, max_items: int = 500) -> None:
    if len(items) > max_items:
        raise ValueError(f"Too many items, max {max_items}")
