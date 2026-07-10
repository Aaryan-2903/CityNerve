import logging
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List

from app.models.city import City
from app.schemas.city import CityResponse, CityCreate

logger = logging.getLogger(__name__)

def map_city(doc: City) -> CityResponse:
    """Helper to map SQLAlchemy model to Pydantic Response"""
    return CityResponse(
        id=doc.id,
        name=doc.name,
        state=doc.state,
        latitude=doc.latitude,
        longitude=doc.longitude,
        population=doc.population,
        riskLevel=doc.riskLevel,
        weatherRegion=doc.weatherRegion,
        isActive=doc.isActive
    )

async def get_all_active_cities(db: AsyncSession) -> List[CityResponse]:
    result = await db.execute(select(City).where(City.isActive == True))
    cities = result.scalars().all()
    return [map_city(c) for c in cities]

async def get_city_by_id(db: AsyncSession, city_id: str) -> CityResponse:
    result = await db.execute(select(City).where(City.id == city_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="City not found")
        
    return map_city(doc)

async def search_cities_by_name(db: AsyncSession, query: str) -> List[CityResponse]:
    result = await db.execute(select(City).where(City.name.ilike(f"%{query}%"), City.isActive == True))
    cities = result.scalars().all()
    return [map_city(c) for c in cities]

async def seed_cities(db: AsyncSession) -> None:
    """Seed the database with initial cities if empty."""
    result = await db.execute(select(func.count(City.id)))
    count = result.scalar_one()
    
    if count > 0:
        logger.info("Cities table already seeded. Skipping.")
        return
        
    logger.info("Seeding initial cities...")
    
    initial_cities = [
        CityCreate(name="Mumbai", state="Maharashtra", latitude=19.0760, longitude=72.8777, population=20961000, riskLevel="HIGH", weatherRegion="Coastal"),
        CityCreate(name="Pune", state="Maharashtra", latitude=18.5204, longitude=73.8567, population=6987000, riskLevel="MEDIUM", weatherRegion="Inland"),
        CityCreate(name="Delhi", state="Delhi", latitude=28.7041, longitude=77.1025, population=32065000, riskLevel="HIGH", weatherRegion="Northern"),
        CityCreate(name="Hyderabad", state="Telangana", latitude=17.3850, longitude=78.4867, population=10534000, riskLevel="MEDIUM", weatherRegion="Deccan"),
        CityCreate(name="Bengaluru", state="Karnataka", latitude=12.9716, longitude=77.5946, population=13193000, riskLevel="LOW", weatherRegion="Southern"),
        CityCreate(name="Chennai", state="Tamil Nadu", latitude=13.0827, longitude=80.2707, population=11503000, riskLevel="HIGH", weatherRegion="Coastal"),
        CityCreate(name="Kolkata", state="West Bengal", latitude=22.5726, longitude=88.3639, population=14974000, riskLevel="HIGH", weatherRegion="Coastal"),
    ]
    
    db_cities = [City(**city.model_dump()) for city in initial_cities]
    db.add_all(db_cities)
    await db.commit()
    logger.info(f"Successfully seeded {len(initial_cities)} cities.")
