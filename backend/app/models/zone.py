import uuid
from sqlalchemy import Column, String, JSON, ForeignKey
from app.database.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class RiskZone(Base):
    __tablename__ = "risk_zones"
    id = Column(String, primary_key=True, default=generate_uuid)
    cityId = Column(String, ForeignKey("cities.id"), nullable=False, index=True)
    type = Column(String, nullable=False)
    geometry = Column(JSON, nullable=False)

class EvacuationRoute(Base):
    __tablename__ = "evacuation_routes"
    id = Column(String, primary_key=True, default=generate_uuid)
    cityId = Column(String, ForeignKey("cities.id"), nullable=False, index=True)
    geometry = Column(JSON, nullable=False)
