from typing import Dict, Any, Tuple
from app.intelligence.risk_engine import RiskEngine

class AICommanderService:
    def __init__(self, risk_engine: RiskEngine = None):
        # Dependency Injection / Composition
        self.risk_engine = risk_engine or RiskEngine()
        
    def evaluate_situation(self, live_weather: Dict[str, Any], simulation_stage: int, active_incidents: int) -> Tuple[int, str]:
        """
        Evaluate the current situation using the central Risk Engine.
        Returns:
            Tuple containing (risk_score, ai_status_string)
        """
        assessment = self.risk_engine.evaluate(
            live_weather=live_weather,
            simulation_stage=simulation_stage,
            active_incidents=active_incidents
        )
        
        # Map Threat Level back to an actionable string for the UI or dashboard
        threat_mapping = {
            "CRITICAL": "Emergency Alert",
            "HIGH": "Flood/Storm Warning",
            "MODERATE": "Advisory/Watch",
            "LOW": "Monitoring"
        }
        
        ai_status = threat_mapping.get(assessment.threat_level, "Monitoring")
        
        # Override with specific high-risk rules for status naming if desired
        if assessment.flood_risk > 80:
            ai_status = "Critical Flood Alert"
        elif assessment.power_risk > 80:
            ai_status = "Power Grid Emergency"
            
        return assessment.overall_risk, ai_status

# Singleton instance for easy import if needed
ai_commander_service = AICommanderService()
