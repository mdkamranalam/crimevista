import numpy as np
import folium
import pandas as pd
from pathlib import Path
from sklearn.cluster import DBSCAN

from data_utils import DatasetError, load_crime_dataframe

project_root = Path(__file__).resolve().parent.parent
data_path = project_root / 'data' / 'FIR_Details_Data.csv'

try:
    df, lat_col, lon_col = load_crime_dataframe(data_path)
except DatasetError as exc:
    raise SystemExit(str(exc)) from exc


df = df.dropna(subset=[lat_col, lon_col])

min_lat, max_lat = 11.5, 18.5
min_lon, max_lon = 74.0, 78.5

df = df[(df[lat_col] >= min_lat) & (df[lat_col] <= max_lat)]
df = df[(df[lon_col] >= min_lon) & (df[lon_col] <= max_lon)]

if len(df) > 5000:
    df = df.sample(n=5000, random_state=42)

coords = df[[lat_col, lon_col]].values
coords_radians = np.radians(coords)

epsilon_km = 0.5
earth_radius_km = 6371.0088
eps_radians = epsilon_km / earth_radius_km

min_crimes = 10

db = DBSCAN(eps=eps_radians, min_samples=min_crimes, algorithm='ball_tree', metric='haversine')
cluster_labels = db.fit_predict(coords_radians)

df['Cluster'] = cluster_labels

center_lat = df[lat_col].mean()
center_lon = df[lon_col].mean()
cluster_map = folium.Map(location=[center_lat, center_lon], zoom_start=12, tiles='cartodbdark_matter')

colors = ['red', 'blue', 'green', 'purple', 'orange', 'darkred', 'lightred', 'beige', 'darkblue', 'darkgreen', 'cadetblue', 'darkpurple', 'white', 'pink', 'lightblue', 'lightgreen', 'gray', 'black', 'lightgray']

for index, row in df.head(5000).iterrows():
    cluster_id = row['Cluster']
    
    if cluster_id == -1:
        color = 'gray'
        radius = 1
        fill_opacity = 0.3
    else:
        color = colors[cluster_id % len(colors)]
        radius = 4
        fill_opacity = 0.8

    folium.CircleMarker(
        location=[row[lat_col], row[lon_col]],
        radius=radius,
        color=color,
        fill=True,
        fill_color=color,
        fill_opacity=fill_opacity,
        weight=0
    ).add_to(cluster_map)

output_name = 'dbscan_hotspots.html'
cluster_map.save(output_name)

total_clusters = len(set(cluster_labels)) - (1 if -1 in cluster_labels else 0)
total_noise = list(cluster_labels).count(-1)

print(f"Machine Learning Analysis Complete:")
print(f"- Total Hotspots (Clusters) Detected: {total_clusters}")
print(f"- Isolated Crimes (Noise): {total_noise}")
print(f"Map generated successfully! Open '{output_name}' in your browser.")