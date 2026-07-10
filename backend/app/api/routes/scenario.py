from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.schemas.scenario import WeatherStateResponse, NotificationResponse
from app.database.connection import get_db
from app.services import scenario_service

router = APIRouter()

@router.get("/weather", response_model=Optional[WeatherStateResponse], status_code=status.HTTP_200_OK)
async def get_weather(
    cityId: str = Query(..., description="City ID"),
    phase: int = Query(..., description="Simulation Phase (0-6)"),
    db: AsyncSession = Depends(get_db)
) -> Optional[WeatherStateResponse]:
    return await scenario_service.get_weather(db, cityId, phase)

@router.get("/notifications", response_model=List[NotificationResponse], status_code=status.HTTP_200_OK)
async def get_notifications(
    cityId: str = Query(..., description="City ID"),
    phase: int = Query(..., description="Simulation Phase (0-6)"),
    db: AsyncSession = Depends(get_db)
) -> List[NotificationResponse]:
    return await scenario_service.get_notifications(db, cityId, phase)
