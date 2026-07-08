"""
Seed module — thin wrapper over the city_service seeding logic.
Called at application startup via main.py lifespan.
"""
from app.services.city_service import seed_cities  # noqa: F401 — re-export
