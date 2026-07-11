"""
Incident service — CRUD operations + city-specific seeding.

Seed data deliberately mirrors the themes from cityScenarios.ts so that the
IncidentFeed panel shows contextually relevant incidents when a city is selected.
"""

import logging
from datetime import datetime, timedelta, timezone
from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from app.models.incident import Incident
from app.schemas.incident import IncidentCreate, IncidentUpdate, IncidentResponse, CitizenIncidentCreate
from app.services.ai_analyzer import analyze_citizen_report

logger = logging.getLogger(__name__)


# ── Mapping helpers ───────────────────────────────────────────────────────────

def _now() -> str:
    return datetime.now(timezone.utc).isoformat()

def _ago(minutes: int) -> str:
    return (datetime.now(timezone.utc) - timedelta(minutes=minutes)).isoformat()

def map_incident(doc: Incident) -> IncidentResponse:
    return IncidentResponse.model_validate(doc)


# ── CRUD ──────────────────────────────────────────────────────────────────────

from sqlalchemy.exc import OperationalError

async def get_incidents_by_city(
    db: AsyncSession, city_id: str
) -> List[IncidentResponse]:
    try:
        result = await db.execute(select(Incident).where(Incident.cityId == city_id).order_by(desc(Incident.aiRiskScore)).limit(50))
        docs = result.scalars().all()
        return [map_incident(d) for d in docs]
    except OperationalError as e:
        logger.warning(f"Database operational error (likely schema mismatch or missing table): {e}")
        return []


