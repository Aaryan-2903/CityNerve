from pydantic import BaseModel
from typing import List, Optional

class SimWeather(BaseModel):
    label: str
    emoji: str
    rainfall: str
    forecast: str
    alertText: str
    alertLevel: str

class SimIncident(BaseModel):
    id: str
    title: str
    severity: str
    time: str
    team: str
    status: str
    impact: str
    location: str
    isNew: Optional[bool] = False

class SimFeedEntry(BaseModel):
    id: str
    time: str
    text: str
    dotColor: str
    category: str

class SimResources(BaseModel):
    deployed: int
    available: int
    personnel: int

class SimulationState(BaseModel):
    currentStage: str
    currentStageIndex: int
    status: str
    progress: float
    selectedCity: str
    weather: SimWeather
    incidents: List[SimIncident]
    resources: SimResources
    shelters: List[dict]
    roads: List[dict]
    feedEntries: List[SimFeedEntry]
    aiSummary: str
    threatLevel: str
    confidence: int
    showFloodOverlay: bool
    showActionPlan: bool
    showPrediction: bool
