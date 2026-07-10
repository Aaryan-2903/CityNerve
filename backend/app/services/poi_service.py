from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.models.poi import Shelter, Hospital

async def get_shelters(db: AsyncSession, city_id: str) -> List[Shelter]:
    result = await db.execute(select(Shelter).where(Shelter.cityId == city_id))
    return result.scalars().all()

async def get_hospitals(db: AsyncSession, city_id: str) -> List[Hospital]:
    result = await db.execute(select(Hospital).where(Hospital.cityId == city_id))
    return result.scalars().all()
