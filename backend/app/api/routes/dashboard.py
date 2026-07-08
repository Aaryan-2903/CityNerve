from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.schemas.dashboard import DashboardResponse
from app.database.connection import get_database
from app.services import dashboard_service

router = APIRouter()


@router.get(
    "/{city_name}",
    response_model=DashboardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get dashboard metrics for a city",
    description=(
        "Returns baseline (phase-0) dashboard metrics for the specified city. "
        "city_name is matched case-insensitively against the city name stored in MongoDB. "
        "Returns 404 if the city is not seeded or inactive."
    ),
)
async def get_dashboard(
    city_name: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> DashboardResponse:
    return await dashboard_service.get_dashboard_for_city(db, city_name)
