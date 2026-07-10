from pydantic import BaseModel

class WeatherStateResponse(BaseModel):
    id: str
    cityId: str
    phase: int
    label: str
    emoji: str
    rainfall: str
    forecast: str
    alertText: str
    alertLevel: str

    class Config:
        from_attributes = True

class NotificationResponse(BaseModel):
    id: str
    cityId: str
    phase: int
    time: str
    text: str
    dotColor: str
    category: str

    class Config:
        from_attributes = True
