from pydantic import BaseModel, Field
from typing import List, Literal

CautionType = Literal["decomposable", "fragile", "waste", "edible", "none"]

class BoxInput(BaseModel):
    id: str
    length: float
    width: float
    height: float
    caution: CautionType

class ContainerInput(BaseModel):
    length: float
    width: float
    height: float

class PackingRequest(BaseModel):
    container: ContainerInput
    boxes: List[BoxInput]

class BoxPlacement(BaseModel):
    id: str
    x: float
    y: float
    z: float
    length: float
    width: float
    height: float
    caution: CautionType

class PackingResponse(BaseModel):
    placements: List[BoxPlacement]
    utilization: float
    result_id: int
    report_url: str
