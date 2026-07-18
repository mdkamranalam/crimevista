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

- Replaces static reporting with real-time density clustering directly on geographic coordinates.
- Filters incidents within Karnataka bounds (`Lat: 11.5–18.5`, `Lon: 74.0–78.5`) and generates dynamic red-zone pulsing indicators when specific crime categories spike (`GET /api/v1/analytics/hotspots`).

### 2. Criminological Network & Link Analysis (`Repeat Offender MO Tracking`)

- Breaks independent silos by linking suspects, co-accused syndicates, victims, and recurring locations into unified directional graph structures (`GET /api/v1/analytics/network/{entity_id}`).
- Tracks repeat offenders across multiple police stations and jurisdictions (`involved_in`, `co_accused`, `syndicate_associate`).

### 3. Explainable AI Predictive Risk Dashboards

- Deploys **Random Forest**, **Isolation Forest**, and **Local Outlier Factor (LOF)** classifiers to forecast high-risk districts (`GET /api/v1/analytics/risk`).
- Provides human-readable explainability notes (e.g., _"Recent 30% surge in property offences near transit corridors"_) so investigators understand the _"why"_ behind the _"where"_.

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

- **Backend API**: Python 3.13, FastAPI, Uvicorn, SQLAlchemy, GeoAlchemy2, Pydantic v2.
- **Geospatial Database**: PostgreSQL 16 + PostGIS 3.4 (running via Docker Compose).
- **Machine Learning & Analytics**: Scikit-learn (`DBSCAN`, `IsolationForest`, `LocalOutlierFactor`, `RandomForest`), NumPy, Pandas, Folium (`haversine` metric clustering).

---

## 🛠️ Quickstart & Installation Guide

### Prerequisites

- **Python 3.10+** (Tested on Python 3.13)
- **Docker & Docker Compose** (Required for PostGIS database container)

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

_Verify container is healthy:_ `docker ps` (You should see `crimevista_db` running on `localhost:5432`).

### Step 3: Seed Demo Network & Ingest FIR Data

Initialize database tables, seed realistic repeat offender networks (`CASE-2026-BLR-101`), and optionally load the raw dataset:

```bash
# 1. Seed realistic demo criminological network profiles & repeat offenders (Instant)
.venv/bin/python backend/scripts/seed_network_data.py

# 2. (Optional) Ingest full 572 MB Karnataka FIR dataset in 50k batch chunks
.venv/bin/python backend/scripts/ingest_fir_data.py
```

_Note:_ The seeding script alone initializes enough connected data (`incidents`, `persons`, `relationships`) to immediately test and demo all API endpoints!

---

## 🖥️ Running the Full Project (Quick Guide)

To run the complete CrimeVista platform (Frontend + Backend + AI/ML Engine), you will run two terminals: one for the **FastAPI Backend Server** (which automatically integrates and runs our AI/ML pipeline) and one for the **TanStack React Frontend**.

### 1. Start the Backend & AI/ML API Server (`Port 8000`)

The main FastAPI server handles all database queries (`incidents`, `dashboard`, `geo`) **and** dynamically imports the `ai_ml` models (`analyze_crime_incident`, `IsolationForest` anomalies, and `DBSCAN` clustering) in a single unified process.

From the project root (`crimevista/`):

```bash
# Option A: Run from workspace root using python -m uvicorn
.venv/bin/python -m uvicorn backend.app.main:app --reload --port 8000

# Option B: Run by navigating into backend/
cd backend
../.venv/bin/uvicorn app.main:app --reload --port 8000
```

- **Interactive Swagger Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **API Health Check:** [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)

---

### 2. Start the Frontend Web Dashboard (`Port 8080`)

Open a second terminal window, navigate to `frontend/`, install Node dependencies (first run only), and start the Vite development server:

```bash
cd frontend

# Install dependencies (only required on first run)
npm install

# Start local dev server
npm run dev -- --host 0.0.0.0 --port 8080
```

