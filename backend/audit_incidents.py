import asyncio
import os
import json
from fastapi.testclient import TestClient
from sqlalchemy import text
from app.main import app
from app.database.database import engine

async def audit():
    print("--- 1. Verify SQLite database contains the incidents table ---")
    async with engine.begin() as conn:
        result = await conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='incidents';"))
        table_exists = result.scalar() is not None
        print(f"Table 'incidents' exists: {table_exists}")

    print("\n--- 2. Clear database to test empty state ---")
    async with engine.begin() as conn:
        await conn.execute(text("DELETE FROM incidents;"))
    print("Deleted all incidents.")

    print("\n--- 3. Testing Endpoints ---")
    with TestClient(app) as client:
        # 5. Ensure GET returns [] when no incidents exist
        res_get_empty = client.get("/api/v1/incidents?cityId=mumbai")
        print("GET (empty) Status:", res_get_empty.status_code)
        print("GET (empty) Response:", res_get_empty.json())

        # 6. Ensure POST returns HTTP 201
        payload = {
            "cityId": "mumbai",
            "type": "flood",
            "severity": "high",
            "status": "active",
            "title": "Audit Test Incident",
            "description": "Testing the backend audit script",
            "location": {
                "lat": 19.0,
                "lng": 72.0,
                "address": "Audit Address",
                "district": "Audit District"
            }
        }
        res_post = client.post("/api/v1/incidents", json=payload)
        print("POST Status:", res_post.status_code)
        
        created_incident = res_post.json()
        incident_id = created_incident.get("id")
        print("POST Response snippet:", {k: created_incident[k] for k in ["id", "title", "severity"]})

        # Test GET again
        res_get_one = client.get("/api/v1/incidents?cityId=mumbai")
        print("GET (1 item) Status:", res_get_one.status_code)
        
        # Test PATCH
        patch_payload = {
            "severity": "resolved",
            "status": "resolved"
        }
        res_patch = client.patch(f"/api/v1/incidents/{incident_id}", json=patch_payload)
        print("PATCH Status:", res_patch.status_code)
        patched_incident = res_patch.json()
        print("PATCH Response snippet:", {k: patched_incident[k] for k in ["id", "title", "severity", "status"]})
        
        print("\n--- 7 & 8. Pydantic and Swagger Verification ---")
        # Ensure that invalid POST returns 422
        bad_payload = payload.copy()
        bad_payload.pop("cityId")
        res_bad_post = client.post("/api/v1/incidents", json=bad_payload)
        print("Invalid POST Status:", res_bad_post.status_code, "(Expect 422 Unprocessable Entity)")

        print("\n--- Audit Complete ---")

if __name__ == "__main__":
    asyncio.run(audit())
