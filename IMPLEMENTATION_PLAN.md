# CrimeVista Implementation Plan & Engineering Roadmap

This document serves as the master implementation blueprint and status record for **CrimeVista** (`AI-Driven Crime Analytics & Visualization Platform for Karnataka State Police & SCRB`). It details exactly what has been built across the backend and AI/ML layers, alongside the remaining frontend and presentation roadmap.

---

## 1. Project Execution Status

| Phase | Responsibility Area | Owner(s) | Status | Key Deliverables |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | Database Architecture & Core Models | **Kamran & Saksham** | ✅ **100% Completed** | PostGIS container setup, SQLAlchemy models (`Incident`, `Person`, `Relationship`), session management (`session.py`). |
| **Phase 2** | Backend REST API Service (`v1`) | **Kamran & Saksham** | ✅ **100% Completed** | FastAPI entrypoint (`main.py`), endpoints for `/health`, `/dashboard/summary`, `/incidents`, `/analytics/hotspots`, `/analytics/risk`, `/analytics/network/{entity_id}`. |
| **Phase 3** | Data Ingestion & Criminological Seeding | **Kamran & Saksham** | ✅ **100% Completed** | Batch CSV ETL loader (`ingest_fir_data.py`), repeat offender & syndicate seeder (`seed_network_data.py`). |
| **Phase 4** | AI/ML Intelligence Engine & Testing | **Ankur & Kamran** | ✅ **100% Completed** | DBSCAN spatial clustering, Isolation Forest/LOF anomalies, Random Forest risk scoring, 4/4 automated unit tests passing (`test_pipeline.py`). |
| **Phase 5** | Frontend Dashboard & Visualizations | **Shivaleela** | ⏳ **0% Completed** *(Pending)* | Vite + React single-page app, interactive Folium/Leaflet maps, network link analysis graph (`vis-network`), filtered incident grid. |
| **Phase 6** | End-to-End Demo Hardening | **All Team Members** | ⏳ **Pending** | CORS verification, demo rehearsal, story framing (*Problem -> Hotspots -> Link Analysis -> Proactive Policing*). |

---

## 2. Completed Technical Architecture (Kamran, Saksham & Ankur)

### A. Database Layer & Models
* **Database Engine**: PostgreSQL + PostGIS (`infra/docker-compose.yml` running on port `5432`).
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
* `GET /analytics/risk` — Returns explainable AI risk indicators and rationale per district.
* `GET /analytics/network/{entity_id}` — Resolves any FIR case number or entity UUID into node-edge graph structures (`nodes: [...]`, `edges: [...]`) to visually reveal organized crime syndicates and repeat offender Modus Operandi (MO).

### C. Data Ingestion & Seeding Pipelines
* **`backend/scripts/ingest_fir_data.py`**: Reads `data/FIR_Details_Data.csv` (~572 MB) in 50,000-row chunks, filters coordinates strictly within Karnataka (`Lat: 11.5–18.5`, `Lon: 74.0–78.5`), parses dates (`FIR_YEAR/MONTH/Day`), derives severity (`heinous` -> `High`), and bulk inserts into PostGIS.
* **`backend/scripts/seed_network_data.py`**: Initializes realistic repeat offenders (`Ramesh 'Bhai' Kumar`), co-accused (`Suresh Gowda`), inter-district operatives (`Vikram Reddy`), and victims (`Rajesh Sharma`), linking them directly to FIR cases (`CASE-2026-BLR-101`).

### D. AI/ML Analytical Modules (`ai_ml/`)
* **`test_pipeline.py`**: Automated unittest suite verifying DBSCAN cluster vs. noise identification, Isolation Forest prediction boundaries, rule-based anomaly flags (`Victims >= 3 or Accused >= 5`), and quantile risk categorization.

---

## 3. Remaining Implementation Roadmap (For Shivaleela — Frontend)

