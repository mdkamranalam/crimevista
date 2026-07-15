import sys
import time
import pandas as pd
from pathlib import Path
from datetime import datetime
backend_dir = str(Path(__file__).resolve().parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from sqlalchemy import text
from app.db.session import engine, Base
from app.models import Incident, Person, Relationship

def run_ingestion():
    print("Initiating database tables and extensions...")
    with engine.begin() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
    Base.metadata.create_all(bind=engine)

    data_path = Path(__file__).resolve().parent.parent.parent / "data" / "FIR_Details_Data.csv"
    if not data_path.exists():
        raise FileNotFoundError(f"Dataset not found at {data_path}")

    chunk_size = 50000
    total_processed = 0
    start_time = time.time()

    print(f"Reading {data_path} in chunks of {chunk_size}...")
    for chunk in pd.read_csv(data_path, chunksize=chunk_size, low_memory=False):
        # 1. Filter valid Karnataka coordinates
        chunk = chunk.dropna(subset=['Latitude', 'Longitude'])
        chunk = chunk[
            (chunk['Latitude'] >= 11.5) & (chunk['Latitude'] <= 18.5) &
            (chunk['Longitude'] >= 74.0) & (chunk['Longitude'] <= 78.5)
        ]
        if chunk.empty:
            continue

        # 2. Derive date_time
        def parse_date(row):
            try:
                year = int(row['FIR_YEAR']) if not pd.isna(row['FIR_YEAR']) else 2023
                month = int(row['FIR_MONTH']) if not pd.isna(row['FIR_MONTH']) else 1
                day = int(str(row['FIR_Day'])[:2]) if not pd.isna(row['FIR_Day']) else 1
                return datetime(year, max(1, min(12, month)), max(1, min(28, day)))
            except Exception:
                return datetime(2023, 1, 1)

        chunk['parsed_date'] = chunk.apply(parse_date, axis=1)

        # 3. Map severity and status
        chunk['severity'] = chunk['FIR Type'].apply(lambda x: 'High' if str(x).lower() == 'heinous' else 'Medium')
        chunk['status'] = chunk['FIR_Stage'].apply(
            lambda x: 'Closed' if any(w in str(x).lower() for w in ['convicted', 'chargesheeted']) else 'Open'
        )

        # 4. Prepare batch dictionaries
        mappings = []
        for _, row in chunk.iterrows():
            lat, lon = float(row['Latitude']), float(row['Longitude'])
            mappings.append({
                "case_number": str(row.get('KGID', '')),
                "crime_type": str(row.get('CrimeHead_Name') or row.get('CrimeGroup_Name', 'Unknown')),
                "date_time": row['parsed_date'],
                "district": str(row.get('District_Name', 'Unknown')),
                "police_station": str(row.get('UnitName', 'Unknown')),
                "location_name": str(row.get('Place of Offence', '')),
                "latitude": lat,
                "longitude": lon,
                "geom": f"SRID=4326;POINT({lon} {lat})",
                "severity": row['severity'],
                "status": row['status']
            })

        # 5. Bulk insert mappings
        with engine.begin() as conn:
            conn.execute(Incident.__table__.insert(), mappings)

        total_processed += len(mappings)
        print(f"Inserted {total_processed:,} records in {time.time() - start_time:.2f}s...")

    print(f"Ingestion complete! Total valid incidents loaded: {total_processed:,}")

if __name__ == "__main__":
    run_ingestion()
