from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.city import CityResponse
from app.database.connection import get_db
from app.services import city_service

router = APIRouter()

@router.get("", response_model=List[CityResponse], status_code=status.HTTP_200_OK)
async def get_cities(db: AsyncSession = Depends(get_db)) -> List[CityResponse]:
    """Get all active cities"""
    return await city_service.get_all_active_cities(db)

@router.get("/search", response_model=List[CityResponse], status_code=status.HTTP_200_OK)
async def search_cities(
    q: str = Query(..., min_length=1, description="Search query for city name"),
    db: AsyncSession = Depends(get_db)
) -> List[CityResponse]:
    """Search for active cities by name"""
    return await city_service.search_cities_by_name(db, query=q)

@router.get("/{city_id}", response_model=CityResponse, status_code=status.HTTP_200_OK)
async def get_city(city_id: str, db: AsyncSession = Depends(get_db)) -> CityResponse:
    """Get a specific city by ID"""
    return await city_service.get_city_by_id(db, city_id)
