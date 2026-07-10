from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from app.models.scenario import WeatherState, Notification

async def get_weather(db: AsyncSession, city_id: str, phase: int) -> Optional[WeatherState]:
    result = await db.execute(
        select(WeatherState).where(WeatherState.cityId == city_id, WeatherState.phase == phase)
    )
    return result.scalar_one_or_none()

async def get_notifications(db: AsyncSession, city_id: str, phase: int) -> List[Notification]:
    result = await db.execute(
        select(Notification).where(Notification.cityId == city_id, Notification.phase == phase)
    )
    return result.scalars().all()
