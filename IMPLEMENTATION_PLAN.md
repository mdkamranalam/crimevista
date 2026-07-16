# CrimeVista Implementation Plan & Engineering Roadmap

This document serves as the master implementation blueprint and status record for **CrimeVista** (`AI-Driven Crime Analytics & Visualization Platform for Karnataka State Police & SCRB`). It details exactly what has been built across the backend, AI/ML, and database layers, and specifies our full integration roadmap for connecting the frontend dashboard dynamically to our backend services.

---

## 1. Project Execution Status

| Phase | Responsibility Area | Owner(s) | Status | Key Deliverables |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | Database Architecture & Core Models | **Kamran & Saksham** | ✅ **100% Completed** | PostGIS container setup, SQLAlchemy models (`Incident`, `Person`, `Relationship`), session management (`session.py`). |
| **Phase 2** | Backend REST API Service (`v1`) | **Kamran & Saksham** | ✅ **100% Completed** | FastAPI entrypoint (`main.py`), endpoints for `/health`, `/dashboard/summary`, `/incidents`, `/analytics/hotspots`, `/analytics/network/{entity_id}`. |
| **Phase 3** | Data Ingestion & Criminological Seeding | **Kamran & Saksham** | ✅ **100% Completed** | Batch CSV ETL loader (`ingest_fir_data.py`), repeat offender & syndicate seeder (`seed_network_data.py`). |
| **Phase 4** | AI/ML Intelligence Engine & Testing | **Ankur & Kamran** | ✅ **100% Completed** | DBSCAN spatial clustering, Isolation Forest/LOF anomalies, Random Forest risk scoring, `api_service.py` explainability, 4/4 automated unit tests passing (`test_pipeline.py`). |
| **Phase 5** | Frontend & Backend/AI Dynamic Integration | **Shivaleela & Team** | ⏳ **In Progress** | Wire React 19 + Vite dashboard (`src/`) to live FastAPI (`/api/v1`) & AI/ML endpoints (`/analytics/risk`, `/analytics/anomalies`, `/analytics/analyze`). |
| **Phase 6** | End-to-End Testing & Demo Hardening | **All Team Members** | ⏳ **Pending** | Integration test suite (`test_api_integration.py`), CORS verification, 5-minute hackathon presentation flow. |

---

## 2. Completed Technical Architecture

### A. Database Layer & Models
* **Database Engine**: PostgreSQL + PostGIS (`infra/docker-compose.yml` on port `5432`).
* **Connection Management**: Configured in `backend/app/db/session.py` with automatic connection pool pre-pinging (`pool_size=20`, `max_overflow=10`).
* **Core Relational Schema (`app/models/`)**:
  * `incidents` (`Incident`): Stores case numbers, crime types, timestamps, district/police station metadata, severity, status, and PostGIS `POINT(longitude, latitude)` geometry.
  * `persons` (`Person`): Stores full names, criminological roles (`Suspect`, `Victim`, `Witness`), age, gender, and aliases.
  * `relationships` (`Relationship`): Directional link analysis edges (`source_id` -> `target_id`) capturing connections like `involved_in`, `co_accused`, `victim_of`, `syndicate_associate`.

### B. Backend REST API (`http://localhost:8000/api/v1`)
* `GET /health` — Checks service and database connectivity (`SELECT 1`).
* `GET /dashboard/summary` — Returns total incident counts, top 5 high-risk districts by volume, and top 6 crime trends.
* `GET /incidents` — Paginated and filtered incident explorer supporting case-insensitive queries (`district`, `crime_type`, `police_station`, `severity`).
* `GET /analytics/hotspots` — Real-time **Haversine DBSCAN spatial clustering** directly on coordinates (`eps=0.5km, min_samples=10`), returning cluster centroids and normalized risk scores.
* `GET /analytics/network/{entity_id}` — Resolves any FIR case number or entity UUID into node-edge graph structures (`nodes: [...]`, `edges: [...]`).

### C. AI/ML Analytical Modules (`ai_ml/`)
* **`api_service.py`**: `analyze_crime_incident()` returning `hotspot_score`, `anomaly_flag`, `risk_category`, `explanation_text`, and structured `explainable_insights` (Task 4 explainability).
* **`predictive_risk.py`**: `RandomForestClassifier` scoring district risk based on historical volume quantiles and coordinates.
* **`anomaly_detection.py` & `advanced_anomalies.py`**: `IsolationForest` and `LocalOutlierFactor` combined with rule-based critical flags (`VICTIM COUNT >= 3` or `Accused Count >= 5`).
* **`test_pipeline.py`**: Automated unittest suite (`Ran 4 tests in 0.12s -> OK`).

---

