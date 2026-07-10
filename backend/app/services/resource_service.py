from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.models.resource import Resource

async def get_resources(db: AsyncSession, city_id: str) -> List[Resource]:
    result = await db.execute(select(Resource).where(Resource.cityId == city_id))
    return result.scalars().all()
