from pydantic import BaseModel

class ResourceResponse(BaseModel):
    id: str
    cityId: str
    name: str
    lat: float
    lng: float

    class Config:
        from_attributes = True
