"""
Dashboard service — compute per-city metrics from the city document.

Metric formulas mirror the logic that was previously baked into the frontend
`useDashboardData.ts` hook so values are consistent across client and server.
All computations are deterministic (no simulation phase offset) because the
backend serves the *baseline* (phase=0) state; the frontend simulation layer
adds its own delta on top when a simulation is running.
"""

import logging

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.city import City
from app.schemas.dashboard import DashboardResponse, WeatherSummary
from app.services.ai_commander import ai_commander_service

logger = logging.getLogger(__name__)

# ── City-specific variance index (same order as the frontend) ────────────────
_VARIANCE: dict[str, int] = {
    "mumbai": 0, "pune": 1, "bengaluru": 2, "delhi": 3,
    "chennai": 4, "hyderabad": 5, "kolkata": 6,
}

# ── Baseline population affected (phase=0, same as frontend basePops) ────────
_BASE_POPS: dict[str, int] = {
    "mumbai": 12400, "pune": 8300, "bengaluru": 15200, "delhi": 22100,
    "chennai": 9400, "hyderabad": 11200, "kolkata": 13500,
}

# ── Baseline weather per city (phase=0 slice from cityScenarios.ts) ──────────
_BASE_WEATHER: dict[str, dict] = {
    "mumbai":    {"label": "Overcast",  "emoji": "🌥️", "rainfall": "36 mm/hr",  "forecast": "Rain likely tonight",     "alertText": "Dense Fog Advisory — Harbour areas",          "alertLevel": "advisory"},
    "pune":      {"label": "Overcast",  "emoji": "🌥️", "rainfall": "25 mm/hr",  "forecast": "Rain likely tonight",     "alertText": "Advisory — River areas",                      "alertLevel": "advisory"},
    "bengaluru": {"label": "Partly Cloudy", "emoji": "⛅", "rainfall": "18 mm/hr", "forecast": "Showers later tonight", "alertText": "Flash Flood Watch — Low-lying areas",         "alertLevel": "advisory"},
    "delhi":     {"label": "Haze",      "emoji": "🌫️", "rainfall": "5 mm/hr",   "forecast": "Clearing by morning",    "alertText": "Air Quality Advisory — PM2.5 elevated",       "alertLevel": "advisory"},
    "chennai":   {"label": "Overcast",  "emoji": "🌥️", "rainfall": "41 mm/hr",  "forecast": "Coastal rain bands",     "alertText": "Cyclone Watch — Bay of Bengal",               "alertLevel": "warning"},
    "hyderabad": {"label": "Partly Cloudy", "emoji": "⛅", "rainfall": "12 mm/hr", "forecast": "Scattered showers",    "alertText": "Advisory — Low-lying areas near Hussain Sagar", "alertLevel": "advisory"},
    "kolkata":   {"label": "Overcast",  "emoji": "🌥️", "rainfall": "55 mm/hr",  "forecast": "Heavy rain likely",      "alertText": "Flood Watch — Hooghly river basin",            "alertLevel": "warning"},
}

# ── AI status per city (contextual to cityScenarios themes) ─────────────────
_AI_STATUS: dict[str, str] = {
    "mumbai":    "Flood Alert",
    "pune":      "River Watch",
    "bengaluru": "Flood Watch",
    "delhi":     "Haze Advisory",
    "chennai":   "Cyclone Alert",
    "hyderabad": "Monitoring",
    "kolkata":   "Flood Alert",
}

# ── Risk scores aligned with city riskLevel (HIGH → 75-95, MEDIUM → 45-65, LOW → 20-40) ──
_RISK_SCORE: dict[str, int] = {
    "mumbai":    88,
    "pune":      62,
    "bengaluru": 38,
    "delhi":     81,
    "chennai":   91,
    "hyderabad": 55,
    "kolkata":   84,
}

_DEFAULT_WEATHER = {
    "label": "Overcast", "emoji": "🌥️", "rainfall": "20 mm/hr",
    "forecast": "Rain possible", "alertText": "Advisory — Monitor local conditions",
    "alertLevel": "advisory",
}


def _city_key(name: str) -> str:
    """Normalise a city name to the lowercase key used in variance maps."""
    return name.lower().replace(" ", "")


def _compute_metrics(city_doc: City) -> DashboardResponse:
    raw_name = city_doc.name
    city_key = _city_key(raw_name)
    city_id  = city_key  # matches frontend CityProfile.id convention

    v       = _VARIANCE.get(city_key, 0)
    base_pop = _BASE_POPS.get(city_key, 12400)

    pop_formatted = f"{(base_pop / 1000):.1f}k"

    # Incident / unit counts — deterministic formula matching the frontend (phase=0)
    base_incidents = 3 + v            # mirrors scenario.mapLayers.incidents.length + v
    hospitals      = 2 + 3 + v        # 2 base + 3 max capacity bonus (phase=0) + v
    shelters       = 2 + (v % 3)      # 2 base shelters + v
    roads_closed   = base_incidents + 1 + v
    deployed_units = 2 + v            # phase=0 → sim?.resources?.deployed=2 + v
    avg_response   = max(4, 24 - v)   # phase=0 baseline

    weather_raw = _BASE_WEATHER.get(city_key, _DEFAULT_WEATHER)
    weather = WeatherSummary(**weather_raw)

    risk_score, ai_status = ai_commander_service.evaluate_situation(
        live_weather=weather_raw,
        simulation_stage=0,
        active_incidents=base_incidents
    )

    return DashboardResponse(
        cityId=city_id,
        populationAffected=pop_formatted,
        hospitalsNearby=hospitals,
        sheltersAvailable=shelters,
        roadsClosed=roads_closed,
        deployedUnits=deployed_units,
        activeIncidents=base_incidents,
        averageResponseTime=f"{avg_response}m",
        weather=weather,
        aiStatus=ai_status,
        riskScore=risk_score,
    )


async def get_dashboard_for_city(
    db: AsyncSession, city_name: str
) -> DashboardResponse:
    """
    Fetch the city document by name (case-insensitive) and compute dashboard metrics.
    Raises HTTP 404 if the city is not found.
    """
    result = await db.execute(
        select(City).where(City.name.ilike(city_name), City.isActive == True)
    )
    doc = result.scalar_one_or_none()

    if not doc:
        logger.warning("Dashboard requested for unknown city: %s", city_name)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"City '{city_name}' not found or inactive.",
        )

    return _compute_metrics(doc)
