import asyncio
from fastapi.testclient import TestClient
from app.main import app

with TestClient(app) as client:
    response = client.get("/api/v1/incidents?cityId=mumbai")
    print("GET Status:", response.status_code)
    
    payload = {
        "cityId": "mumbai",
        "type": "flood",
        "description": "Test citizen report",
        "location": {
            "lat": 19.0,
            "lng": 72.0,
            "address": "Mumbai",
            "district": "Test"
        }
    }
    response_post = client.post("/api/v1/incidents/citizen", json=payload)
    print("POST Status:", response_post.status_code)