- **CrimeVista Live App:** [http://127.0.0.1:8080](http://127.0.0.1:8080)
- The frontend automatically connects to `http://127.0.0.1:8000/api/v1` for all live KPI metrics, FIR feeds, Folium/Leaflet spatial heatmaps, AI predictive simulators, and criminological network graphs.

---

### 3. (Optional) Standalone AI/ML Microservice API (`Port 8001`)

If you want to run the `ai_ml/` directory directly as a standalone microservice to test raw `POST /api/analyze` predictions without database overhead:

```bash
cd ai_ml
../.venv/bin/uvicorn main:app --reload --port 8001
```

- Note: Notice the syntax here is `uvicorn main:app` (since the app instance is directly in `ai_ml/main.py`), rather than `app.main:app`.

---

### Core REST API Contract (`/api/v1` on Port 8000)

| Method | Endpoint                                     | Description                                                                                       |
| :----- | :------------------------------------------- | :------------------------------------------------------------------------------------------------ |
| `GET`  | `/api/v1/health`                             | Service status and database/SQLite connection check                                               |
| `GET`  | `/api/v1/dashboard/summary`                  | KPI totals, top 5 high-risk districts, and crime type trend breakdowns                            |
| `GET`  | `/api/v1/incidents`                          | Paginated incident explorer with optional `district`, `crime_type`, `severity` filters            |
| `GET`  | `/api/v1/analytics/hotspots`                 | Real-time Haversine DBSCAN spatial clustering (`epsilon_km`, `min_crimes` params)                 |
| `GET`  | `/api/v1/analytics/risk`                     | Explainable AI risk scores per district (`High/Medium/Low Risk` + rationale)                      |
| `GET`  | `/api/v1/analytics/anomalies`                | Isolation Forest & rule-based critical anomaly detection (`anomaly_score`, `reason`)              |
| `POST` | `/api/v1/analytics/analyze`                  | **Task 4 Simulator Endpoint:** Evaluates arbitrary incident inputs & returns explainable insights |
| `GET`  | `/api/v1/analytics/network/{entity_id}`      | Node-edge graph generator linking suspects, co-accused syndicates, and incidents                  |
| `GET`  | `/api/v1/geo/districts` & `/police-stations` | Live geographic hierarchical filtering lists                                                      |

---

## 🐳 Docker Multi-Container Orchestration (`docker compose up`)

The entire CrimeVista platform (`db`, `backend`, `ai_ml`, and `frontend`) has been fully dockerized with individual optimized Dockerfiles and orchestrated via Docker Compose.

To build and spin up all 4 microservices simultaneously with a single command:

```bash
# Make sure Docker Desktop / daemon is running on your machine first!
docker compose up --build -d
```

Once the containers finish building and start up:

- **Frontend Web Application:** [http://localhost:5173](http://localhost:5173)
- **Backend API + Integrated AI/ML Server:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Standalone AI/ML Microservice:** [http://localhost:8001/docs](http://localhost:8001/docs)
- **PostgreSQL + PostGIS Database:** `localhost:5432`

To stop and remove all containers:

```bash
docker compose down
```

---

## 🧪 Testing & Verification Suite

We have written and verified a 100% automated test suite across the Backend API, AI/ML Pipeline, and Frontend build:

### 1. Run Backend API Integration Tests (`11/11 Passing`)

Verifies all 11 endpoints (`/health`, `/dashboard/summary`, `/incidents`, `/analytics/hotspots`, `/analytics/risk`, `/analytics/anomalies`, `/analytics/network`, `/analytics/analyze`, `/geo/districts`, `/geo/police-stations`) against an in-memory test database:

```bash
.venv/bin/python -m unittest backend.tests.test_api_integration -v
```

_Expected Output:_

```text
...........
----------------------------------------------------------------------
Ran 11 tests in 0.038s -> OK
```

### 2. Run AI/ML Analytical Pipeline Tests (`4/4 Passing`)

Verifies spatial-temporal data formatting, quantile risk assignments, Isolation Forest bounds, and the `analyze_crime_incident()` explainable AI engine:

```bash
.venv/bin/python -m unittest ai_ml.test_pipeline -v
```

_Expected Output:_

```text
test_dbscan_logic ... ok
test_isolation_forest_execution ... ok
test_risk_assignment_thresholds ... ok
test_rule_based_anomaly ... ok
----------------------------------------------------------------------
Ran 4 tests in 0.054s -> OK
```

### 3. Verify Frontend Production Build (`Vite + Nitro SSR`)

```bash
cd frontend
npm run build
```

_Expected Output:_ `✓ built in ~200ms` across all 2,500+ modules and routes with zero errors.

---

## 📚 Project Documentation & Roadmap

For complete architectural details, team workflows, and the remaining frontend implementation plan, consult:

- **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** — Master engineering blueprint & 5-minute hackathon demo narrative.
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — Detailed component-level system design.
- **[docs/DATA_MODEL.md](docs/DATA_MODEL.md)** — Exact database schema (`incidents`, `persons`, `relationships`).
- **[docs/API_SPEC.md](docs/API_SPEC.md)** — REST API request/response specifications.
- **[docs/ML_STRATEGY.md](docs/ML_STRATEGY.md)** — Explainable AI and machine learning methodology.
- **[docs/TEAM_WORKPLAN.md](docs/TEAM_WORKPLAN.md)** — Role division across backend, data engineering, ML, and frontend.

---

_Built for the Karnataka State Police (KSP) & State Crime Records Bureau (SCRB) Hackathon._
