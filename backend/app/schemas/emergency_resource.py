from pydantic import BaseModel
from typing import Dict
from datetime import datetime

class EmergencyResourceBase(BaseModel):
    available: int
    busy: int
    enRoute: int

class EmergencyResourceResponse(BaseModel):
    ambulance: EmergencyResourceBase
    police: EmergencyResourceBase
    fire: EmergencyResourceBase
    rescue: EmergencyResourceBase

    class Config:
        from_attributes = True
