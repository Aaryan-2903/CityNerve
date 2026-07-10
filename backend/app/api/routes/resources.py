from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.resource import ResourceResponse
from app.database.connection import get_db
from app.services import resource_service

router = APIRouter()

@router.get("", response_model=List[ResourceResponse], status_code=status.HTTP_200_OK)
async def get_resources(
    cityId: str = Query(..., description="City ID"),
    db: AsyncSession = Depends(get_db)
) -> List[ResourceResponse]:
    return await resource_service.get_resources(db, cityId)