async def get_incident_by_id(
    db: AsyncSession, incident_id: str
) -> IncidentResponse:
    result = await db.execute(select(Incident).where(Incident.id == incident_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return map_incident(doc)


async def create_incident(
    db: AsyncSession, data: IncidentCreate
) -> IncidentResponse:
    now = _now()
    payload = data.model_dump()
    payload["timestamp"] = now
    payload["updatedAt"] = now
    
    new_incident = Incident(**payload)
    db.add(new_incident)
    await db.commit()
    await db.refresh(new_incident)
    return map_incident(new_incident)

async def process_citizen_report(
    db: AsyncSession, data: CitizenIncidentCreate
) -> dict:
    # 1. Run AI analysis
    ai_data = analyze_citizen_report(data.model_dump())
    
    # 2. Build standard IncidentCreate payload
    incident_create = IncidentCreate(
        cityId=data.cityId,
        type=data.type,
        severity=ai_data["severity"],
        status=ai_data["status"],
        title=ai_data["title"],
        description=data.description,
        location=data.location,
        aiRiskScore=ai_data["aiRiskScore"],
        trending=ai_data["trending"],
        reporterName=data.reporterName,
        imagePath=data.imagePath
    )
    
    # 3. Create incident
    incident = await create_incident(db, incident_create)
    
    # 4. Return incident with AI metadata appended for frontend consumption
    return {
        "incident": incident.model_dump(),
        "aiRecommendation": ai_data["aiRecommendation"],
        "timelineEventText": ai_data["timelineEventText"]
    }


async def update_incident(
    db: AsyncSession, incident_id: str, data: IncidentUpdate
) -> IncidentResponse:
    updates = {k: v for k, v in data.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    updates["updatedAt"] = _now()
    
    result = await db.execute(select(Incident).where(Incident.id == incident_id))
    incident = result.scalar_one_or_none()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    for key, value in updates.items():
        setattr(incident, key, value)
        
    await db.commit()
    await db.refresh(incident)
    return map_incident(incident)


# ── Seed data (city-specific, 5 per city) ────────────────────────────────────

_SEED: List[dict] = [
    # ── Mumbai ────────────────────────────────────────────────────────────────
    dict(cityId="mumbai", type="fire", severity="critical", status="active",
         title="Building Fire — BKC Commercial Tower",
         description="Five-alarm fire spreading across three commercial buildings. Structural collapse imminent. Multiple civilians trapped.",
         location=dict(lat=19.0760, lng=72.8777, address="Plot C-56, BKC, Mumbai, MH", district="Bandra Kurla Complex", borough="Bandra"),
         affectedPopulation=4200, casualties=12,
         resourcesDeployed=["RES-001", "RES-002", "RES-007"],
         aiRiskScore=94, trending="up"),

    dict(cityId="mumbai", type="flood", severity="high", status="escalating",
         title="Coastal Surge Flooding — Kurla Station",
         description="Storm surge causing rapid inundation. Water levels rising 50mm/hr. Evacuation order issued.",
         location=dict(lat=19.0760, lng=72.8777, address="Kurla Station, Mumbai, MH", district="Kurla", borough="East Mumbai"),
         affectedPopulation=18500, casualties=0,
         resourcesDeployed=["RES-003", "RES-009"],
         aiRiskScore=78, trending="up"),

    dict(cityId="mumbai", type="hazmat", severity="critical", status="contained",
         title="Chemical Tanker Rupture — Dharavi Terminal",
         description="Rail tanker carrying chlorine gas ruptured. 500m exclusion zone established.",
         location=dict(lat=19.0373, lng=72.8703, address="Dharavi Container Terminal, MH", district="Dharavi", borough="Central Mumbai"),
         affectedPopulation=6800, casualties=3,
         resourcesDeployed=["RES-005", "RES-008"],
         aiRiskScore=88, trending="down"),

    dict(cityId="mumbai", type="infrastructure", severity="high", status="active",
         title="Bandra-Worli Sea Link — Structural Failure",
         description="Critical structural failure on north span. Emergency closure. Weight-bearing capacity compromised.",
         location=dict(lat=19.1206, lng=72.9292, address="Bandra-Worli Sea Link, Mumbai, MH", district="Bandra", borough="West Mumbai"),
         affectedPopulation=85000, casualties=1,
         resourcesDeployed=["RES-006", "RES-010"],
         aiRiskScore=72, trending="stable"),

    dict(cityId="mumbai", type="mass_casualty", severity="critical", status="active",
         title="CSMT Concourse Partial Collapse",
         description="Partial ceiling collapse in lower concourse during peak hours. 200+ individuals evacuated. Rescue ongoing.",
         location=dict(lat=19.1159, lng=72.9065, address="CSMT, SV Road, Mumbai, MH", district="Fort", borough="South Mumbai"),
         affectedPopulation=12000, casualties=34,
         resourcesDeployed=["RES-002", "RES-004", "RES-012"],
         aiRiskScore=97, trending="up"),

    # ── Pune ──────────────────────────────────────────────────────────────────
    dict(cityId="pune", type="flood", severity="critical", status="escalating",
         title="Mula-Mutha River Overflow — Shivajinagar",
         description="Extreme rainfall causing Mula-Mutha to breach banks. Residential zones submerging rapidly.",
         location=dict(lat=18.5204, lng=73.8567, address="Shivajinagar, Pune, MH", district="Shivajinagar", borough="Central Pune"),
         affectedPopulation=22000, casualties=5,
         resourcesDeployed=["RES-P01", "RES-P02"],
         aiRiskScore=91, trending="up"),

    dict(cityId="pune", type="fire", severity="high", status="active",
         title="Warehouse Fire — Hadapsar Industrial Zone",
         description="Industrial warehouse fire spreading to adjacent units. Chemical storage at risk.",
         location=dict(lat=18.5018, lng=73.9232, address="MIDC Hadapsar, Pune, MH", district="Hadapsar", borough="East Pune"),
         affectedPopulation=2500, casualties=2,
         resourcesDeployed=["RES-P03"],
         aiRiskScore=74, trending="stable"),

    dict(cityId="pune", type="infrastructure", severity="high", status="active",
         title="Sinhagad Road Bridge — Structural Warning",
         description="Cracks detected on primary load-bearing piers. Engineers on site. Partial closure in effect.",
         location=dict(lat=18.4671, lng=73.8067, address="Sinhagad Road Bridge, Pune, MH", district="Sinhagad Road", borough="West Pune"),
         affectedPopulation=50000, casualties=0,
         resourcesDeployed=["RES-P04"],
         aiRiskScore=65, trending="stable"),

    dict(cityId="pune", type="hazmat", severity="medium", status="contained",
         title="Chemical Spill — Pimpri Industrial Area",
         description="Solvent spill at chemical plant. 200m cordon established. Neutralisation team deployed.",
         location=dict(lat=18.6239, lng=73.7998, address="Pimpri-Chinchwad MIDC, Pune, MH", district="Pimpri", borough="North Pune"),
         affectedPopulation=3200, casualties=1,
         resourcesDeployed=["RES-P05", "RES-P06"],
         aiRiskScore=58, trending="down"),

    dict(cityId="pune", type="blackout", severity="medium", status="active",
         title="Grid Failure — Kothrud Feeder Station",
         description="Feeder station trip causing outage for 30,000 homes. Hospitals on backup power.",
         location=dict(lat=18.5074, lng=73.8077, address="Kothrud, Pune, MH", district="Kothrud", borough="West Pune"),
         affectedPopulation=30000, casualties=0,
         resourcesDeployed=["RES-P07"],
         aiRiskScore=45, trending="down"),

    # ── Delhi ─────────────────────────────────────────────────────────────────
    dict(cityId="delhi", type="fire", severity="critical", status="active",
         title="Apartment Complex Fire — Karol Bagh",
         description="Multi-floor fire in 12-storey residential block. Multiple residents trapped. Ladder units deployed.",
         location=dict(lat=28.6519, lng=77.1910, address="Karol Bagh, New Delhi", district="Karol Bagh", borough="Central Delhi"),
         affectedPopulation=5500, casualties=8,
         resourcesDeployed=["RES-D01", "RES-D02"],
         aiRiskScore=92, trending="up"),

    dict(cityId="delhi", type="storm", severity="high", status="active",
         title="Dust Storm — Outer Ring Road",
         description="Severe dust storm reducing visibility to under 50m. Multiple pile-ups reported. Highway closed.",
         location=dict(lat=28.7041, lng=77.1025, address="Outer Ring Road, Delhi", district="Outer Ring Road", borough="West Delhi"),
         affectedPopulation=120000, casualties=3,
         resourcesDeployed=["RES-D03", "RES-D04"],
         aiRiskScore=76, trending="stable"),

    dict(cityId="delhi", type="civil_unrest", severity="high", status="contained",
         title="Large Protest — Connaught Place",
         description="Demonstration of 10,000+ escalated. Delhi Police riot units deployed. Metro services suspended.",
         location=dict(lat=28.6328, lng=77.2197, address="Connaught Place, New Delhi", district="Connaught Place", borough="Central Delhi"),
         affectedPopulation=15000, casualties=4,
         resourcesDeployed=["RES-D05"],
         aiRiskScore=62, trending="down"),

    dict(cityId="delhi", type="blackout", severity="medium", status="active",
         title="Grid Failure — South Delhi Substation",
         description="Transformer failure causing widespread outage. 60,000 homes affected. BSES crews dispatched.",
         location=dict(lat=28.5562, lng=77.1000, address="Mehrauli, South Delhi", district="Mehrauli", borough="South Delhi"),
         affectedPopulation=60000, casualties=0,
         resourcesDeployed=["RES-D06"],
         aiRiskScore=50, trending="down"),

    dict(cityId="delhi", type="hazmat", severity="critical", status="escalating",
         title="Gas Leak — Okhla Industrial Zone",
         description="Ammonia leak at refrigeration plant. Shelter-in-place issued for 1km radius. 800m exclusion zone.",
         location=dict(lat=28.5355, lng=77.2710, address="Okhla Phase II, New Delhi", district="Okhla", borough="South East Delhi"),
         affectedPopulation=8000, casualties=6,
         resourcesDeployed=["RES-D07", "RES-D08"],
         aiRiskScore=89, trending="up"),

    # ── Bengaluru ─────────────────────────────────────────────────────────────
    dict(cityId="bengaluru", type="flood", severity="critical", status="escalating",
         title="Bellandur Lake Overflow — Sarjapur Road",
         description="Bellandur lake breaching. Low-lying tech corridors and residential zones inundated.",
         location=dict(lat=12.9352, lng=77.6820, address="Sarjapur Road, Bengaluru, KA", district="Sarjapur", borough="East Bengaluru"),
         affectedPopulation=25000, casualties=2,
         resourcesDeployed=["RES-B01", "RES-B02"],
         aiRiskScore=93, trending="up"),

    dict(cityId="bengaluru", type="fire", severity="high", status="active",
         title="Tech Park Fire — Whitefield",
         description="Fire in server room of large IT campus. Data center evacuation underway. Suppression systems failed.",
         location=dict(lat=12.9698, lng=77.7499, address="Whitefield, Bengaluru, KA", district="Whitefield", borough="East Bengaluru"),
         affectedPopulation=3000, casualties=1,
         resourcesDeployed=["RES-B03"],
         aiRiskScore=70, trending="stable"),

    dict(cityId="bengaluru", type="infrastructure", severity="high", status="active",
         title="Flyover Closure — Silk Board Junction",
         description="Hairline cracks detected on structural beams. Emergency inspection called. Major traffic impact.",
         location=dict(lat=12.9176, lng=77.6237, address="Silk Board, Bengaluru, KA", district="Silk Board", borough="South Bengaluru"),
         affectedPopulation=200000, casualties=0,
         resourcesDeployed=["RES-B04"],
         aiRiskScore=68, trending="stable"),

    dict(cityId="bengaluru", type="blackout", severity="medium", status="active",
         title="Power Outage — HSR Layout",
         description="Feeder trip affecting HSR Layout and Koramangala. 50,000 homes without power.",
         location=dict(lat=12.9116, lng=77.6474, address="HSR Layout, Bengaluru, KA", district="HSR Layout", borough="South Bengaluru"),
         affectedPopulation=50000, casualties=0,
         resourcesDeployed=["RES-B05"],
         aiRiskScore=44, trending="down"),

    dict(cityId="bengaluru", type="mass_casualty", severity="critical", status="active",
         title="Metro Construction Collapse — Central Corridor",
         description="Scaffolding collapse at metro construction site. 12 workers trapped under debris. NDRF deployed.",
         location=dict(lat=12.9716, lng=77.5946, address="MG Road Station Site, Bengaluru, KA", district="MG Road", borough="Central Bengaluru"),
         affectedPopulation=500, casualties=12,
         resourcesDeployed=["RES-B06", "RES-B07"],
         aiRiskScore=96, trending="up"),

    # ── Chennai ───────────────────────────────────────────────────────────────
    dict(cityId="chennai", type="storm", severity="critical", status="escalating",
         title="Cyclone Surge — Marina Beach",
         description="Cyclone system making landfall. 4m storm surge expected. Coastal evacuation mandatory.",
         location=dict(lat=13.0827, lng=80.2707, address="Marina Beach, Chennai, TN", district="Marina", borough="Central Chennai"),
         affectedPopulation=150000, casualties=7,
         resourcesDeployed=["RES-C01", "RES-C02", "RES-C03"],
         aiRiskScore=98, trending="up"),

    dict(cityId="chennai", type="flood", severity="high", status="active",
         title="Adyar River Flooding — Kotturpuram",
         description="Adyar breaching banks following 300mm rainfall. Low-lying areas rapidly inundating.",
         location=dict(lat=13.0100, lng=80.2425, address="Kotturpuram, Chennai, TN", district="Kotturpuram", borough="South Chennai"),
         affectedPopulation=32000, casualties=2,
         resourcesDeployed=["RES-C04"],
         aiRiskScore=80, trending="up"),

    dict(cityId="chennai", type="fire", severity="high", status="active",
         title="Warehouse Fire — Manali Port Area",
         description="Chemical warehouse fire near Ennore port. Toxic smoke advisory for 2km radius.",
         location=dict(lat=13.1688, lng=80.2600, address="Manali, Chennai, TN", district="Manali", borough="North Chennai"),
         affectedPopulation=8000, casualties=3,
         resourcesDeployed=["RES-C05", "RES-C06"],
         aiRiskScore=77, trending="stable"),

    dict(cityId="chennai", type="infrastructure", severity="medium", status="active",
         title="Anna Salai Road Sinkhole",
         description="Major sinkhole opened on Anna Salai near Nandanam. Three-lane closure. Traffic diverted.",
         location=dict(lat=13.0441, lng=80.2206, address="Anna Salai, Chennai, TN", district="Nandanam", borough="Central Chennai"),
         affectedPopulation=40000, casualties=0,
         resourcesDeployed=["RES-C07"],
         aiRiskScore=52, trending="stable"),

    dict(cityId="chennai", type="blackout", severity="medium", status="contained",
         title="Grid Outage — South Chennai Substation",
         description="Transformer failure. 35,000 homes affected. Tangedco crews working on restoration.",
         location=dict(lat=12.9941, lng=80.2254, address="Adyar, Chennai, TN", district="Adyar", borough="South Chennai"),
         affectedPopulation=35000, casualties=0,
         resourcesDeployed=["RES-C08"],
         aiRiskScore=41, trending="down"),

    # ── Hyderabad ─────────────────────────────────────────────────────────────
    dict(cityId="hyderabad", type="flood", severity="critical", status="escalating",
         title="Hussain Sagar Lake Overflow — Tank Bund",
         description="Lake level reaching critical threshold. Tank Bund under threat. Downstream evacuation ordered.",
         location=dict(lat=17.4239, lng=78.4738, address="Tank Bund Road, Hyderabad, TS", district="Tank Bund", borough="Central Hyderabad"),
         affectedPopulation=40000, casualties=4,
         resourcesDeployed=["RES-H01", "RES-H02"],
         aiRiskScore=90, trending="up"),

    dict(cityId="hyderabad", type="fire", severity="high", status="active",
         title="Mall Fire — Jubilee Hills",
         description="Fire on third floor of shopping mall. Evacuation ongoing. 800 shoppers being directed out.",
         location=dict(lat=17.4326, lng=78.4071, address="Jubilee Hills, Hyderabad, TS", district="Jubilee Hills", borough="West Hyderabad"),
         affectedPopulation=800, casualties=2,
         resourcesDeployed=["RES-H03"],
         aiRiskScore=72, trending="stable"),

    dict(cityId="hyderabad", type="hazmat", severity="high", status="contained",
         title="LPG Tanker Leak — Shamshabad Highway",
         description="LPG tanker valve failure on National Highway. 500m exclusion. HPCL safety team on site.",
         location=dict(lat=17.2403, lng=78.4294, address="NH44, Shamshabad, Hyderabad, TS", district="Shamshabad", borough="South Hyderabad"),
         affectedPopulation=5000, casualties=1,
         resourcesDeployed=["RES-H04", "RES-H05"],
         aiRiskScore=67, trending="down"),

    dict(cityId="hyderabad", type="infrastructure", severity="medium", status="active",
         title="Road Sinkhole — Kukatpally Housing Board",
         description="Large sinkhole on KPHB main road. Sewer line collapse suspected. Diversion in place.",
         location=dict(lat=17.4947, lng=78.3996, address="KPHB Colony, Hyderabad, TS", district="Kukatpally", borough="North Hyderabad"),
         affectedPopulation=25000, casualties=0,
         resourcesDeployed=["RES-H06"],
         aiRiskScore=49, trending="stable"),

    dict(cityId="hyderabad", type="blackout", severity="medium", status="active",
         title="Power Outage — HITEC City Zone",
         description="Substation fault causing outage in HITEC City and Madhapur. 70+ tech companies on backup.",
         location=dict(lat=17.4435, lng=78.3772, address="HITEC City, Hyderabad, TS", district="HITEC City", borough="West Hyderabad"),
         affectedPopulation=80000, casualties=0,
         resourcesDeployed=["RES-H07"],
         aiRiskScore=43, trending="down"),

    # ── Kolkata ───────────────────────────────────────────────────────────────
    dict(cityId="kolkata", type="flood", severity="critical", status="active",
         title="Hooghly River Breach — Howrah",
         description="River embankment breach in Howrah. Low-lying residential areas inundated rapidly.",
         location=dict(lat=22.5958, lng=88.2636, address="Howrah, West Bengal", district="Howrah", borough="Howrah"),
         affectedPopulation=55000, casualties=8,
         resourcesDeployed=["RES-K01", "RES-K02", "RES-K03"],
         aiRiskScore=95, trending="up"),

    dict(cityId="kolkata", type="fire", severity="high", status="active",
         title="Slum Fire — Dharmatala",
         description="Dense-settlement fire spreading rapidly. 300+ shanties at risk. Evacuation underway.",
         location=dict(lat=22.5583, lng=88.3481, address="Dharmatala, Kolkata, WB", district="Dharmatala", borough="Central Kolkata"),
         affectedPopulation=4000, casualties=5,
         resourcesDeployed=["RES-K04", "RES-K05"],
         aiRiskScore=82, trending="up"),

    dict(cityId="kolkata", type="infrastructure", severity="high", status="active",
         title="Howrah Bridge — Structural Alert",
         description="Vibration sensors flagged anomaly on southern pylon. Inspection team deployed. One lane closed.",
         location=dict(lat=22.5851, lng=88.3468, address="Howrah Bridge, Kolkata, WB", district="BBD Bagh", borough="Central Kolkata"),
         affectedPopulation=300000, casualties=0,
         resourcesDeployed=["RES-K06"],
         aiRiskScore=71, trending="stable"),

    dict(cityId="kolkata", type="hazmat", severity="medium", status="contained",
         title="Chemical Plant Incident — Garden Reach",
         description="Acid spill at Garden Reach industrial zone. Workers evacuated. Containment underway.",
         location=dict(lat=22.5273, lng=88.3099, address="Garden Reach, Kolkata, WB", district="Garden Reach", borough="South West Kolkata"),
         affectedPopulation=3500, casualties=2,
         resourcesDeployed=["RES-K07", "RES-K08"],
         aiRiskScore=60, trending="down"),

    dict(cityId="kolkata", type="mass_casualty", severity="critical", status="active",
         title="Stampede — Durga Puja Celebration",
         description="Stampede during festival crowd surge. 40+ casualties. Police forming barriers. Medical teams deployed.",
         location=dict(lat=22.5726, lng=88.3639, address="Rabindra Sarani, Kolkata, WB", district="Shyambazar", borough="North Kolkata"),
         affectedPopulation=20000, casualties=40,
         resourcesDeployed=["RES-K09", "RES-K10", "RES-K11"],
         aiRiskScore=99, trending="up"),
]


async def seed_incidents(db: AsyncSession) -> None:
    """Seed incidents if the collection is empty."""
    result = await db.execute(select(func.count(Incident.id)))
    count = result.scalar_one()
    if count > 0:
        logger.info("Incidents collection already seeded (%d docs). Skipping.", count)
        return

    logger.info("Seeding %d incidents...", len(_SEED))
    now = _now()
    # Assign realistic staggered timestamps so the feed looks live
    docs = []
    for i, seed in enumerate(_SEED):
        doc = dict(seed)
        doc["timestamp"] = _ago(15 + i * 20)
        doc["updatedAt"] = _ago(i * 3)
        docs.append(Incident(**doc))

    db.add_all(docs)
    await db.commit()
    logger.info("Successfully seeded %d incidents.", len(docs))
