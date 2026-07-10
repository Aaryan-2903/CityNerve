import uuid
from sqlalchemy import Column, String, Integer, ForeignKey
from app.database.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class WeatherState(Base):
    __tablename__ = "weather_states"
    id = Column(String, primary_key=True, default=generate_uuid)
    cityId = Column(String, ForeignKey("cities.id"), nullable=False, index=True)
    phase = Column(Integer, nullable=False)
    label = Column(String, nullable=False)
    emoji = Column(String, nullable=False)
    rainfall = Column(String, nullable=False)
    forecast = Column(String, nullable=False)
    alertText = Column(String, nullable=False)
    alertLevel = Column(String, nullable=False)

class Notification(Base):
    __tablename__ = "notifications"
    # We allow manual IDs to sync with frontend if needed
    id = Column(String, primary_key=True, default=generate_uuid)
    cityId = Column(String, ForeignKey("cities.id"), nullable=False, index=True)
    phase = Column(Integer, nullable=False)
    time = Column(String, nullable=False)
    text = Column(String, nullable=False)
    dotColor = Column(String, nullable=False)
    category = Column(String, nullable=False)
