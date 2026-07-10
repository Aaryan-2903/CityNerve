import json
import os
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.poi import Shelter, Hospital
from app.models.resource import Resource
from app.models.zone import RiskZone, EvacuationRoute
from app.models.scenario import WeatherState, Notification
from app.models.city import City

logger = logging.getLogger(__name__)

async def seed_scenarios(db: AsyncSession):
    # Check if we already seeded to avoid duplicates
    count = await db.execute(select(func.count(Shelter.id)))
    if count.scalar() > 0:
        logger.info("Scenarios already seeded.")
        return

    scenario_file = os.path.join(os.path.dirname(__file__), "../../../scenario.json")
    if not os.path.exists(scenario_file):
        logger.warning(f"Scenario file not found at {scenario_file}. Skipping seed.")
        return

    with open(scenario_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    for city_key, city_data in data.items():
        # Validate city exists in DB by matching name (e.g. 'mumbai' -> 'Mumbai')
        city_result = await db.execute(select(City).where(City.name.ilike(city_key)))
        city = city_result.scalar_one_or_none()
        if not city:
            logger.warning(f"City {city_key} not found in DB. Skipping scenario data.")
            continue
            
        city_id = city.id

        layers = city_data.get("mapLayers", {})
        
        # Shelters
        for sh in layers.get("shelters", []):
            db.add(Shelter(cityId=city_id, name=sh.get("name"), lat=sh.get("lat"), lng=sh.get("lng")))

        # Hospitals
        for ho in layers.get("hospitals", []):
            db.add(Hospital(cityId=city_id, name=ho.get("name"), lat=ho.get("lat"), lng=ho.get("lng")))

        # Resources
        for res in layers.get("rescue", []):
            db.add(Resource(cityId=city_id, name=res.get("name"), lat=res.get("lat"), lng=res.get("lng")))

        # Zones
        flood_zone = layers.get("floodZone")
        if flood_zone:
            db.add(RiskZone(cityId=city_id, type="floodZone", geometry=flood_zone))
            
        sim_flood = layers.get("simFlood")
        if sim_flood:
            db.add(RiskZone(cityId=city_id, type="simFlood", geometry=sim_flood))

        # Evacuation Routes
        evac_route = layers.get("evacRoute")
        if evac_route:
            db.add(EvacuationRoute(cityId=city_id, geometry=evac_route))

        # Weather
        weather_dict = city_data.get("weather", {})
        for phase, w in weather_dict.items():
            db.add(WeatherState(
                cityId=city_id,
                phase=int(phase),
                label=w.get("label"),
                emoji=w.get("emoji"),
                rainfall=w.get("rainfall"),
                forecast=w.get("forecast"),
                alertText=w.get("alertText"),
                alertLevel=w.get("alertLevel")
            ))

        # Feed Entries
        feed_dict = city_data.get("feedEntries", {})
        for phase, entries in feed_dict.items():
            for e in entries:
                db.add(Notification(
                    cityId=city_id,
                    phase=int(phase),
                    time=e.get("time"),
                    text=e.get("text"),
                    dotColor=e.get("dotColor"),
                    category=e.get("category")
                ))

    await db.commit()
    logger.info("Successfully seeded scenarios from scenario.json")
