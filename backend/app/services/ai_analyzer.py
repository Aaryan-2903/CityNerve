import logging
import random
from typing import Dict, Any

logger = logging.getLogger(__name__)

def analyze_citizen_report(data: dict) -> Dict[str, Any]:
    """
    Mock AI analyzer for citizen incident reports.
    In a real system, this would call an LLM or ML model.
    """
    incident_type = data.get("type", "unknown")
    desc = data.get("description", "").lower()
    
    # Generate Title
    title_map = {
        "flood": "Urban Flooding Report",
        "fire": "Structural Fire Reported",
        "road_block": "Major Road Obstruction",
        "medical": "Medical Emergency Request",
        "power_outage": "Local Power Outage",
        "fallen_tree": "Fallen Tree Blocking Path",
        "building_damage": "Structural Damage Reported",
    }
    title = data.get("title")
    if not title:
        title = title_map.get(incident_type, f"Citizen Report: {incident_type.title()}")
    
    # Estimate Severity
    severity = "medium"
    if any(word in desc for word in ["critical", "dying", "huge", "massive", "trapped", "explosion"]):
        severity = "critical"
    elif any(word in desc for word in ["fast", "spreading", "injured", "large"]):
        severity = "high"
    elif any(word in desc for word in ["small", "minor", "safe"]):
        severity = "low"
        
    # Generate recommendation based on type & severity
    recommendation = "Dispatch local units to assess the situation."
    priority = "Medium"
    
    if severity == "critical":
        priority = "Critical"
        recommendation = f"Immediate deployment required for {incident_type}. Dispatch emergency response teams to the exact coordinates."
    elif severity == "high":
        priority = "High"
        recommendation = f"High priority {incident_type}. Alert nearby units and stand by for escalation."
    elif incident_type == "flood":
        recommendation = "Check local drainage and prepare sandbags if water level rises."
    elif incident_type == "fire":
        recommendation = "Dispatch initial fire engine to investigate smoke/fire report."
        
    # Mock confidence score (75% to 98%)
    confidence = random.randint(75, 98)
    
    # AI Risk score (1-100)
    risk_score_map = {"critical": 95, "high": 75, "medium": 45, "low": 20, "resolved": 0}
    ai_risk_score = risk_score_map.get(severity, 50) + random.randint(-5, 5)
    
    # Timeline event
    location = data.get("location", {})
    address = location.get("address", "Unknown location")
    timeline_event_text = f"Citizen reported {title} at {address}."
    
    return {
        "title": title,
        "severity": severity,
        "status": "active",
        "aiRiskScore": max(0, min(100, ai_risk_score)),
        "trending": "up" if severity in ["high", "critical"] else "stable",
        "aiRecommendation": {
            "title": f"AI Triage: {title}",
            "recommendation": recommendation,
            "confidence": confidence,
            "reasoning": [
                f"Citizen description keywords detected",
                f"Incident type matched '{incident_type}' profile"
            ],
            "priority": priority
        },
        "timelineEventText": timeline_event_text
    }
