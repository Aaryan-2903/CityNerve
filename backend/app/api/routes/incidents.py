from typing import List

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.incident import IncidentCreate, IncidentUpdate, IncidentResponse, CitizenIncidentCreate
from app.database.connection import get_db
from app.services import incident_service

router = APIRouter()


@router.get(
    "",
    response_model=List[IncidentResponse],
    status_code=status.HTTP_200_OK,
    summary="List incidents for a city",
)
async def list_incidents(
    cityId: str = Query(..., description="City ID, e.g. 'mumbai'"),
    db: AsyncSession = Depends(get_db),
) -> List[IncidentResponse]:
    """Return all incidents for the specified city, sorted by AI risk score descending."""
    return await incident_service.get_incidents_by_city(db, cityId)


@router.get(
    "/{incident_id}",
    response_model=IncidentResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a single incident",
)
async def get_incident(
    incident_id: str,
    db: AsyncSession = Depends(get_db),
) -> IncidentResponse:
    return await incident_service.get_incident_by_id(db, incident_id)


@router.post(
    "",
    response_model=IncidentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new incident",
)
async def create_incident(
    data: IncidentCreate,
    db: AsyncSession = Depends(get_db),
) -> IncidentResponse:
    return await incident_service.create_incident(db, data)


@router.post(
    "/citizen",
    status_code=status.HTTP_201_CREATED,
    summary="Create a new incident from citizen report",
)
async def create_citizen_incident(
    data: CitizenIncidentCreate,
    db: AsyncSession = Depends(get_db),
):
    return await incident_service.process_citizen_report(db, data)


@router.patch(
    "/{incident_id}",
    response_model=IncidentResponse,
    status_code=status.HTTP_200_OK,
    summary="Partially update an incident",
)
async def update_incident(
    incident_id: str,
    data: IncidentUpdate,
    db: AsyncSession = Depends(get_db),
) -> IncidentResponse:
    return await incident_service.update_incident(db, incident_id, data)
