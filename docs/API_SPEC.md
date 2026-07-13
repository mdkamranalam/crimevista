# CrimeVista API Specification

## Base URL

```text
/api/v1
```

## 1. Health

### GET /health

Returns service health status.

**Response**

```json
{
  "status": "ok"
}
```

## 2. Dashboard Summary

### GET /dashboard/summary

Returns key metrics for the landing dashboard.

**Response**

```json
{
  "total_incidents": 1250,
  "high_risk_districts": ["Bengaluru Urban", "Mysuru"],
  "recent_trends": {
    "theft": 12,
    "robbery": 7
  },
  "anomaly_count": 8
}
```

## 3. Incident Query

### GET /incidents

Query incidents with filters.

**Query Parameters**

- crime_type
- district
- police_station
- start_date
- end_date
- severity
- limit
- offset

**Response**

```json
{
  "items": [
    {
      "id": "uuid",
      "case_number": "CASE-001",
      "crime_type": "Theft",
      "date_time": "2026-01-15T14:30:00Z",
      "district": "Bengaluru Urban",
      "police_station": "JP Nagar",
      "severity": "High"
    }
  ],
  "count": 1
}
```

## 4. District and Station Overview

### GET /geo/districts

Returns district-level statistics.

### GET /geo/police-stations

Returns station-level statistics.

## 5. Hotspot Analysis

### GET /analytics/hotspots

Returns hotspot points or clusters.

**Response**

```json
{
  "hotspots": [
    {
      "district": "Bengaluru Urban",
      "score": 0.91,
      "latitude": 12.97,
      "longitude": 77.59,
      "crime_type": "Theft"
    }
  ]
}
```

## 6. Network Analysis

### GET /analytics/network/{entity_id}

Returns connected entities for a selected suspect, location, or incident.

**Response**

```json
{
  "nodes": [
    { "id": "person-1", "type": "person", "label": "Suspect A" },
    { "id": "incident-1", "type": "incident", "label": "Case 102" }
  ],
  "edges": [
    { "source": "person-1", "target": "incident-1", "type": "involved_in" }
  ]
}
```

## 7. Predictive Risk

### GET /analytics/risk

Returns AI-generated risk scores for districts or stations.

**Response**

```json
{
  "items": [
    {
      "district": "Bengaluru Urban",
      "risk_score": 0.87,
      "reason": "Recent spike in theft incidents"
    }
  ]
}
```

## 8. Anomaly Detection

### GET /analytics/anomalies

Returns unusual incidents or patterns.

## 9. Data Ingestion

### POST /ingest/csv

Accepts a CSV file and stores normalized records.

## 10. API Conventions

- Use plural resource names.
- Use standard HTTP status codes.
- Keep responses compact and frontend-friendly.
- Include pagination for large result sets.
- Use consistent lowercase route naming.
- Provide clear error payloads with message and code fields.
- Include optional filters rather than forcing the frontend to fetch everything.

## 11. Suggested Response Shape for Errors

```json
{
  "success": false,
  "error": {
    "code": "invalid_query",
    "message": "The requested district filter is not recognized."
  }
}
```

## 12. Suggested Pagination Shape

```json
{
  "items": [],
  "count": 0,
  "limit": 20,
  "offset": 0
}
```
