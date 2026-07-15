import folium
from pathlib import Path
from folium.plugins import HeatMapWithTime

from data_utils import DatasetError, load_crime_dataframe

project_root = Path(__file__).resolve().parent.parent
data_path = project_root / 'data' / 'FIR_Details_Data.csv'

try:
    df, lat_col, lon_col, time_col = load_crime_dataframe(data_path, require_time_column=True)
except DatasetError as exc:
    raise SystemExit(str(exc)) from exc

df = df.dropna(subset=[lat_col, lon_col, time_col])

min_lat, max_lat = 11.5, 18.5
min_lon, max_lon = 74.0, 78.5
df = df[(df[lat_col] >= min_lat) & (df[lat_col] <= max_lat)]
df = df[(df[lon_col] >= min_lon) & (df[lon_col] <= max_lon)]

df = df.sort_values(by=time_col)

time_index = list(df[time_col].astype(str).unique())
heat_data = []

for month in df[time_col].unique():
    month_data = df[df[time_col] == month]
    coords = month_data[[lat_col, lon_col]].values.tolist()
    heat_data.append(coords)

center_lat = df[lat_col].mean()
center_lon = df[lon_col].mean()
crime_map = folium.Map(
    location=[center_lat, center_lon], 
    zoom_start=7, 
    tiles='cartodbdark_matter'
)

HeatMapWithTime(
    heat_data,
    index=time_index,   # Labels for the play slider
    auto_play=True,     # Starts playing automatically
    radius=20,          # Size of the hotspot
    min_opacity=0.3,
    gradient={0.4: 'blue', 0.65: 'lime', 1: 'red'}
).add_to(crime_map)

output_name = 'spatio_temporal_map.html'
crime_map.save(output_name)

print(f"✅ Spatio-Temporal map generated! Open '{output_name}' in your browser.")