import asyncio
from app.main import lifespan, app

async def test():
    async with lifespan(app):
        print('LIFESPAN OK')

asyncio.run(test())
