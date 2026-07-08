import logging
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure

from app.core.config import settings

logger = logging.getLogger(__name__)

async def connect_to_mongo(app: FastAPI) -> None:
    """Initialize MongoDB connection and attach it to the application state."""
    logger.info("Connecting to MongoDB...")
    try:
        # Create the async Motor client
        client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=5000, # 5 second timeout for fast failure
        )
        
        # Verify the connection by pinging the server
        await client.admin.command("ping")
        
        # Attach the client and database to the app state
        app.state.mongodb_client = client
        app.state.database = client[settings.DATABASE_NAME]
        
        print("[OK] Connected to MongoDB")
        logger.info("[OK] Connected to MongoDB")
    except ConnectionFailure as e:
        print("[FAIL] MongoDB connection failed")
        logger.error(f"[FAIL] MongoDB connection failed: {e}")
        # Depending on requirements, we could raise the error to prevent startup
        # But we'll handle it gracefully as requested
        app.state.mongodb_client = None
        app.state.database = None

async def close_mongo_connection(app: FastAPI) -> None:
    """Close the MongoDB connection gracefully."""
    logger.info("Closing MongoDB connection...")
    client = getattr(app.state, "mongodb_client", None)
    if client:
        client.close()
        logger.info("MongoDB connection closed.")
