import uuid
from sqlalchemy import Column, String, Float, ForeignKey
from app.database.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Shelter(Base):
    __tablename__ = "shelters"
    id = Column(String, primary_key=True, default=generate_uuid)
    cityId = Column(String, ForeignKey("cities.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)

class Hospital(Base):
    __tablename__ = "hospitals"
    id = Column(String, primary_key=True, default=generate_uuid)
    cityId = Column(String, ForeignKey("cities.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
