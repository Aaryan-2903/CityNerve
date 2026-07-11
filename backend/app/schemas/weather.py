from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class WeatherResponse(BaseModel):
    id: str
    city_id: str
    
    # Raw metrics
    temperature: float
    apparent_temperature: float
    rainfall: float
    precipitation_probability: int
    humidity: int
    wind_speed: float
    wind_direction: float
    weather_condition: str
    cloud_cover: int
    
    # Frontend derived values mapped from metrics
    label: str
    emoji: str
    alertText: str
    alertLevel: str
    
    last_updated: datetime

    class Config:
        orm_mode = True
        from_attributes = True
