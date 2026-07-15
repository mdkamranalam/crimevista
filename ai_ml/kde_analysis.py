import folium
from pathlib import Path
from folium.plugins import HeatMap

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

# ------------------------------------

center_lat = df[lat_col].mean()
center_lon = df[lon_col].mean()

crime_map = folium.Map(
    location=[center_lat, center_lon], 
    zoom_start=11, 
    tiles='cartodbdark_matter'
)

heat_data = [[row[lat_col], row[lon_col]] for index, row in df.iterrows()]

HeatMap(
    heat_data,
    radius=15,       
    blur=10,
    min_opacity=0.4,
    gradient={0.4: 'blue', 0.65: 'lime', 1: 'red'}
).add_to(crime_map)

output_name = 'hotspot_map.html'
crime_map.save(output_name)

print(f"✅ Map generated successfully! Open '{output_name}' in your browser.")