# CrimeVista ML Strategy

## Objective

Use simple, explainable machine learning methods to deliver meaningful insights without overcomplicating the hackathon project.

## 1. Core ML Use Cases

### 1.1 Hotspot Detection

Use geospatial clustering and density-based methods to identify hotspots.

Possible techniques:

- DBSCAN for clustering incident points
- KDE-based heatmaps for density visualization
- spatial-temporal grouping for time-aware hotspots

### 1.2 Anomaly Detection

Use unsupervised anomaly detection to flag unusual incidents.

Possible techniques:

- Isolation Forest
- Local Outlier Factor
- simple rule-based anomaly flags for MVP

### 1.3 Predictive Risk Scoring

Use historical patterns to estimate future risk at a district or station level.

Possible techniques:

- logistic regression
- random forest
- gradient boosting for small datasets

## 2. Recommended MVP Approach

For the MVP, use:

- simple rule-based risk scoring for fast implementation
- DBSCAN or heatmap-based hotspot analysis
- isolation-based anomaly detection

This is easier to explain and deploy than a complex deep learning approach.

## 3. Output Format

ML outputs should be delivered as structured results that the API can return to the frontend:

- hotspot score
- anomaly flag
- risk category
- explanation text

## 4. Model Explainability

The model should produce explainable insights such as:

- recent spike in crime type
- repeated incidents in the same district
- unusual pattern relative to historical norms
- relationship strength between connected entities

This keeps the intelligence understandable for analysts and judges.

## 5. Minimum Viable Intelligence Outputs

The MVP should at least provide:

- one hotspot view
- one anomaly summary
- one risk score card
- one explainable insight sentence for each output

These outputs should be easy to understand without technical explanation.
