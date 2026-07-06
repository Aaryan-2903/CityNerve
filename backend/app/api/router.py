from fastapi import APIRouter
from app.api.routes import root, health, cities

api_router = APIRouter()

api_router.include_router(root.router, tags=["Root"])
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(cities.router, prefix="/api/v1/cities", tags=["Cities"])
