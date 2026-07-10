import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, JSON
from app.database.database import Base

def generate_uuid():
    return str(uuid.uuid4())

def get_utc_now():
    return datetime.now(timezone.utc).isoformat()

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, default=generate_uuid)
    cityId = Column(String, nullable=False, index=True)
    type = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    status = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    location = Column(JSON, nullable=False)
    timestamp = Column(String, default=get_utc_now)
    updatedAt = Column(String, default=get_utc_now, onupdate=get_utc_now)
    affectedPopulation = Column(Integer, default=0)
    casualties = Column(Integer, default=0)
    resourcesDeployed = Column(JSON, default=list)
    aiRiskScore = Column(Integer, default=0)
    trending = Column(String, default="stable")
