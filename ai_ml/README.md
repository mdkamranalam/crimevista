# CrimeVista AI/ML Analysis Guide

This folder contains Python scripts for analyzing crime incident data and generating interactive hotspot maps.

## What is inside this folder?

- db_analysis.py: Uses DBSCAN clustering to identify hotspot clusters from crime coordinates.
- kde_analysis.py: Creates a heatmap of crime density across Karnataka.
- temporal_analysis.py: Builds a time-based heatmap with a slider for monthly crime patterns.
- requirements.txt: Python dependencies required to run the scripts.
- Generated HTML outputs: dbscan_hotspots.html, hotspot_map.html, and spatio_temporal_map.html.

## Prerequisites

Make sure you have Python 3.9+ installed.

## Setup

1. Open a terminal in the project root.
2. Create and activate a virtual environment (recommended):

   Windows:

   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```

   Linux/macOS:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install the dependencies:

   ```bash
   pip install -r ai_ml/requirements.txt
   ```

## Dataset

The scripts expect the dataset at:

- data/FIR_Details_Data.csv

If the file is missing, the scripts will raise an error explaining the missing path.

## How to run each script

### 1. DBSCAN hotspot analysis

Run:

```bash
python ai_ml/db_analysis.py
```

This will:

- load the FIR dataset,
- filter the data to Karnataka coordinates,
- run DBSCAN clustering,
- generate dbscan_hotspots.html.

### 2. Static hotspot heatmap

Run:

```bash
python ai_ml/kde_analysis.py
```

This will generate:

- hotspot_map.html

### 3. Spatio-temporal hotspot map

Run:

```bash
python ai_ml/temporal_analysis.py
```

This will generate:

- spatio_temporal_map.html

## Output files

After running the scripts, the generated HTML files will appear in the ai_ml folder:

- ai_ml/dbscan_hotspots.html
- ai_ml/hotspot_map.html
- ai_ml/spatio_temporal_map.html

Open them in your browser to inspect the maps.

## Notes

- The scripts currently focus on Karnataka coordinate ranges to avoid invalid map points.
- The DBSCAN script uses a small clustering radius and a minimum cluster size, so it is suitable for exploratory hotspot detection.
- If you want to analyze a larger subset of data, you may need to adjust the sampling logic in the scripts.

## Recommended workflow

1. Run the static heatmap script first to inspect general hotspot concentration.
2. Run the DBSCAN script to detect distinct clusters.
3. Run the temporal analysis script to understand how hotspots evolve over time.

## Troubleshooting

- If Python cannot find the dataset, confirm that data/FIR_Details_Data.csv exists in the project root.
- If the scripts report that the file is a Git LFS pointer, the actual CSV is not present locally. Run:

  ```bash
  git lfs pull
  ```

  from the repository root, or restore the dataset from the project source.

- If a module is missing, reinstall dependencies with:

  ```bash
  pip install -r ai_ml/requirements.txt
  ```

- If the scripts run slowly, reduce the sample size by editing the relevant DataFrame sampling block in the script.