### Step 1: Bootstrap React Dashboard (`frontend/`)
```bash
# Run from project root
npx -y create-vite@latest frontend --template react
cd frontend
npm install
npm install axios lucide-react
```
Create `src/config.js` to link the UI directly to Kamran's running backend API:
```javascript
export const API_BASE_URL = "http://localhost:8000/api/v1";
```

### Step 2: Implement Key Dashboard Components
1. **Landing Overview (`DashboardSummary.jsx`)**:
   * Fetch `GET /api/v1/dashboard/summary`.
   * Display KPI cards (`Total Incidents`, `Active Anomalies`, `High-Risk Districts`).
   * Render bar chart for `recent_trends` (`Theft`, `Robbery`, `Cybercrime`).
2. **Geospatial Hotspot Map (`HotspotMap.jsx`)**:
   * Fetch `GET /api/v1/analytics/hotspots?district={selectedDistrict}`.
   * Render circles at cluster centroids (`latitude`, `longitude`) with radius proportional to `incident_count` and color-coded by `score`.
   * Option B: Directly embed `dbscan_hotspots.html` or `advanced_anomalies_map.html` inside a responsive `<iframe>` for instant high-performance visual storytelling.
3. **Criminological Network Graph (`NetworkLinkAnalysis.jsx`)**:
   * Fetch `GET /api/v1/analytics/network/CASE-2026-BLR-101`.
   * Render interactive force-directed graph (using `react-force-graph-2d` or `vis-network`).
   * Highlight suspect nodes (`red`), incident nodes (`blue`), and victim nodes (`green`) with clickable edges (`co_accused`, `involved_in`).
4. **Incident Explorer (`IncidentGrid.jsx`)**:
   * Fetch `GET /api/v1/incidents` with dynamic query filters (`district`, `crime_type`, `severity`).
   * Display tabular data with pagination controls (`limit`, `offset`).

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

### B. Run AI/ML Verification Tests
```bash
.venv/bin/python -m unittest ai_ml/test_pipeline.py -v
```
*Expected Output:* `Ran 4 tests in 0.066s -> OK`

### C. Verify Live Endpoints via cURL
```bash
# Health Check
curl -s http://localhost:8000/api/v1/health

# Dashboard Summary
curl -s http://localhost:8000/api/v1/dashboard/summary

# Hotspot Clustering
curl -s "http://localhost:8000/api/v1/analytics/hotspots?district=Bengaluru&epsilon_km=0.5&min_crimes=10"

# Criminological Network Graph
curl -s "http://localhost:8000/api/v1/analytics/network/CASE-2026-BLR-101"
```

---

## 5. Hackathon Demo Narrative (The 5-Minute Story)

1. **The Problem (0:00 - 1:00)**:
   * Explain how Karnataka State Police / SCRB currently face data silos, heavy reliance on static Excel reporting, and reactive policing.
2. **The Solution Overview (1:00 - 2:00)**:
   * Introduce **CrimeVista**: An integrated intelligence platform that transforms fragmented FIR records into dynamic spatiotemporal insights.
3. **Spatiotemporal Hotspot Drill-down (2:00 - 3:15)**:
   * Show the interactive district drill-down (`/analytics/hotspots`). Highlight how Haversine DBSCAN clusters thousands of isolated coordinates into actionable red-zone pulsing clusters, enabling proactive beat deployment.
4. **Criminological Network & Link Analysis (3:15 - 4:15)**:
   * Show the relationship graph (`/analytics/network/CASE-2026-BLR-101`). Demonstrate how CrimeVista breaks silos by connecting repeat offenders across jurisdictions (`Ramesh 'Bhai' Kumar`), revealing hidden co-accused syndicates (`Suresh Gowda`) and recurring Modus Operandi (MO).
5. **Explainable AI & Strategic Impact (4:15 - 5:00)**:
   * Conclude with the AI Predictive Risk Dashboards (`/analytics/risk`), explaining why specific districts are flagged for elevated risk and how this shifts SCRB from reactive reporting to a **Strategic Intelligence Hub**.
