import uuid
from sqlalchemy import Column, String, Float, Integer, Boolean
from app.database.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class City(Base):
    __tablename__ = "cities"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False, unique=True, index=True)
    state = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    population = Column(Integer, nullable=False)
    riskLevel = Column(String, nullable=False)
    weatherRegion = Column(String, nullable=False)
    isActive = Column(Boolean, default=True)
