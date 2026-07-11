import httpx
from datetime import datetime, timedelta
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.weather import WeatherCache
from app.models.city import City
from app.schemas.weather import WeatherResponse

async def fetch_weather_for_city(city: City, session: AsyncSession) -> WeatherResponse:
    # Check cache
    result = await session.execute(select(WeatherCache).where(WeatherCache.city_id == city.id))
    cached = result.scalars().first()
    
    # Return cache if less than 10 mins old
    if cached and (datetime.utcnow() - cached.last_updated) < timedelta(minutes=10):
        return build_weather_response(cached)

    # Otherwise fetch from open-meteo
    url = f"https://api.open-meteo.com/v1/forecast?latitude={city.latitude}&longitude={city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            current = data.get("current", {})
            
            # Map metrics
            temp = float(current.get("temperature_2m", 0.0))
            app_temp = float(current.get("apparent_temperature", 0.0))
            rain = float(current.get("rain", 0.0))
            precipitation = float(current.get("precipitation", 0.0)) # often used interchangeably, we'll use rain or precip
            rainfall = max(rain, precipitation)
            humidity = int(current.get("relative_humidity_2m", 0))
            wind_speed = float(current.get("wind_speed_10m", 0.0))
            wind_direction = float(current.get("wind_direction_10m", 0.0))
            wmo_code = int(current.get("weather_code", 0))
            cloud_cover = int(current.get("cloud_cover", 0))
            
            label = map_wmo_code(wmo_code)
            
            if cached:
                cached.temperature = temp
                cached.apparent_temperature = app_temp
                cached.rainfall = rainfall
                cached.precipitation_probability = 0 # Not given in current, mock or 0
                cached.humidity = humidity
                cached.wind_speed = wind_speed
                cached.wind_direction = wind_direction
                cached.weather_condition = label
                cached.cloud_cover = cloud_cover
                cached.last_updated = datetime.utcnow()
            else:
                cached = WeatherCache(
                    city_id=city.id,
                    temperature=temp,
                    apparent_temperature=app_temp,
                    rainfall=rainfall,
                    precipitation_probability=0,
                    humidity=humidity,
                    wind_speed=wind_speed,
                    wind_direction=wind_direction,
                    weather_condition=label,
                    cloud_cover=cloud_cover
                )
                session.add(cached)
                
            await session.commit()
            await session.refresh(cached)
            return build_weather_response(cached)
            
        except Exception as e:
            # Fallback to cache if exists but old, otherwise return mock
            if cached:
                return build_weather_response(cached)
            print(f"Weather fetch failed: {e}")
            return get_mock_weather(city.id)

def map_wmo_code(code: int) -> str:
    if code == 0: return "Clear sky"
    if code in [1, 2, 3]: return "Partly cloudy"
    if code in [45, 48]: return "Fog"
    if code in [51, 53, 55, 56, 57]: return "Drizzle"
    if code in [61, 63, 65, 66, 67]: return "Rain"
    if code in [71, 73, 75, 77]: return "Snow"
    if code in [80, 81, 82]: return "Rain showers"
    if code in [85, 86]: return "Snow showers"
    if code in [95, 96, 99]: return "Thunderstorm"
    return "Unknown"

def get_emoji(condition: str) -> str:
    condition = condition.lower()
    if "clear" in condition: return "☀️"
    if "partly" in condition: return "⛅"
    if "cloudy" in condition: return "☁️"
    if "rain" in condition or "drizzle" in condition: return "🌧️"
    if "thunderstorm" in condition: return "⛈️"
    if "snow" in condition: return "❄️"
    if "fog" in condition: return "🌫️"
    return "🌡️"

def build_weather_response(cache: WeatherCache) -> WeatherResponse:
    emoji = get_emoji(cache.weather_condition)
    
    # Dynamic alert logic
    alert_level = "advisory"
    alert_text = "Conditions normal"
    
    if cache.rainfall > 40 or cache.wind_speed > 60 or "thunderstorm" in cache.weather_condition.lower():
        alert_level = "warning"
        alert_text = "Severe weather conditions"
    elif cache.rainfall > 10 or cache.wind_speed > 30:
        alert_level = "advisory"
        alert_text = "Monitor weather closely"
    elif cache.temperature > 38:
        alert_level = "warning"
        alert_text = "Extreme heat warning"
    else:
        alert_level = "info"
    
    return WeatherResponse(
        id=cache.id,
        city_id=cache.city_id,
        temperature=cache.temperature,
        apparent_temperature=cache.apparent_temperature,
        rainfall=cache.rainfall,
        precipitation_probability=cache.precipitation_probability,
        humidity=cache.humidity,
        wind_speed=cache.wind_speed,
        wind_direction=cache.wind_direction,
        weather_condition=cache.weather_condition,
        cloud_cover=cache.cloud_cover,
        label=cache.weather_condition,
        emoji=emoji,
        alertText=alert_text,
        alertLevel=alert_level,
        last_updated=cache.last_updated
    )

def get_mock_weather(city_id: str) -> WeatherResponse:
    return WeatherResponse(
        id="mock-123",
        city_id=city_id,
        temperature=25.0,
        apparent_temperature=26.0,
        rainfall=0.0,
        precipitation_probability=0,
        humidity=50,
        wind_speed=10.0,
        wind_direction=180.0,
        weather_condition="Clear sky",
        cloud_cover=0,
        label="Clear sky",
        emoji="☀️",
        alertText="Conditions normal",
        alertLevel="info",
        last_updated=datetime.utcnow()
    )
