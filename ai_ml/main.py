from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
from api_service import analyze_crime_incident

# Initialize the FastAPI application
app = FastAPI(title="CrimeVista ML API")

# Define the structure of the incoming request payload.
# This ensures the API only accepts properly formatted data.
class IncidentRequest(BaseModel):
    Latitude: float
    Longitude: float
    District_Name: str
    VICTIM_COUNT: int 
    Accused_Count: int

# Mock database dictionary (Replace with real DB connection later)
MOCK_DISTRICT_DB = {
    "Bengaluru": 1500,
    "Hubli": 600,
    "Udupi": 200,
    "Belagavi": 450,
    "Mysuru": 800
}

# Define the POST endpoint for the frontend
@app.post("/api/analyze")
async def process_incident(incident: IncidentRequest):
    try:
        # Reconstruct the dictionary to match the keys expected by api_service.py
        incident_data = {
            "Latitude": incident.Latitude,
            "Longitude": incident.Longitude,
            "District_Name": incident.District_Name,
            "VICTIM COUNT": incident.VICTIM_COUNT,
            "Accused Count": incident.Accused_Count
        }
        
        # Call the ML service function
        raw_output = analyze_crime_incident(incident_data, MOCK_DISTRICT_DB)
        
        # Return the parsed JSON as an HTTP response
        return json.loads(raw_output)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))