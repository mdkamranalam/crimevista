# CrimeVista Data Model

## Purpose

This document defines the core data model for CrimeVista so that the backend, ML layer, and frontend all work with the same understanding of the data.

## 1. Core Entities

### 1.1 Incident

Represents a crime event or case record.

| Field          | Type     | Description                     |
| -------------- | -------- | ------------------------------- |
| id             | UUID     | Unique incident identifier      |
| case_number    | string   | FIR or case number              |
| crime_type     | string   | Category of crime               |
| date_time      | datetime | Date and time of incident       |
| district       | string   | District name                   |
| police_station | string   | Relevant police station         |
| location_name  | string   | Human-readable location         |
| latitude       | float    | Latitude coordinate             |
| longitude      | float    | Longitude coordinate            |
| severity       | string   | Low/Medium/High                 |
| status         | string   | Open/Closed/Under investigation |

### 1.2 Person

Represents a suspect, victim, witness, or known person.

| Field     | Type    | Description                          |
| --------- | ------- | ------------------------------------ |
| id        | UUID    | Unique person identifier             |
| full_name | string  | Person name                          |
| role      | string  | Suspect / Victim / Witness / Unknown |
| age       | integer | Optional                             |
| gender    | string  | Optional                             |
| alias     | string  | Optional alias                       |

### 1.3 Relationship

Represents connections between entities.

| Field         | Type   | Description                                          |
| ------------- | ------ | ---------------------------------------------------- |
| id            | UUID   | Unique relationship id                               |
| source_type   | string | Incident / Person / Location                         |
| source_id     | UUID   | Source entity id                                     |
| target_type   | string | Incident / Person / Location                         |
| target_id     | UUID   | Target entity id                                     |
| relation_type | string | Co-occurred / Associated / Located at / Connected to |

### 1.4 Location

Represents a place used in incidents or analysis.

| Field          | Type   | Description                        |
| -------------- | ------ | ---------------------------------- |
| id             | UUID   | Unique location identifier         |
| name           | string | Location name                      |
| district       | string | District                           |
| police_station | string | Police station                     |
| latitude       | float  | Latitude                           |
| longitude      | float  | Longitude                          |
| location_type  | string | Area / Street / Landmark / Village |

### 1.5 CrimeType

Reference table for standardized crime categories.

| Field          | Type   | Description                        |
| -------------- | ------ | ---------------------------------- |
| id             | UUID   | Unique crime type id               |
| name           | string | Standard crime category            |
| category_group | string | Violent / Property / Cyber / Other |

## 2. Suggested Database Tables

```sql
CREATE TABLE incidents (
  id UUID PRIMARY KEY,
  case_number TEXT UNIQUE,
  crime_type TEXT NOT NULL,
  date_time TIMESTAMP NOT NULL,
  district TEXT NOT NULL,
  police_station TEXT NOT NULL,
  location_name TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  severity TEXT,
  status TEXT
);

CREATE TABLE persons (
  id UUID PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  alias TEXT
);

CREATE TABLE relationships (
  id UUID PRIMARY KEY,
  source_type TEXT NOT NULL,
  source_id UUID NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  relation_type TEXT NOT NULL
);

CREATE TABLE locations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT,
  police_station TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location_type TEXT
);
```

## 3. Data Quality Rules

- Every incident must have a crime type.
- Every incident should have a district and police station when available.
- Coordinates should be normalized and validated.
- Duplicate records should be flagged and prevented where possible.
- Missing values should be explicitly handled in analytics.
- Date values should follow a consistent timezone-aware format.
- Standardized lookups should be used for district names, station names, and crime categories.
- Any ingestion from CSV or spreadsheets should preserve a source reference for auditing.

## 4. Suggested Derived Fields

For better dashboards and analytics, store or compute the following derived values:

- crime_count_last_7_days
- crime_count_last_30_days
- hotspot_score
- anomaly_flag
- risk_score
- repeat_offender_count
- relation_degree
- district_trend_delta

## 5. Analytics-Ready Features

The system should also maintain derived features for ML and dashboards:

- crime count by day
- crime count by district
- hotspot score by location
- anomaly flag
- risk score
- repeat offender count
- network degree centrality

## 6. Example Ingestion Assumptions

The initial MVP can work from a curated CSV or JSON dataset with at least the following fields:

- case number
- crime type
- date/time
- district
- police station
- location
- coordinates
- suspect/victim references
