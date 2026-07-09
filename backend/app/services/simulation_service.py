import asyncio
from typing import List, Optional
from datetime import datetime
from app.schemas.simulation import (
    SimulationState, SimWeather, SimIncident, SimFeedEntry, SimResources
)

STAGE_LABELS = {
    0: 'Initial State',
    1: 'Heavy Rain',
    2: 'Citizen Reports',
    3: 'Flood Warning',
    4: 'Road Closure',
    5: 'Shelter Activated',
    6: 'Rescue Deployment',
    7: 'Recovery',
    8: 'Completed',
}

class SimulationEngine:
    def __init__(self):
        self.current_stage_index = 0
        self.status = "idle"
        self.progress = 0.0
        self.selected_city = "mumbai"
        self._task = None
        self.max_stages = 8 # 0 to 8
        self.stage_duration = 10 # 10 ticks per stage

    def _get_threat_level(self, stage: int) -> str:
        if stage <= 2: return "LOW"
        if stage <= 6: return "HIGH"
        return "MODERATE"

    def _get_confidence(self, stage: int) -> int:
        conf = [68, 73, 79, 88, 92, 94, 96, 90, 88]
        return conf[stage]

    def _get_weather(self, stage: int) -> SimWeather:
        # Simplified logic for backend seeded data
        if stage == 0:
            return SimWeather(label="Clear", emoji="☀️", rainfall="0mm/h", forecast="Clear skies", alertText="No Alerts", alertLevel="advisory")
        elif stage <= 2:
            return SimWeather(label="Heavy Rain", emoji="🌧️", rainfall="45mm/h", forecast="Continuing", alertText="Heavy Rainfall Warning", alertLevel="warning")
        elif stage <= 6:
            return SimWeather(label="Severe Storm", emoji="⛈️", rainfall="65mm/h", forecast="Peak intensity", alertText="Flash Flood Warning", alertLevel="warning")
        else:
            return SimWeather(label="Light Rain", emoji="🌦️", rainfall="5mm/h", forecast="Clearing", alertText="Downgraded Alert", alertLevel="advisory")

    def _get_resources(self, stage: int) -> SimResources:
        res = [
            (2, 14, 18), (3, 13, 22), (4, 12, 28), (5, 11, 34),
            (6, 10, 40), (8, 8, 55), (10, 6, 70), (7, 9, 50), (4, 12, 30)
        ]
        return SimResources(deployed=res[stage][0], available=res[stage][1], personnel=res[stage][2])

    def _get_incidents(self, stage: int) -> List[SimIncident]:
        incidents = []
        if stage >= 2:
            incidents.append(SimIncident(id="inc-1", title="Waterlogging reported", severity="MEDIUM", time="10:15 AM", team="Pending", status="Reported", impact="Traffic slowing", location="Kurla Station"))
        if stage >= 4:
            incidents.append(SimIncident(id="inc-2", title="Major Road Flooded", severity="HIGH", time="10:30 AM", team="Team Alpha", status="Responding", impact="Road blocked", location="Andheri Subway"))
        if stage >= 6:
            incidents.append(SimIncident(id="inc-3", title="Evacuation required", severity="CRITICAL", time="10:45 AM", team="Rescue Squad", status="Dispatched", impact="50 homes affected", location="Dharavi"))
        return incidents

    def _get_feed(self, stage: int) -> List[SimFeedEntry]:
        feed = []
        now_str = datetime.now().strftime("%H:%M:%S")
        if stage >= 1: feed.append(SimFeedEntry(id="f1", time=now_str, text="Heavy rainfall started.", dotColor="#3B82F6", category="report"))
        if stage >= 2: feed.append(SimFeedEntry(id="f2", time=now_str, text="Citizen reports of waterlogging at Kurla.", dotColor="#EAB308", category="report"))
        if stage >= 3: feed.append(SimFeedEntry(id="f3", time=now_str, text="AI predicts high flood risk.", dotColor="#F97316", category="advisory"))
        if stage >= 4: feed.append(SimFeedEntry(id="f4", time=now_str, text="Andheri subway closed.", dotColor="#EF4444", category="advisory"))
        if stage >= 5: feed.append(SimFeedEntry(id="f5", time=now_str, text="BKC Shelter activated.", dotColor="#22C55E", category="shelter"))
        if stage >= 6: feed.append(SimFeedEntry(id="f6", time=now_str, text="Rescue squads deployed to Dharavi.", dotColor="#3B82F6", category="dispatch"))
        if stage >= 7: feed.append(SimFeedEntry(id="f7", time=now_str, text="Water receding. Recovery phase initiated.", dotColor="#A855F7", category="report"))
        if stage >= 8: feed.append(SimFeedEntry(id="f8", time=now_str, text="Simulation completed.", dotColor="#22C55E", category="report"))
        return list(reversed(feed))

    def get_state(self) -> SimulationState:
        return SimulationState(
            currentStage=STAGE_LABELS.get(self.current_stage_index, "Unknown"),
            currentStageIndex=self.current_stage_index,
            status=self.status,
            progress=self.progress,
            selectedCity=self.selected_city,
            weather=self._get_weather(self.current_stage_index),
            incidents=self._get_incidents(self.current_stage_index),
            resources=self._get_resources(self.current_stage_index),
            shelters=[],
            roads=[],
            feedEntries=self._get_feed(self.current_stage_index),
            aiSummary="AI analysis actively monitoring situation." if self.current_stage_index > 0 else "System standing by.",
            threatLevel=self._get_threat_level(self.current_stage_index),
            confidence=self._get_confidence(self.current_stage_index),
            showFloodOverlay=self.current_stage_index >= 4,
            showActionPlan=self.current_stage_index >= 5,
            showPrediction=self.current_stage_index >= 3
        )

    async def _run_loop(self):
        while self.status == "running":
            await asyncio.sleep(1)
            # Advance progress.
            # Total stages = 9 (0 to 8). Each stage takes 'stage_duration' seconds.
            total_duration = self.max_stages * self.stage_duration
            
            # Convert current stage to elapsed time
            elapsed = (self.current_stage_index * self.stage_duration) + (self.progress * total_duration)
            elapsed += 1
            
            if elapsed >= total_duration:
                self.current_stage_index = self.max_stages
                self.progress = 1.0
                self.status = "complete"
                break
                
            self.current_stage_index = int(elapsed // self.stage_duration)
            self.progress = elapsed / total_duration

    def start(self):
        if self.status != "running":
            self.status = "running"
            if self.current_stage_index >= self.max_stages:
                self.reset()
                self.status = "running"
            if self._task is None or self._task.done():
                self._task = asyncio.create_task(self._run_loop())

    def pause(self):
        self.status = "paused"
        if self._task:
            self._task.cancel()
            self._task = None

    def reset(self):
        self.pause()
        self.current_stage_index = 0
        self.progress = 0.0
        self.status = "idle"

    def next_stage(self):
        if self.current_stage_index < self.max_stages:
            self.current_stage_index += 1
            self.progress = (self.current_stage_index * self.stage_duration) / (self.max_stages * self.stage_duration)
        if self.current_stage_index >= self.max_stages:
            self.status = "complete"

    def previous_stage(self):
        if self.current_stage_index > 0:
            self.current_stage_index -= 1
            self.progress = (self.current_stage_index * self.stage_duration) / (self.max_stages * self.stage_duration)
        if self.status == "complete":
            self.status = "paused"

simulation_engine = SimulationEngine()
