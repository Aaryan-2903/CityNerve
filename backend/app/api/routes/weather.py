from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.database.connection import get_db
from app.models.city import City
from app.schemas.weather import WeatherResponse
from app.services.weather_service import fetch_weather_for_city

router = APIRouter()


@router.get("/{city_name}", response_model=WeatherResponse)
async def get_weather_for_city(city_name: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(City).where(City.name.ilike(city_name)))
    city = result.scalars().first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
        
    weather = await fetch_weather_for_city(city, db)
    return weather

@router.get("/all", response_model=List[WeatherResponse])
async def get_weather_for_all_cities(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(City))
    cities = result.scalars().all()
    
    weathers = []
    for city in cities:
        weather = await fetch_weather_for_city(city, db)
        weathers.append(weather)
        
    return weathers
