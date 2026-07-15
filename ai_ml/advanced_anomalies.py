import pandas as pd
import folium
from sklearn.neighbors import LocalOutlierFactor

# 1. Load the dataset
file_path = r'E:\Programming\crimevista\data\FIR_Details_Data.csv'
df = pd.read_csv(file_path, low_memory=False)

lat_col = 'Latitude'
lon_col = 'Longitude'
month_col = 'FIR_MONTH'
victim_col = 'VICTIM COUNT'
accused_col = 'Accused Count'

# 2. Data Cleaning & Tighter Bounding Box
df = df.dropna(subset=[lat_col, lon_col, month_col])
df[victim_col] = pd.to_numeric(df[victim_col], errors='coerce').fillna(0)
df[accused_col] = pd.to_numeric(df[accused_col], errors='coerce').fillna(0)

min_lat, max_lat = 11.6, 18.3
min_lon, max_lon = 74.2, 78.3
df = df[(df[lat_col] >= min_lat) & (df[lat_col] <= max_lat)]
df = df[(df[lon_col] >= min_lon) & (df[lon_col] <= max_lon)]

# Sample data for performance
if len(df) > 5000:
    df = df.sample(n=5000, random_state=42)

# ==========================================
# 3. TECHNIQUE 1: Simple Rule-Based MVP
# ==========================================
# Flag high severity incidents directly without ML.
def apply_rules(row):
    # Rule: If a single incident has 3 or more victims, or 5 or more accused, it's critical.
    if row[victim_col] >= 3 or row[accused_col] >= 5:
        return True
    return False

df['Rule_Anomaly'] = df.apply(apply_rules, axis=1)

# ==========================================
# 4. TECHNIQUE 2: Local Outlier Factor (LOF)
# ==========================================
# Finds geographic outliers (crimes in usually safe/isolated areas)
lof = LocalOutlierFactor(n_neighbors=20, contamination=0.02)
# We train LOF strictly on coordinates for spatial anomalies
df['LOF_Anomaly'] = lof.fit_predict(df[[lat_col, lon_col]])

# ==========================================
# 5. Visualization Map
# ==========================================
center_lat = df[lat_col].mean()
center_lon = df[lon_col].mean()
final_map = folium.Map(location=[center_lat, center_lon], zoom_start=7, tiles='cartodbdark_matter')

for index, row in df.iterrows():
    # Priority 1: Rule-Based Critical Anomaly (Bright Red)
    if row['Rule_Anomaly']:
        folium.CircleMarker(
            location=[row[lat_col], row[lon_col]],
            radius=6, color='red', fill=True, fill_color='red', fill_opacity=0.9, weight=1,
            popup=f"CRITICAL RULE FLAG\nVictims: {row[victim_col]}\nAccused: {row[accused_col]}"
        ).add_to(final_map)
        
    # Priority 2: LOF Spatial Anomaly (Orange)
    elif row['LOF_Anomaly'] == -1:
        folium.CircleMarker(
            location=[row[lat_col], row[lon_col]],
            radius=5, color='orange', fill=True, fill_color='orange', fill_opacity=0.8, weight=1,
            popup=f"SPATIAL OUTLIER (LOF)\nIsolated Crime Event"
        ).add_to(final_map)
        
    # Normal Data (Cyan)
    else:
        folium.CircleMarker(
            location=[row[lat_col], row[lon_col]],
            radius=3, color='#00FFFF', fill=True, fill_color='#00FFFF', fill_opacity=0.4, weight=0.5
        ).add_to(final_map)

# 6. Save the Output
output_name = 'advanced_anomalies_map.html'
final_map.save(output_name)

print("✅ Analysis Complete!")
print(f"🚨 Rule-Based Critical Flags: {df['Rule_Anomaly'].sum()}")
print(f"📍 LOF Spatial Anomalies: {len(df[df['LOF_Anomaly'] == -1])}")
print(f"Map generated successfully! Open '{output_name}' in your browser.")