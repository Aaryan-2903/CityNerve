from fastapi import APIRouter
from app.schemas.response import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def get_health() -> HealthResponse:
    return HealthResponse(status="healthy")
