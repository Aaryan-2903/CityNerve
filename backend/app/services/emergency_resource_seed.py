import logging
import uuid
import random
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.city import City
from app.models.emergency_resource import EmergencyResource

logger = logging.getLogger(__name__)

async def seed_emergency_resources(db: AsyncSession) -> None:
    """Seed emergency resources for all active cities if none exist."""
    
    # Get all cities
    city_result = await db.execute(select(City))
    cities = city_result.scalars().all()
    
    if not cities:
        logger.warning("No cities found. Cannot seed emergency resources.")
        return
        
    resources = []
    
    for city in cities:
        city_id = city.name.lower()
        
        # Check if this city already has resources seeded
        existing = await db.execute(select(func.count(EmergencyResource.id)).where(EmergencyResource.cityId == city_id))
        if existing.scalar_one() > 0:
            continue
            
        # If it's Mumbai, use the exact numbers requested in the previous test
        if city_id == "mumbai":
            resources.extend([
                EmergencyResource(id=str(uuid.uuid4()), cityId=city_id, resourceType="ambulance", available=42, busy=3, enRoute=5),
                EmergencyResource(id=str(uuid.uuid4()), cityId=city_id, resourceType="police", available=80, busy=4, enRoute=8),
                EmergencyResource(id=str(uuid.uuid4()), cityId=city_id, resourceType="fire", available=18, busy=1, enRoute=2),
                EmergencyResource(id=str(uuid.uuid4()), cityId=city_id, resourceType="rescue", available=12, busy=1, enRoute=3),
            ])
        else:
            # Generate realistic data based loosely on population scale
            scale = max(1, min(10, city.population / 2000000)) if city.population else 3
            
            resources.extend([
                EmergencyResource(
                    id=str(uuid.uuid4()), 
                    cityId=city_id, 
                    resourceType="ambulance", 
                    available=int(30 * scale) + random.randint(0, 10), 
                    busy=int(5 * scale), 
                    enRoute=int(4 * scale)
                ),
                EmergencyResource(
                    id=str(uuid.uuid4()), 
                    cityId=city_id, 
                    resourceType="police", 
                    available=int(60 * scale) + random.randint(0, 20), 
                    busy=int(6 * scale), 
                    enRoute=int(8 * scale)
                ),
                EmergencyResource(
                    id=str(uuid.uuid4()), 
                    cityId=city_id, 
                    resourceType="fire", 
                    available=int(12 * scale) + random.randint(0, 5), 
                    busy=int(2 * scale), 
                    enRoute=int(2 * scale)
                ),
                EmergencyResource(
                    id=str(uuid.uuid4()), 
                    cityId=city_id, 
                    resourceType="rescue", 
                    available=int(8 * scale) + random.randint(0, 5), 
                    busy=int(1 * scale), 
                    enRoute=int(2 * scale)
                ),
            ])
            
    db.add_all(resources)
    await db.commit()
    logger.info(f"Successfully seeded {len(resources)} emergency resources across {len(cities)} cities.")
