from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.poi import ShelterResponse, HospitalResponse
from app.database.connection import get_db
from app.services import poi_service

router = APIRouter()

@router.get("/shelters", response_model=List[ShelterResponse], status_code=status.HTTP_200_OK)
async def get_shelters(
    cityId: str = Query(..., description="City ID"),
    db: AsyncSession = Depends(get_db)
) -> List[ShelterResponse]:
    return await poi_service.get_shelters(db, cityId)

@router.get("/hospitals", response_model=List[HospitalResponse], status_code=status.HTTP_200_OK)
async def get_hospitals(
    cityId: str = Query(..., description="City ID"),
    db: AsyncSession = Depends(get_db)
) -> List[HospitalResponse]:
    return await poi_service.get_hospitals(db, cityId)