## 3. Immediate Implementation Roadmap (Phase 5: Dynamic Integration)

### Step 1: Backend API & AI/ML Hardening (`backend/app/api/v1/`)
1. **Enhance `/analytics/risk`**: Replace static output with live evaluation aggregating `Incident` counts per district and applying `predictive_risk.py` quantile/RandomForest categorization.
2. **Add `GET /analytics/anomalies`**: Query `Incident` records matching critical rule criteria (`VICTIM COUNT >= 3` or `Accused Count >= 5` or `severity == 'High'`) and compute `IsolationForest` scores.
3. **Add `POST /analytics/analyze`**: Bridge `ai_ml.api_service.analyze_crime_incident` to process real-time incident payloads.
4. **Add `GET /geo/districts` & `GET /geo/police-stations`**: Provide distinct geographic lookup endpoints for frontend filters.

### Step 2: Frontend API Client & Component Wiring (`frontend/src/`)
1. **Create API Client (`src/lib/api.ts`)**: Define typed HTTP wrappers calling `http://localhost:8000/api/v1`.
2. **Wire Landing Overview (`routes/index.tsx`, `ActivityTable.tsx`)**: Fetch `GET /dashboard/summary` and `GET /incidents?limit=20` to populate KPI cards and live tables.
3. **Wire Hotspot Map (`HeatmapPanel.tsx`, `routes/heatmap.tsx`)**: Connect cluster circles to `GET /analytics/hotspots` and allow embedding `dbscan_hotspots.html` in drill-down views.
4. **Wire Criminological Network Graph (`routes/relationships.tsx`)**: Fetch `GET /analytics/network/CASE-2026-BLR-101` to dynamically construct suspect-incident networks.
5. **Wire AI Intelligence & Predictions (`AiIntelligence.tsx`, `routes/predictive.tsx`)**: Connect brief cards to `GET /analytics/risk` and `GET /analytics/anomalies`.
6. **Wire FIR Search & Filters (`routes/fir.tsx`, `routes/cases.tsx`)**: Connect district dropdowns and search grids to `GET /incidents` and `GET /geo/districts`.

### Step 3: Automated Integration Verification
* Create `backend/tests/test_api_integration.py` to run automated end-to-end FastAPI assertions alongside `ai_ml/test_pipeline.py`.

---

## 4. Build, Run & Verification Commands

### A. Start Database & Backend API
```bash
# 1. Start PostGIS container
cd infra && docker compose up -d db

# 2. Return to project root & activate virtual environment
cd ..
source .venv/bin/activate

# 3. Ensure network demo relationships are seeded
.venv/bin/python backend/scripts/seed_network_data.py

# 4. Start the FastAPI development server
.venv/bin/uvicorn backend.app.main:app --reload --port 8000
```
*Live Interactive API Docs:* **`http://localhost:8000/docs`**

### B. Start Frontend Development Server
```bash
cd frontend
npm run dev
```
*Access Web Dashboard:* **`http://localhost:5173`**

### C. Run All Automated Verification Tests
```bash
# AI/ML Pipeline Tests
.venv/bin/python -m unittest ai_ml/test_pipeline.py -v

# Backend & Integration Tests (once created)
.venv/bin/python -m pytest backend/tests/test_api_integration.py -v
```

---

## 5. Hackathon Demo Narrative (The 5-Minute Story)

1. **The Problem (0:00 - 1:00)**:
   * Explain how Karnataka State Police / SCRB face data silos, static Excel reporting, and delayed response times.
2. **The Solution Overview (1:00 - 2:00)**:
   * Introduce **CrimeVista**: An integrated intelligence platform connecting real-time FIR records to spatiotemporal hotspots and explainable AI insights.
3. **Spatiotemporal Hotspot Drill-down (2:00 - 3:15)**:
   * Show the interactive district drill-down (`/analytics/hotspots`). Highlight how Haversine DBSCAN clusters thousands of isolated coordinates into actionable red-zone pulsing clusters.
4. **Criminological Network & Link Analysis (3:15 - 4:15)**:
   * Show the relationship graph (`/analytics/network/CASE-2026-BLR-101`). Demonstrate how CrimeVista breaks silos by connecting repeat offenders across jurisdictions (`Ramesh 'Bhai' Kumar`), revealing hidden co-accused syndicates (`Suresh Gowda`) and recurring Modus Operandi (MO).
5. **Explainable AI & Strategic Impact (4:15 - 5:00)**:
   * Conclude with the AI Predictive Risk Dashboards (`/analytics/risk` & `/analytics/anomalies`), explaining why specific districts are flagged for elevated risk and how this shifts SCRB from reactive reporting to a **Strategic Intelligence Hub**.
