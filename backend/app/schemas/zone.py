from typing import Any, Dict
from pydantic import BaseModel

class RiskZoneResponse(BaseModel):
    id: str
    cityId: str
    type: str
    geometry: Dict[str, Any]

    class Config:
        from_attributes = True

class EvacuationRouteResponse(BaseModel):
    id: str
    cityId: str
    geometry: Dict[str, Any]

    class Config:
        from_attributes = True
