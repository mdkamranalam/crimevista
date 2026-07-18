const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:8000/api/v1`
    : "http://127.0.0.1:8000/api/v1");

export interface DashboardSummary {
  total_incidents: number;
  high_risk_districts: Array<{ district: string; incident_count: number }>;
  recent_trends: Record<string, number>;
}

export interface IncidentItem {
  id: string;
  case_number: string;
  crime_type: string;
  date_time: string;
  district: string;
  police_station: string;
  location_name: string;
  severity: string;
  status: string;
  latitude?: number;
  longitude?: number;
}

export interface IncidentsResponse {
  items: IncidentItem[];
  count: number;
  limit: number;
  offset: number;
}

export interface HotspotItem {
  cluster_id: number;
  district: string;
  crime_type: string;
  latitude: number;
  longitude: number;
  incident_count: number;
  score: number;
}

export interface RiskItem {
  district: string;
  risk_score: number;
  risk_category: string;
  incident_count: number;
  reason: string;
}

export interface AnomalyItem {
  id: string;
  case_number: string;
  crime_type: string;
  date_time: string;
  district: string;
  police_station: string;
  location_name: string;
  severity: string;
  anomaly_score: number;
  anomaly_type: string;
  reason: string;
}

export interface NetworkNode {
  id: string;
  type: "person" | "incident" | string;
  label: string;
}

export interface NetworkEdge {
  source: string;
  target: string;
  type: string;
}

export interface NetworkAnalysisResponse {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export interface DistrictItem {
  name: string;
  incident_count: number;
}

export interface PoliceStationItem {
  name: string;
  district: string;
  incident_count: number;
}

export interface AnalyzeIncidentResponse {
  hotspot_score: number;
  anomaly_flag: boolean;
  risk_category: string;
  explanation_text: string;
  explainable_insights: string[];
}

// Helper for safe fetch with demo fallbacks
async function fetchWithFallback<T>(
  endpoint: string,
  fallback: T,
  options?: RequestInit,
): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!res.ok) {
      console.warn(`[API] ${endpoint} returned status ${res.status}. Using fallback.`);
      return fallback;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API] Failed to fetch ${endpoint} (${err}). Using fallback.`);
    return fallback;
  }
}

