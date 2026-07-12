import asyncio
import uuid
from app.database.database import engine, Base
from app.models.emergency_resource import EmergencyResource
from app.models.city import City
from app.database.connection import async_session_maker

async def seed():
    # create table
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        # seed data for mumbai
        resources = [
            EmergencyResource(id=str(uuid.uuid4()), cityId="mumbai", resourceType="ambulance", available=42, busy=3, enRoute=5),
            EmergencyResource(id=str(uuid.uuid4()), cityId="mumbai", resourceType="police", available=80, busy=4, enRoute=8),
            EmergencyResource(id=str(uuid.uuid4()), cityId="mumbai", resourceType="fire", available=18, busy=1, enRoute=2),
            EmergencyResource(id=str(uuid.uuid4()), cityId="mumbai", resourceType="rescue", available=12, busy=1, enRoute=3),
        ]
        session.add_all(resources)
        await session.commit()
        print("seeded")

if __name__ == "__main__":
    asyncio.run(seed())
