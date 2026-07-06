from fastapi import Request
from motor.motor_asyncio import AsyncIOMotorDatabase

def get_database(request: Request) -> AsyncIOMotorDatabase:
    """
    Dependency to retrieve the database instance from the app state.
    This avoids global mutable state by fetching it from the incoming request.
    """
    return request.app.state.database
