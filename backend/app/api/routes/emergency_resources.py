from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict

from app.schemas.emergency_resource import EmergencyResourceBase, EmergencyResourceResponse
from app.models.emergency_resource import EmergencyResource
from app.database.connection import get_db

router = APIRouter()

@router.get("", response_model=EmergencyResourceResponse, status_code=status.HTTP_200_OK)
async def get_emergency_resources(
    cityId: str = Query(..., description="City ID"),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(EmergencyResource).where(EmergencyResource.cityId == cityId))
    resources = result.scalars().all()
    
    response_data = {}
    
    for r in resources:
        response_data[r.resourceType] = {
            "available": r.available,
            "busy": r.busy,
            "enRoute": r.enRoute
        }
            
    return response_data
