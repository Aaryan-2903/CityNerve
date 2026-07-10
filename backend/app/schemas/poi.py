from pydantic import BaseModel

class ShelterResponse(BaseModel):
    id: str
    cityId: str
    name: str
    lat: float
    lng: float

    class Config:
        from_attributes = True

class HospitalResponse(BaseModel):
    id: str
    cityId: str
    name: str
    lat: float
    lng: float

    class Config:
        from_attributes = True
