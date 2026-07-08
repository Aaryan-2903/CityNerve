from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional, Literal


# ── Location ──────────────────────────────────────────────────────────────────
class IncidentLocation(BaseModel):
    lat: float
    lng: float
    address: str
    district: str
    borough: Optional[str] = None


# ── Enums (mirrors types/incident.ts) ────────────────────────────────────────
IncidentSeverity = Literal["critical", "high", "medium", "low", "resolved"]
IncidentStatus   = Literal["active", "contained", "resolved", "escalating"]
IncidentType     = Literal[
    "fire", "flood", "earthquake", "hazmat", "mass_casualty",
    "infrastructure", "storm", "blackout", "tsunami", "civil_unrest",
]
TrendingDir      = Literal["up", "down", "stable"]


# ── Create / Update ───────────────────────────────────────────────────────────
class IncidentCreate(BaseModel):
    cityId: str                          # e.g. "mumbai"
    type: IncidentType
    severity: IncidentSeverity
    status: IncidentStatus
    title: str
    description: str
    location: IncidentLocation
    affectedPopulation: int = 0
    casualties: int = 0
    resourcesDeployed: List[str] = Field(default_factory=list)
    aiRiskScore: int = 0
    trending: TrendingDir = "stable"


class IncidentUpdate(BaseModel):
    type: Optional[IncidentType] = None
    severity: Optional[IncidentSeverity] = None
    status: Optional[IncidentStatus] = None
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[IncidentLocation] = None
    affectedPopulation: Optional[int] = None
    casualties: Optional[int] = None
    resourcesDeployed: Optional[List[str]] = None
    aiRiskScore: Optional[int] = None
    trending: Optional[TrendingDir] = None


# ── Response (what the frontend receives) ────────────────────────────────────
class IncidentResponse(BaseModel):
    id: str
    cityId: str
    type: IncidentType
    severity: IncidentSeverity
    status: IncidentStatus
    title: str
    description: str
    location: IncidentLocation
    timestamp: str
    updatedAt: str
    affectedPopulation: int
    casualties: int
    resourcesDeployed: List[str]
    aiRiskScore: int
    trending: TrendingDir

    model_config = ConfigDict(populate_by_name=True)
