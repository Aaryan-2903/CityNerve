from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

class CityBase(BaseModel):
    name: str
    state: str
    latitude: float
    longitude: float
    population: int
    riskLevel: str
    weatherRegion: str
    isActive: bool = True

class CityCreate(CityBase):
    pass

class CityResponse(CityBase):
    id: str
    
    model_config = ConfigDict(populate_by_name=True)
