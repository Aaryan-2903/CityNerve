from pydantic import BaseModel
from typing import Dict, Any

class RiskAssessment(BaseModel):
    overall_risk: int
    flood_risk: int
    medical_risk: int
    infrastructure_risk: int
    traffic_risk: int
    power_risk: int
    threat_level: str
    confidence: int

class RiskEngine:
    def __init__(self):
        # Configurable thresholds
        self.heavy_rain_threshold_mm = 40
        self.moderate_rain_threshold_mm = 10
        self.high_wind_threshold_kmh = 50
        self.high_temp_threshold_c = 40
        self.high_humidity_threshold = 90
        
        # Base confidence
        self.base_confidence = 90

    def parse_rainfall(self, rainfall_str: str) -> float:
        try:
            return float(str(rainfall_str).lower().replace(" mm/hr", "").replace(" mm", "").strip())
        except (ValueError, TypeError):
            return 0.0

    def evaluate(self, live_weather: Dict[str, Any], simulation_stage: int, active_incidents: int) -> RiskAssessment:
        # Extract weather parameters
        weather_label = live_weather.get("label", "").lower()
        rainfall_val = self.parse_rainfall(live_weather.get("rainfall", "0"))
        
        # Assume wind/temp/humidity might not be present in baseline, default to safe values
        wind_speed = float(live_weather.get("wind_speed", 0))
        temperature = float(live_weather.get("temperature", 25))
        humidity = float(live_weather.get("humidity", 50))
        
        # Initialize risks
        flood_risk = 10
        medical_risk = 10
        infrastructure_risk = 10
        traffic_risk = 10
        power_risk = 10
        
        # 1. Weather Rules
        if rainfall_val > self.heavy_rain_threshold_mm:
            flood_risk += 60
            traffic_risk += 40
        elif rainfall_val > self.moderate_rain_threshold_mm:
            flood_risk += 20
            traffic_risk += 20
            
        if "storm" in weather_label or "thunder" in weather_label:
            infrastructure_risk += 40
            power_risk += 30
            medical_risk += 20
            
        if wind_speed > self.high_wind_threshold_kmh:
            power_risk += 50
            infrastructure_risk += 30
            
        if temperature > self.high_temp_threshold_c:
            medical_risk += 50
            
        if humidity > self.high_humidity_threshold:
            flood_risk += 15

        # 2. Simulation Stage (increases overall severity)
        stage_multiplier = 1.0 + (simulation_stage * 0.15)
        
        # 3. Active Incidents (increases overall risk)
        incident_penalty = min(30, active_incidents * 3)
        
        # Apply multipliers and caps
        flood_risk = min(100, int(flood_risk * stage_multiplier))
        medical_risk = min(100, int(medical_risk * stage_multiplier))
        infrastructure_risk = min(100, int(infrastructure_risk * stage_multiplier))
        traffic_risk = min(100, int(traffic_risk * stage_multiplier))
        power_risk = min(100, int(power_risk * stage_multiplier))
        
        # Calculate Overall Risk
        base_overall = (flood_risk + medical_risk + infrastructure_risk + traffic_risk + power_risk) / 5
        overall_risk = min(100, int(base_overall + incident_penalty))
        
        # Threat Level
        threat_level = "LOW"
        if overall_risk > 85:
            threat_level = "CRITICAL"
        elif overall_risk > 65:
            threat_level = "HIGH"
        elif overall_risk > 40:
            threat_level = "MODERATE"
            
        # Confidence
        confidence = self.base_confidence
        if simulation_stage > 0:
            confidence += 5 # More real data during simulation
        confidence = min(99, confidence)

        return RiskAssessment(
            overall_risk=overall_risk,
            flood_risk=flood_risk,
            medical_risk=medical_risk,
            infrastructure_risk=infrastructure_risk,
            traffic_risk=traffic_risk,
            power_risk=power_risk,
            threat_level=threat_level,
            confidence=confidence
        )
