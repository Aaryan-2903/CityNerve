import uuid
from sqlalchemy import Column, String, Float, ForeignKey
from app.database.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Resource(Base):
    __tablename__ = "resources"
    id = Column(String, primary_key=True, default=generate_uuid)
    cityId = Column(String, ForeignKey("cities.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