export const api = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const fallback: DashboardSummary = {
      total_incidents: 18472,
      high_risk_districts: [
        { district: "Bengaluru Urban", incident_count: 5420 },
        { district: "Mysuru", incident_count: 2180 },
        { district: "Belagavi", incident_count: 1890 },
        { district: "Ballari", incident_count: 1450 },
        { district: "Dharwad", incident_count: 1210 },
      ],
      recent_trends: {
        Theft: 4520,
        "Vehicle Theft": 3810,
        Burglary: 2940,
        "Cyber Crime": 2410,
        Assault: 1850,
        Robbery: 1240,
      },
    };
    return fetchWithFallback<DashboardSummary>("/dashboard/summary", fallback);
  },

  async getIncidents(params?: {
    district?: string;
    crime_type?: string;
    police_station?: string;
    severity?: string;
    limit?: number;
    offset?: number;
  }): Promise<IncidentsResponse> {
    const query = new URLSearchParams();
    if (params?.district) query.append("district", params.district);
    if (params?.crime_type) query.append("crime_type", params.crime_type);
    if (params?.police_station) query.append("police_station", params.police_station);
    if (params?.severity) query.append("severity", params.severity);
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.offset) query.append("offset", params.offset.toString());

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const fallback: IncidentsResponse = {
      items: [
        {
          id: "uuid-1",
          case_number: "KA03-2026-0510-2456",
          crime_type: "Vehicle Theft",
          date_time: "2026-07-16T10:30:00Z",
          district: "Bengaluru Urban",
          police_station: "Koramangala PS",
          location_name: "Koramangala 4th Block",
          severity: "High",
          status: "Under Investigation",
        },
        {
          id: "uuid-2",
          case_number: "KA03-2026-0510-2455",
          crime_type: "Robbery",
          date_time: "2026-07-16T09:15:00Z",
          district: "Mysuru",
          police_station: "Mysuru City PS",
          location_name: "Devaraja Market Area",
          severity: "High",
          status: "Under Investigation",
        },
        {
          id: "uuid-3",
          case_number: "KA03-2026-0510-2454",
          crime_type: "Assault",
          date_time: "2026-07-16T08:45:00Z",
          district: "Dharwad",
          police_station: "Hubli East PS",
          location_name: "Vidyanagar Hubli",
          severity: "Medium",
          status: "Under Investigation",
        },
        {
          id: "uuid-4",
          case_number: "KA03-2026-0510-2453",
          crime_type: "Burglary",
          date_time: "2026-07-16T07:20:00Z",
          district: "Bengaluru Urban",
          police_station: "Yeshwanthpur PS",
          location_name: "Yeshwanthpur Industrial Suburb",
          severity: "Medium",
          status: "Registered",
        },
        {
          id: "uuid-5",
          case_number: "KA03-2026-0510-2452",
          crime_type: "Cyber Crime",
          date_time: "2026-07-16T06:00:00Z",
          district: "Bengaluru Urban",
          police_station: "Whitefield PS",
          location_name: "ITPL Tech Park Area",
          severity: "High",
          status: "Forwarded",
        },
        {
          id: "uuid-6",
          case_number: "KA03-2026-0510-2451",
          crime_type: "Fraud",
          date_time: "2026-07-15T22:30:00Z",
          district: "Belagavi",
          police_station: "Belagavi City PS",
          location_name: "College Road",
          severity: "Low",
          status: "Solved",
        },
      ],
      count: 18472,
      limit: params?.limit || 20,
      offset: params?.offset || 0,
    };
    return fetchWithFallback<IncidentsResponse>(`/incidents${queryString}`, fallback);
  },

  async getHotspots(params?: {
    district?: string;
    crime_type?: string;
    epsilon_km?: number;
    min_crimes?: number;
  }): Promise<{ hotspots: HotspotItem[] }> {
    const query = new URLSearchParams();
    if (params?.district) query.append("district", params.district);
    if (params?.crime_type) query.append("crime_type", params.crime_type);
    if (params?.epsilon_km) query.append("epsilon_km", params.epsilon_km.toString());
    if (params?.min_crimes) query.append("min_crimes", params.min_crimes.toString());

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const fallback = {
      hotspots: [
        {
          cluster_id: 1,
          district: "Bengaluru Urban",
          crime_type: "Vehicle Theft / Robbery",
          latitude: 12.9348,
          longitude: 77.62,
          incident_count: 84,
          score: 0.96,
        },
        {
          cluster_id: 2,
          district: "Mysuru",
          crime_type: "Burglary / Theft",
          latitude: 12.3052,
          longitude: 76.6554,
          incident_count: 52,
          score: 0.82,
        },
        {
          cluster_id: 3,
          district: "Bengaluru Urban",
          crime_type: "Chain Snatching",
          latitude: 13.0285,
          longitude: 77.5539,
          incident_count: 46,
          score: 0.78,
        },
        {
          cluster_id: 4,
          district: "Ballari",
          crime_type: "Assault / Narcotics",
          latitude: 15.1485,
          longitude: 76.9242,
          incident_count: 38,
          score: 0.68,
        },
        {
          cluster_id: 5,
          district: "Dharwad",
          crime_type: "Cyber Fraud / Theft",
          latitude: 15.3647,
          longitude: 75.124,
          incident_count: 32,
          score: 0.62,
        },
      ],
    };
    return fetchWithFallback<{ hotspots: HotspotItem[] }>(
      `/analytics/hotspots${queryString}`,
      fallback,
    );
  },

  async getRiskScores(): Promise<{ items: RiskItem[] }> {
    const fallback = {
      items: [
        {
          district: "Bengaluru Urban",
          risk_score: 0.92,
          risk_category: "High Risk",
          incident_count: 5420,
          reason:
            "High crime density (5420 incidents) exceeding the 66th percentile state threshold.",
        },
        {
          district: "Mysuru",
          risk_score: 0.84,
          risk_category: "High Risk",
          incident_count: 2180,
          reason: "Recent spike in burglary and urban theft clusters across central zones.",
        },
        {
          district: "Belagavi",
          risk_score: 0.78,
          risk_category: "High Risk",
          incident_count: 1890,
          reason: "Elevated non-heinous property offences across commercial sectors.",
        },
        {
          district: "Ballari",
          risk_score: 0.62,
          risk_category: "Medium Risk",
          incident_count: 1450,
          reason: "Moderate incident volume operating within normal baseline bounds.",
        },
        {
          district: "Dharwad",
          risk_score: 0.58,
          risk_category: "Medium Risk",
          incident_count: 1210,
          reason: "Stable crime frequency near educational and industrial hubs.",
        },
        {
          district: "Dakshina Kannada",
          risk_score: 0.45,
          risk_category: "Low Risk",
          incident_count: 820,
          reason: "Low incident volume well below state average.",
        },
      ],
    };
    return fetchWithFallback<{ items: RiskItem[] }>("/analytics/risk", fallback);
  },

  async getAnomalies(params?: {
    district?: string;
    limit?: number;
  }): Promise<{ anomalies: AnomalyItem[]; count: number }> {
    const query = new URLSearchParams();
    if (params?.district) query.append("district", params.district);
    if (params?.limit) query.append("limit", params.limit.toString());

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const fallback = {
      anomalies: [
        {
          id: "anom-1",
          case_number: "KA03-2026-9901",
          crime_type: "Robbery (Armed)",
          date_time: "2026-07-16T11:10:00Z",
          district: "Bengaluru Urban",
          police_station: "Koramangala PS",
          location_name: "8th Main Road",
          severity: "High",
          anomaly_score: 0.89,
          anomaly_type: "Rule-Based Critical Anomaly",
          reason: "Flagged: Robbery in Bengaluru Urban with High severity score and 3+ victims.",
        },
        {
          id: "anom-2",
          case_number: "KA03-2026-9902",
          crime_type: "Cyber Crime (Financial)",
          date_time: "2026-07-16T10:00:00Z",
          district: "Mysuru",
          police_station: "Mysuru City PS",
          location_name: "Tech Hub",
          severity: "High",
          anomaly_score: 0.82,
          anomaly_type: "Pattern Deviation",
          reason: "Flagged: Correlated syndicate pattern involving 5+ accused.",
        },
        {
          id: "anom-3",
          case_number: "KA03-2026-9903",
          crime_type: "Assault (Gang Coordinated)",
          date_time: "2026-07-16T08:30:00Z",
          district: "Ballari",
          police_station: "Ballari PS",
          location_name: "Highway Junction",
          severity: "High",
          anomaly_score: 0.78,
          anomaly_type: "Rule-Based Critical Anomaly",
          reason: "Flagged: Assault in Ballari involving multiple repeat offenders.",
        },
        {
          id: "anom-4",
          case_number: "KA03-2026-9904",
          crime_type: "Kidnapping",
          date_time: "2026-07-16T04:15:00Z",
          district: "Shivamogga",
          police_station: "Shivamogga PS",
          location_name: "Bus Stand Area",
          severity: "High",
          anomaly_score: 0.86,
          anomaly_type: "Rule-Based Critical Anomaly",
          reason: "Flagged: Heinous incident requiring urgent officer dispatch.",
        },
      ],
      count: 4,
    };
    return fetchWithFallback<{ anomalies: AnomalyItem[]; count: number }>(
      `/analytics/anomalies${queryString}`,
      fallback,
    );
  },

  async getNetworkAnalysis(entityId: string): Promise<NetworkAnalysisResponse> {
    const fallback: NetworkAnalysisResponse = {
      nodes: [
        { id: "person-1", type: "person", label: "Ramesh 'Bhai' Kumar (Repeat Suspect)" },
        { id: "person-2", type: "person", label: "Suresh Gowda (Syndicate Associate)" },
        { id: "person-3", type: "person", label: "Vikram Reddy (Known Receiver)" },
        { id: "person-4", type: "person", label: "Rajesh Sharma (Witness)" },
        { id: "incident-1", type: "incident", label: "FIR CASE-2026-BLR-101 (Vehicle Theft)" },
        { id: "incident-2", type: "incident", label: "FIR CASE-2026-MYS-202 (Burglary)" },
        { id: "incident-3", type: "incident", label: "FIR CASE-2026-DWR-303 (Cyber Fraud)" },
      ],
      edges: [
        { source: "person-1", target: "incident-1", type: "involved_in" },
        { source: "person-1", target: "incident-2", type: "involved_in" },
        { source: "person-2", target: "incident-1", type: "co_accused_with" },
        { source: "person-2", target: "person-1", type: "syndicate_link" },
        { source: "person-3", target: "incident-2", type: "receiver_of_stolen_goods" },
        { source: "person-4", target: "incident-1", type: "witnessed" },
        { source: "person-1", target: "incident-3", type: "suspected_mastermind" },
      ],
    };
    return fetchWithFallback<NetworkAnalysisResponse>(
      `/analytics/network/${encodeURIComponent(entityId)}`,
      fallback,
    );
  },

  async getDistricts(): Promise<{ items: DistrictItem[] }> {
    const fallback = {
      items: [
        { name: "Bengaluru Urban", incident_count: 5420 },
        { name: "Mysuru", incident_count: 2180 },
        { name: "Belagavi", incident_count: 1890 },
        { name: "Ballari", incident_count: 1450 },
        { name: "Dharwad", incident_count: 1210 },
        { name: "Dakshina Kannada", incident_count: 820 },
        { name: "Shivamogga", incident_count: 760 },
        { name: "Tumakuru", incident_count: 690 },
        { name: "Udupi", incident_count: 510 },
        { name: "Kalaburagi", incident_count: 480 },
      ],
    };
    return fetchWithFallback<{ items: DistrictItem[] }>("/geo/districts", fallback);
  },

  async getPoliceStations(district?: string): Promise<{ items: PoliceStationItem[] }> {
    const query = district ? `?district=${encodeURIComponent(district)}` : "";
    const fallback = {
      items: [
        { name: "Koramangala PS", district: "Bengaluru Urban", incident_count: 1240 },
        { name: "Yeshwanthpur PS", district: "Bengaluru Urban", incident_count: 980 },
        { name: "Whitefield PS", district: "Bengaluru Urban", incident_count: 850 },
        { name: "Mysuru City PS", district: "Mysuru", incident_count: 1120 },
        { name: "Devaraja PS", district: "Mysuru", incident_count: 740 },
        { name: "Hubli East PS", district: "Dharwad", incident_count: 680 },
        { name: "Ballari PS", district: "Ballari", incident_count: 790 },
      ],
    };
    return fetchWithFallback<{ items: PoliceStationItem[] }>(
      `/geo/police-stations${query}`,
      fallback,
    );
  },

  async getCases(): Promise<{ cases: Array<Record<string, any>> }> {
    return {
      cases: [
        {
          case_number: "CASE-2026-BLR-101",
          title: "Bengaluru vehicle theft ring",
          district: "Bengaluru Urban",
          crime_type: "Vehicle Theft",
          lead_officer: "Insp. R. Sharma",
          team_size: 6,
          progress: 72,
          status: "Active",
          priority: "High",
        },
        {
          case_number: "CASE-2026-MYS-201",
          title: "Mysuru burglary series",
          district: "Mysuru",
          crime_type: "Burglary",
          lead_officer: "SI. K. Naidu",
          team_size: 4,
          progress: 45,
          status: "Active",
          priority: "Medium",
        },
      ],
    };
  },

  async analyzeIncident(payload: Record<string, any>): Promise<AnalyzeIncidentResponse> {
    const fallback: AnalyzeIncidentResponse = {
      hotspot_score: 8.5,
      anomaly_flag: true,
      risk_category: "High Risk",
      explanation_text: `CRITICAL ALERT in ${payload.District_Name || payload.district || "Bengaluru Urban"}: High-priority anomaly due to severity and victim volume. Hotspot score: 8.5/10.`,
      explainable_insights: [
        `Unusual pattern: ${payload.District_Name || payload.district || "Bengaluru Urban"} is operating above historical safety norms (Top tier volume).`,
        "Repeated incidents: Database confirms high historical density logged in this jurisdiction.",
        `Recent spike: Incident involves elevated victim/accused count (${payload["VICTIM COUNT"] || 3} victims, ${payload["Accused Count"] || 2} accused), deviating from baseline profiles.`,
        "Entity relationships: Connected accused individuals identified, suggesting a coordinated event.",
      ],
    };
    return fetchWithFallback<AnalyzeIncidentResponse>("/analytics/analyze", fallback, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
};
