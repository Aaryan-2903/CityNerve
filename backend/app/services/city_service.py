import logging
from bson import ObjectId
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List

from app.models.city import CITY_COLLECTION
from app.schemas.city import CityResponse, CityCreate

logger = logging.getLogger(__name__)

def map_city(doc: dict) -> CityResponse:
    """Helper to map MongoDB document to Pydantic Response"""
    return CityResponse(
        id=str(doc["_id"]),
        name=doc["name"],
        state=doc["state"],
        latitude=doc["latitude"],
        longitude=doc["longitude"],
        population=doc["population"],
        riskLevel=doc["riskLevel"],
        weatherRegion=doc["weatherRegion"],
        isActive=doc.get("isActive", True)
    )

async def get_all_active_cities(db: AsyncIOMotorDatabase) -> List[CityResponse]:
    cursor = db[CITY_COLLECTION].find({"isActive": True})
    cities = await cursor.to_list(length=100)
    return [map_city(c) for c in cities]

async def get_city_by_id(db: AsyncIOMotorDatabase, city_id: str) -> CityResponse:
    if not ObjectId.is_valid(city_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid city ID format")
    
    doc = await db[CITY_COLLECTION].find_one({"_id": ObjectId(city_id)})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="City not found")
        
    return map_city(doc)

async def search_cities_by_name(db: AsyncIOMotorDatabase, query: str) -> List[CityResponse]:
    cursor = db[CITY_COLLECTION].find({
        "name": {"$regex": query, "$options": "i"},
        "isActive": True
    })
    cities = await cursor.to_list(length=100)
    return [map_city(c) for c in cities]

async def seed_cities(db: AsyncIOMotorDatabase) -> None:
    """Seed the database with initial cities if empty."""
    count = await db[CITY_COLLECTION].count_documents({})
    if count > 0:
        logger.info("Cities collection already seeded. Skipping.")
        return
        
    logger.info("Seeding initial cities...")
    
    initial_cities = [
        CityCreate(name="Mumbai", state="Maharashtra", latitude=19.0760, longitude=72.8777, population=20961000, riskLevel="HIGH", weatherRegion="Coastal").model_dump(),
        CityCreate(name="Pune", state="Maharashtra", latitude=18.5204, longitude=73.8567, population=6987000, riskLevel="MEDIUM", weatherRegion="Inland").model_dump(),
        CityCreate(name="Delhi", state="Delhi", latitude=28.7041, longitude=77.1025, population=32065000, riskLevel="HIGH", weatherRegion="Northern").model_dump(),
        CityCreate(name="Hyderabad", state="Telangana", latitude=17.3850, longitude=78.4867, population=10534000, riskLevel="MEDIUM", weatherRegion="Deccan").model_dump(),
        CityCreate(name="Bengaluru", state="Karnataka", latitude=12.9716, longitude=77.5946, population=13193000, riskLevel="LOW", weatherRegion="Southern").model_dump(),
        CityCreate(name="Chennai", state="Tamil Nadu", latitude=13.0827, longitude=80.2707, population=11503000, riskLevel="HIGH", weatherRegion="Coastal").model_dump(),
        CityCreate(name="Kolkata", state="West Bengal", latitude=22.5726, longitude=88.3639, population=14974000, riskLevel="HIGH", weatherRegion="Coastal").model_dump(),
    ]
    
    await db[CITY_COLLECTION].insert_many(initial_cities)
    logger.info(f"Successfully seeded {len(initial_cities)} cities.")
