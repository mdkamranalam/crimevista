import pandas as pd
import folium
from sklearn.ensemble import RandomForestClassifier

# 1. Load and clean data
file_path = r'E:\Programming\crimevista\data\FIR_Details_Data.csv'
df = pd.read_csv(file_path, low_memory=False)

lat_col = 'Latitude'
lon_col = 'Longitude'
district_col = 'District_Name'

df = df.dropna(subset=[lat_col, lon_col, district_col])

# Bounding Box (Karnataka)
min_lat, max_lat = 11.6, 18.3
min_lon, max_lon = 74.6, 78.3
df = df[(df[lat_col] >= min_lat) & (df[lat_col] <= max_lat)]
df = df[(df[lon_col] >= min_lon) & (df[lon_col] <= max_lon)]

# 2. Feature Engineering: Calculate historical crime counts per district
district_stats = df.groupby(district_col).size().reset_index(name='Total_Crimes')

# Define Risk Levels based on percentiles
low_thresh = district_stats['Total_Crimes'].quantile(0.33)
high_thresh = district_stats['Total_Crimes'].quantile(0.66)

def assign_risk(count):
    if count >= high_thresh:
        return 'High Risk'
    elif count >= low_thresh:
        return 'Medium Risk'
    else:
        return 'Low Risk'

district_stats['Risk_Label'] = district_stats['Total_Crimes'].apply(assign_risk)

# Get the geographic center of each district for plotting
district_coords = df.groupby(district_col)[[lat_col, lon_col]].mean().reset_index()
district_data = pd.merge(district_stats, district_coords, on=district_col)

# 3. Machine Learning: Random Forest Classification
# We train the model to classify risk based on geographic features and historical volume
X = district_data[[lat_col, lon_col, 'Total_Crimes']]
y = district_data['Risk_Label']

# Initialize and fit the model
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X, y)

# Generate predictions
district_data['Predicted_Risk'] = rf_model.predict(X)

# 4. Visualize the Risk Map
center_lat = df[lat_col].mean()
center_lon = df[lon_col].mean()
risk_map = folium.Map(location=[center_lat, center_lon], zoom_start=7, tiles='cartodbdark_matter')

# Color mapping for risk levels
color_map = {'High Risk': 'red', 'Medium Risk': 'orange', 'Low Risk': 'green'}

for index, row in district_data.iterrows():
    risk = row['Predicted_Risk']
    folium.CircleMarker(
        location=[row[lat_col], row[lon_col]],
        radius=12,
        color=color_map[risk],
        fill=True,
        fill_color=color_map[risk],
        fill_opacity=0.7,
        popup=f"<b>District:</b> {row[district_col]}<br><b>Predicted Risk:</b> {risk}<br><b>Historical Crimes:</b> {row['Total_Crimes']}"
    ).add_to(risk_map)

# 5. Export and Save
output_name = 'predictive_risk_map.html'
risk_map.save(output_name)

print("✅ Predictive Risk Scoring Complete!")
print(f"Map generated successfully! Open '{output_name}' in your browser.")