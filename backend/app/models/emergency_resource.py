import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from app.database.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class EmergencyResource(Base):
    __tablename__ = "emergency_resources"
    id = Column(String, primary_key=True, default=generate_uuid)
    cityId = Column(String, ForeignKey("cities.id"), nullable=False, index=True)
    resourceType = Column(String, nullable=False) # 'ambulance', 'police', 'fire', 'rescue'
    available = Column(Integer, default=0)
    enRoute = Column(Integer, default=0)
    busy = Column(Integer, default=0)
    maintenance = Column(Integer, default=0)
    updatedAt = Column(DateTime, default=datetime.utcnow)
