from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.models.zone import RiskZone, EvacuationRoute

async def get_risk_zones(db: AsyncSession, city_id: str) -> List[RiskZone]:
    result = await db.execute(select(RiskZone).where(RiskZone.cityId == city_id))
    return result.scalars().all()

async def get_evacuation_routes(db: AsyncSession, city_id: str) -> List[EvacuationRoute]:
    result = await db.execute(select(EvacuationRoute).where(EvacuationRoute.cityId == city_id))
    return result.scalars().all()
