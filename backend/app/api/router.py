from fastapi import APIRouter
from app.api.routes import root, health, cities, dashboard, incidents, simulation, poi, resources, zones, scenario, weather, emergency_resources

api_router = APIRouter()

api_router.include_router(root.router, tags=["Root"])
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(cities.router, prefix="/api/v1/cities", tags=["Cities"])
api_router.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
api_router.include_router(incidents.router, prefix="/api/v1/incidents", tags=["Incidents"])
api_router.include_router(simulation.router, prefix="/api/v1/simulation", tags=["Simulation"])
api_router.include_router(poi.router, prefix="/api/v1/poi", tags=["Poi"])
api_router.include_router(resources.router, prefix="/api/v1/poi-resources", tags=["Resources"])
api_router.include_router(zones.router, prefix="/api/v1/zones", tags=["Zones"])
api_router.include_router(scenario.router, prefix="/api/v1/scenario", tags=["Scenario"])
api_router.include_router(weather.router, prefix="/api/v1/weather", tags=["Weather"])
api_router.include_router(emergency_resources.router, prefix="/api/v1/resources", tags=["Emergency Resources"])
