from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.zone import RiskZoneResponse, EvacuationRouteResponse
from app.database.connection import get_db
from app.services import zone_service

router = APIRouter()

@router.get("/risk-zones", response_model=List[RiskZoneResponse], status_code=status.HTTP_200_OK)
async def get_risk_zones(
    cityId: str = Query(..., description="City ID"),
    db: AsyncSession = Depends(get_db)
) -> List[RiskZoneResponse]:
    return await zone_service.get_risk_zones(db, cityId)

@router.get("/evacuation-routes", response_model=List[EvacuationRouteResponse], status_code=status.HTTP_200_OK)
async def get_evacuation_routes(
    cityId: str = Query(..., description="City ID"),
    db: AsyncSession = Depends(get_db)
) -> List[EvacuationRouteResponse]:
    return await zone_service.get_evacuation_routes(db, cityId)
