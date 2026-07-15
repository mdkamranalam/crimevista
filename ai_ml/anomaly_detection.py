import pandas as pd
import folium
from sklearn.ensemble import IsolationForest

# 1. Load the dataset
file_path = r'E:\Programming\crimevista\data\FIR_Details_Data.csv'
df = pd.read_csv(file_path, low_memory=False)

lat_col = 'Latitude'
lon_col = 'Longitude'
month_col = 'FIR_MONTH'
victim_col = 'VICTIM COUNT'
accused_col = 'Accused Count'

# 2. Data Cleaning
df = df.dropna(subset=[lat_col, lon_col, month_col])
df[victim_col] = pd.to_numeric(df[victim_col], errors='coerce').fillna(0)
df[accused_col] = pd.to_numeric(df[accused_col], errors='coerce').fillna(0)

# TIGHTER Bounding Box to cut off border states (Maharashtra/AP/Goa overlap)
min_lat, max_lat = 11.6, 18.3
min_lon, max_lon = 74.2, 78.3
df = df[(df[lat_col] >= min_lat) & (df[lat_col] <= max_lat)]
df = df[(df[lon_col] >= min_lon) & (df[lon_col] <= max_lon)]

if len(df) > 5000:
    df = df.sample(n=5000, random_state=42)

# 3. Train Isolation Forest
features = df[[month_col, victim_col, accused_col]]
iso_forest = IsolationForest(contamination=0.02, random_state=42)
df['Anomaly_Score'] = iso_forest.fit_predict(features)

# 4. Visualize
center_lat = df[lat_col].mean()
center_lon = df[lon_col].mean()
anomaly_map = folium.Map(location=[center_lat, center_lon], zoom_start=7, tiles='cartodbdark_matter')

for index, row in df.iterrows():
    if row['Anomaly_Score'] == -1:
        folium.CircleMarker(
            location=[row[lat_col], row[lon_col]],
            radius=6,
            color='red',
            fill=True,
            fill_color='red',
            fill_opacity=0.9,
            weight=1, # Added solid border
            popup=f"ANOMALY\nVictims: {row[victim_col]}\nAccused: {row[accused_col]}\nMonth: {row[month_col]}"
        ).add_to(anomaly_map)
    else:
        # VISUAL FIX: Bigger radius, brighter color, and visible borders
        folium.CircleMarker(
            location=[row[lat_col], row[lon_col]],
            radius=3,         # Increased from 1 to 3
            color='#00FFFF',  # Brighter Neon Cyan
            fill=True,
            fill_color='#00FFFF',
            fill_opacity=0.4, # Increased opacity
            weight=0.5        # Added a thin border so it doesn't vanish
        ).add_to(anomaly_map)

# 5. Save the Output
output_name = 'isolation_forest_anomalies.html'
anomaly_map.save(output_name)

print(f"✅ Map generated successfully! Open '{output_name}' in your browser.")