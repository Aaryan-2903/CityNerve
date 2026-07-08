from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.router import api_router
from app.database.mongodb import connect_to_mongo, close_mongo_connection
from app.services.city_service import seed_cities
from app.services.incident_service import seed_incidents

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup event
    await connect_to_mongo(app)
    if app.state.database is not None:
        await seed_cities(app.state.database)
        await seed_incidents(app.state.database)
    yield
    # Shutdown event
    await close_mongo_connection(app)

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
        allow_origins=["*"], # In production, replace with specific origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API router
    app.include_router(api_router)

    return app

app = create_app()
