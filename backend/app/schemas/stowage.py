# app/schemas/stowage.py
from pydantic import BaseModel
from typing import List, Literal

CautionType = Literal["decomposable", "fragile", "waste", "edible", "none"]

class CargoInput(BaseModel):
    id: str
    length: float
    width: float
    height: float
    caution: CautionType

class ShipInput(BaseModel):
    length: float
    width: float
    height: float

class StowageRequest(BaseModel):
    ship: ShipInput
    cargos: List[CargoInput]

class CargoPlacement(BaseModel):
    id: str
    x: float
    y: float
    z: float
    length: float
    width: float
    height: float
    caution: CautionType

class StowageResponse(BaseModel):
    placements: List[CargoPlacement]
    utilization: float
    result_id: int
    report_url: str
