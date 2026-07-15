import sys
from pathlib import Path
backend_dir = str(Path(__file__).resolve().parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import health, dashboard, incidents, analytics

app = FastAPI(
    title="CrimeVista API",
    description="AI-Driven Crime Analytics & Visualization Platform for Karnataka State Police & SCRB",
    version="1.0.0"
)

# Allow React/Vite local dev and Docker endpoints
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 routers
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(dashboard.router, prefix="/api/v1", tags=["Dashboard"])
app.include_router(incidents.router, prefix="/api/v1", tags=["Incidents"])
app.include_router(analytics.router, prefix="/api/v1", tags=["Analytics & AI"])

@app.get("/")
def root():
    return {"message": "CrimeVista API is running. Access docs at /docs"}
