from pydantic import BaseModel


class WeatherSummary(BaseModel):
    label: str
    emoji: str
    rainfall: str
    forecast: str
    alertText: str
    alertLevel: str  # "warning" | "advisory"


class DashboardResponse(BaseModel):
    cityId: str
    populationAffected: str      # e.g. "12.4k"
    hospitalsNearby: int
    sheltersAvailable: int
    roadsClosed: int
    deployedUnits: int
    activeIncidents: int
    averageResponseTime: str     # e.g. "18m"
    weather: WeatherSummary
    aiStatus: str                # e.g. "Monitoring", "Alert", "Critical"
    riskScore: int               # 0-100
