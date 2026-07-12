from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.schemas.emergency_resource import EmergencyResourceResponse
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
    
    # Default zero structure
    response_data = {
        "ambulance": {"available": 0, "busy": 0, "enRoute": 0},
        "police": {"available": 0, "busy": 0, "enRoute": 0},
        "fire": {"available": 0, "busy": 0, "enRoute": 0},
        "rescue": {"available": 0, "busy": 0, "enRoute": 0}
    }
    
    # Populate with DB data if it exists
    for r in resources:
        if r.resourceType in response_data:
            response_data[r.resourceType] = {
                "available": r.available,
                "busy": r.busy,
                "enRoute": r.deployed
            }
            
    return response_data
