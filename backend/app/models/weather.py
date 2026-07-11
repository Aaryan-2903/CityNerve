import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime
from app.database.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class WeatherCache(Base):
    __tablename__ = "weather_cache"

    id = Column(String, primary_key=True, default=generate_uuid)
    city_id = Column(String, unique=True, index=True, nullable=False)
    
    temperature = Column(Float, nullable=False)
    apparent_temperature = Column(Float, nullable=False)
    rainfall = Column(Float, nullable=False)
    precipitation_probability = Column(Integer, nullable=False)
    humidity = Column(Integer, nullable=False)
    wind_speed = Column(Float, nullable=False)
    wind_direction = Column(Float, nullable=False)
    weather_condition = Column(String, nullable=False)
    cloud_cover = Column(Integer, nullable=False)
    
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
