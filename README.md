# CrimeVista — AI-Driven Crime Analytics & Visualization Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL + PostGIS](https://img.shields.io/badge/PostgreSQL%20%2B%20PostGIS-316192?style=flat&logo=postgresql&logoColor=white)](https://postgis.net/)
[![Python ML Engine](https://img.shields.io/badge/AI%2FML-Scikit--Learn%20%7C%20Folium-F7931E?style=flat&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Hackathon Scope](https://img.shields.io/badge/Karnataka%20Police%20%2F%20SCRB-Hackathon%20Challenge-008080?style=flat)]()

**CrimeVista** is an integrated state-of-the-art public safety intelligence platform built specifically for the **Karnataka State Police (KSP)** and the **State Crime Records Bureau (SCRB)** hackathon challenge. 

The platform moves law enforcement from reactive, siloed Excel sheet reporting to a proactive **Strategic Intelligence Hub**, transforming fragmented First Information Reports (FIRs) into actionable spatiotemporal hotspots, repeat offender link analyses, and explainable AI risk predictions.

---

## 🚀 Key Capabilities Built

### 1. Advanced Spatiotemporal Hotspots (`Haversine DBSCAN`)
* Replaces static reporting with real-time density clustering directly on geographic coordinates.
* Filters incidents within Karnataka bounds (`Lat: 11.5–18.5`, `Lon: 74.0–78.5`) and generates dynamic red-zone pulsing indicators when specific crime categories spike (`GET /api/v1/analytics/hotspots`).

### 2. Criminological Network & Link Analysis (`Repeat Offender MO Tracking`)
* Breaks independent silos by linking suspects, co-accused syndicates, victims, and recurring locations into unified directional graph structures (`GET /api/v1/analytics/network/{entity_id}`).
* Tracks repeat offenders across multiple police stations and jurisdictions (`involved_in`, `co_accused`, `syndicate_associate`).

### 3. Explainable AI Predictive Risk Dashboards
* Deploys **Random Forest**, **Isolation Forest**, and **Local Outlier Factor (LOF)** classifiers to forecast high-risk districts (`GET /api/v1/analytics/risk`).
* Provides human-readable explainability notes (e.g., *"Recent 30% surge in property offences near transit corridors"*) so investigators understand the *"why"* behind the *"where"*.

---

## 🏗️ System Architecture & Tech Stack

```text
Raw FIR CSV Data (572 MB) ──► Ingestion ETL (`ingest_fir_data.py`)
                                     │
                                     ▼
                      PostgreSQL + PostGIS Container (`Port 5432`)
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
       FastAPI REST Service (`Port 8000`)     AI/ML Analytics Pipeline (`ai_ml/`)
                 │                                       │
                 ▼                                       ▼
       Swagger UI (`/docs`) & JSON APIs         Interactive Folium HTML Maps
```

* **Backend API**: Python 3.13, FastAPI, Uvicorn, SQLAlchemy, GeoAlchemy2, Pydantic v2.
* **Geospatial Database**: PostgreSQL 16 + PostGIS 3.4 (running via Docker Compose).
* **Machine Learning & Analytics**: Scikit-learn (`DBSCAN`, `IsolationForest`, `LocalOutlierFactor`, `RandomForest`), NumPy, Pandas, Folium (`haversine` metric clustering).

---

## 🛠️ Quickstart & Installation Guide

### Prerequisites
* **Python 3.10+** (Tested on Python 3.13)
* **Docker & Docker Compose** (Required for PostGIS database container)

### Step 1: Clone Repository & Setup Virtual Environment
Open your terminal and run from the project root:
```bash
# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
# On macOS / Linux:
source .venv/bin/activate
# On Windows (PowerShell):
# .venv\Scripts\Activate.ps1

# Install backend and ML dependencies
pip install -r backend/requirements.txt
pip install -r ai_ml/requirements.txt
```

### Step 2: Launch PostGIS Database Container
Start the pre-configured PostgreSQL + PostGIS database in detached mode:
```bash
cd infra
docker compose up -d db
cd ..
```
*Verify container is healthy:* `docker ps` (You should see `crimevista_db` running on `localhost:5432`).

### Step 3: Seed Demo Network & Ingest FIR Data
Initialize database tables, seed realistic repeat offender networks (`CASE-2026-BLR-101`), and optionally load the raw dataset:
```bash
# 1. Seed realistic demo criminological network profiles & repeat offenders (Instant)
.venv/bin/python backend/scripts/seed_network_data.py

# 2. (Optional) Ingest full 572 MB Karnataka FIR dataset in 50k batch chunks
.venv/bin/python backend/scripts/ingest_fir_data.py
```
*Note:* The seeding script alone initializes enough connected data (`incidents`, `persons`, `relationships`) to immediately test and demo all API endpoints!

---

## 🖥️ Running the API Server (Usage)

Start the live development server with hot-reloading enabled:
```bash
.venv/bin/uvicorn backend.app.main:app --reload --port 8000
```

Once running, open your browser to inspect and test all interactive REST endpoints directly:
* **Interactive Swagger UI (API Docs):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **ReDoc API Documentation:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### Core REST API Contract (`/api/v1`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Service status and PostGIS database connection check |
| `GET` | `/api/v1/dashboard/summary` | KPI totals, top 5 high-risk districts, and crime type trend breakdowns |
| `GET` | `/api/v1/incidents` | Paginated incident explorer with optional `district`, `crime_type`, `severity` filters |
| `GET` | `/api/v1/analytics/hotspots` | Real-time Haversine DBSCAN spatial clustering (`epsilon_km`, `min_crimes` params) |
| `GET` | `/api/v1/analytics/risk` | Explainable AI risk scores per district (`High/Medium/Low Risk` + rationale) |
| `GET` | `/api/v1/analytics/network/{entity_id}` | Node-edge graph generator linking suspects, co-accused syndicates, and incidents |

---

## 🧪 Testing & Verification

### 1. Run AI/ML Analytical Unit Tests
Execute the automated test suite to verify DBSCAN clustering accuracy, Isolation Forest bounds, rule-based anomaly triggers, and quantile risk assignment:
```bash
.venv/bin/python -m unittest ai_ml/test_pipeline.py -v
```
*Expected Output:*
```text
test_dbscan_logic ... ok
test_isolation_forest_execution ... ok
test_risk_assignment_thresholds ... ok
test_rule_based_anomaly ... ok
----------------------------------------------------------------------
Ran 4 tests in 0.066s -> OK
```

### 2. Verify API Endpoints via cURL
While `uvicorn` is running (`port 8000`), open a second terminal to verify live JSON payloads:
```bash
# 1. Check Service Health
curl -s http://127.0.0.1:8000/api/v1/health

# 2. Fetch Dashboard Summary
curl -s http://127.0.0.1:8000/api/v1/dashboard/summary

# 3. Query Spatial DBSCAN Hotspots inside Bengaluru Urban
curl -s "http://127.0.0.1:8000/api/v1/analytics/hotspots?district=Bengaluru&epsilon_km=0.5&min_crimes=10"

# 4. Query Criminological Network for Demo FIR Case
curl -s "http://127.0.0.1:8000/api/v1/analytics/network/CASE-2026-BLR-101"
```

---

## 📚 Project Documentation & Roadmap

For complete architectural details, team workflows, and the remaining frontend implementation plan, consult:
* **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** — Master engineering blueprint & 5-minute hackathon demo narrative.
* **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — Detailed component-level system design.
* **[docs/DATA_MODEL.md](docs/DATA_MODEL.md)** — Exact database schema (`incidents`, `persons`, `relationships`).
* **[docs/API_SPEC.md](docs/API_SPEC.md)** — REST API request/response specifications.
* **[docs/ML_STRATEGY.md](docs/ML_STRATEGY.md)** — Explainable AI and machine learning methodology.
* **[docs/TEAM_WORKPLAN.md](docs/TEAM_WORKPLAN.md)** — Role division across backend, data engineering, ML, and frontend.

---
*Built for the Karnataka State Police (KSP) & State Crime Records Bureau (SCRB) Hackathon.*
