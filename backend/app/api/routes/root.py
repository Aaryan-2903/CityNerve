from fastapi import APIRouter
from app.schemas.response import RootResponse
from app.core.config import settings

router = APIRouter()

@router.get("/", response_model=RootResponse)
async def get_root() -> RootResponse:
    return RootResponse(
        name=settings.PROJECT_NAME,
        version=settings.VERSION,
        status="running"
    )
