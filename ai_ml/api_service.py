import json

def analyze_crime_incident(incident_data, district_stats):
    """
    Processes a single FIR and returns structured JSON 
    including Task 4 Model Explainability insights.
    """
    
    victims = incident_data.get('VICTIM COUNT', 0)
    accused = incident_data.get('Accused Count', 0)
    district = incident_data.get('District_Name', 'Unknown')
    
    # Task 1 & 2 Logic
    is_anomaly = False
    if victims >= 3 or accused >= 5:
        is_anomaly = True

    total_crimes = district_stats.get(district, 0)
    
    if total_crimes >= 1000:
        risk_category = "High Risk"
        hotspot_score = 8.5
    elif total_crimes >= 500:
        risk_category = "Medium Risk"
        hotspot_score = 5.0
    else:
        risk_category = "Low Risk"
        hotspot_score = 2.0

    if is_anomaly:
        explanation = f"CRITICAL ALERT in {district}: High-priority anomaly due to severity. Hotspot score: {hotspot_score}/10."
    else:
        explanation = f"Standard incident in {district}. Classified as {risk_category}."

    # ==========================================
    # TASK 4: MODEL EXPLAINABILITY INSIGHTS
    # ==========================================
    insights = []
    
    # 1. Unusual pattern relative to historical norms
    if risk_category == "High Risk":
        insights.append(f"Unusual pattern: {district} is operating above historical safety norms (Top tier volume).")
    
    # 2. Repeated incidents in the same district
    if total_crimes > 0:
        insights.append(f"Repeated incidents: Database confirms {total_crimes} historical incidents logged in {district}.")
        
    # 3. Recent spike in severity (Using victim count as proxy for MVP)
    if victims > 1:
        insights.append(f"Recent spike: Incident involves an elevated victim count ({victims}), deviating from baseline profiles.")
        
    # 4. Relationship strength between connected entities (Using accused count)
    if accused > 1:
        insights.append(f"Entity relationships: {accused} connected accused individuals identified, suggesting a coordinated event.")
    else:
        insights.append("Entity relationships: Isolated incident with no immediate connected network identified.")

    # Task 3 Output Format + Task 4 Explainability
    api_response = {
        "hotspot_score": hotspot_score,
        "anomaly_flag": is_anomaly,
        "risk_category": risk_category,
        "explanation_text": explanation,
        "explainable_insights": insights  # Added for Task 4
    }
    
    return json.dumps(api_response, indent=4)

if __name__ == "__main__":
    mock_district_db = {"Bengaluru": 1500, "Hubli": 600, "Udupi": 200}
    sample_incident = {
        "Latitude": 12.9716, "Longitude": 77.5946, 
        "District_Name": "Bengaluru", "VICTIM COUNT": 4, "Accused Count": 3
    }
    print(analyze_crime_incident(sample_incident, mock_district_db))