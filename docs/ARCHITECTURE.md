# CrimeVista Architecture

## Purpose

This document defines the technical architecture for the CrimeVista platform. It is designed for the hackathon MVP and keeps the implementation practical, explainable, and demo-friendly.

## 1. High-Level Vision

CrimeVista will follow a simple end-to-end flow:

1. Ingest and clean crime data.
2. Store it in a centralized relational database with geospatial support.
3. Generate analytics and AI insights.
4. Expose results through APIs.
5. Render insights in a web dashboard.

## 2. System Components

### 2.1 Frontend

- React-based single-page application
- Dashboard views for overview, trend analysis, map visualization, and network analysis
- Filters for district, police station, crime type, date, and incident status
- Interactive charts and maps

### 2.2 Backend API

- FastAPI service for all business logic and data access
- REST endpoints for dashboard metrics, incident queries, hotspot data, network relationships, and AI predictions
- Clean separation between data access, analytics, and response formatting

### 2.3 Data Layer

- PostgreSQL for structured storage
- PostGIS for geospatial queries and map-based analysis
- Optional support for a graph layer later if network analysis becomes more complex

### 2.4 Analytics and ML Layer

- Python-based analytics scripts and notebooks
- Feature engineering for hotspot detection, anomaly detection, and predictive scoring
- Models such as simple rule-based scoring, clustering, or lightweight supervised learning for MVP

### 2.5 Data Ingestion Layer

- CSV/JSON ingestion scripts for sample datasets
- Data normalization and cleaning scripts
- Standardized schema for incidents, people, locations, and relations

## 3. Recommended Module Structure

```text
crimevista/
  README.md
  docs/
  dev_docs/
  backend/
    app/
      api/
      core/
      models/
      services/
      db/
      schemas/
    requirements.txt
  frontend/
    src/
    public/
    package.json
  data/
    raw/
    processed/
    schema/
  ml/
    notebooks/
    scripts/
    models/
  infra/
    docker/
    docker-compose.yml
```

## 4. Core Data Flow

```text
Raw crime data -> Cleaning & normalization -> PostgreSQL/PostGIS -> API -> Dashboard
                              \-> ML feature generation -> Risk/anomaly scoring -> API
```

## 5. API Design Principles

- Keep endpoints simple and readable.
- Return structured JSON for frontend consumption.
- Separate read operations from analytics-heavy operations.
- Avoid putting business logic into the frontend.
- Prefer explicit, versioned routes such as /api/v1/...
- Use pagination and filters for large datasets.
- Keep error responses consistent and easy for the UI to consume.

## 6. Frontend Interaction Model

The frontend should be organized around a few core user journeys:

1. Landing dashboard overview
2. Incident browsing with filters
3. Map-based hotspot exploration
4. Relationship or network inspection
5. AI insight explanation and drill-down

Each view should be backed by a dedicated API endpoint and should not depend on direct database access.

## 7. Deployment Approach

### Local Development

- PostgreSQL running locally
- Backend served locally via FastAPI
- Frontend served via Vite or React dev server

### Demo Deployment

- Docker-based deployment is preferred for a clean, repeatable demo setup
- Optional cloud deployment later if needed

## 8. Architecture Decisions

### Why FastAPI?

FastAPI is suitable because it is modern, fast to build with, and ergonomic for analytics-oriented APIs.

### Why PostgreSQL + PostGIS?

This stack fits the platform well because it supports structured data and geospatial operations without adding unnecessary complexity.

### Why React?

React is a strong fit for interactive dashboards and reusable UI components.

## 9. MVP Scope

The initial architecture must support:

- dashboard overview
- incident exploration
- hotspot map visualization
- trend analysis
- network link analysis
- AI-based risk and anomaly insights

## 10. Non-Goals for MVP

- citizen mobile app
- multi-tenant enterprise auth
- complex event streaming
- large-scale production data pipelines
