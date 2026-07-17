from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.router import api_router
from app.database.database import engine, Base, async_session_maker
from app.services.city_service import seed_cities
from app.services.incident_service import seed_incidents
from app.services.scenario_seed_service import seed_scenarios
from app.services.emergency_resource_seed import seed_emergency_resources
from app.models.weather import WeatherCache

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup event
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    # Seed data
    async with async_session_maker() as session:
        await seed_cities(session)
        await seed_incidents(session)
        await seed_scenarios(session)
        await seed_emergency_resources(session)
        
    yield
    
    # Shutdown event
    await engine.dispose()

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="API for CityNerve Emergency Operations Center",
        lifespan=lifespan,
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API router
    app.include_router(api_router)

    return app

app = create_app()
