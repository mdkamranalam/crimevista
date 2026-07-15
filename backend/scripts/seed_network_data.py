import sys
import uuid
from pathlib import Path
from datetime import datetime
backend_dir = str(Path(__file__).resolve().parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from sqlalchemy import text
from app.db.session import engine, Base, SessionLocal
from app.models import Incident, Person, Relationship

def seed_network():
    print("Ensuring database tables exist...")
    with engine.begin() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if we already seeded demo persons
        existing_person = db.query(Person).filter(Person.full_name == "Ramesh 'Bhai' Kumar").first()
        if existing_person:
            print("Demo network relationships and persons already seeded. Skipping...")
            return

        print("Seeding realistic criminological network profiles and repeat offenders...")

        # 1. Create demo persons (Suspects, Victims, Witnesses)
        p1 = Person(id=uuid.uuid4(), full_name="Ramesh 'Bhai' Kumar", role="Suspect", age=34, gender="Male", alias="Bhai")
        p2 = Person(id=uuid.uuid4(), full_name="Suresh Gowda", role="Suspect", age=29, gender="Male", alias="Surya")
        p3 = Person(id=uuid.uuid4(), full_name="Vikram Reddy", role="Suspect", age=41, gender="Male", alias="Vicky")
        p4 = Person(id=uuid.uuid4(), full_name="Rajesh Sharma", role="Victim", age=45, gender="Male", alias=None)
        p5 = Person(id=uuid.uuid4(), full_name="Ananya Rao", role="Victim", age=38, gender="Female", alias=None)
        p6 = Person(id=uuid.uuid4(), full_name="Manjunath K.", role="Witness", age=52, gender="Male", alias=None)

        db.add_all([p1, p2, p3, p4, p5, p6])
        db.commit()

        # 2. Get existing incidents from DB or insert mock incidents if DB is empty
        incidents = db.query(Incident).limit(3).all()
        if len(incidents) < 3:
            print("Inserting demo incidents for network seeding...")
            inc1 = Incident(
                id=uuid.uuid4(), case_number="CASE-2026-BLR-101", crime_type="Heinous Theft & Burglary",
                date_time=datetime(2026, 6, 10, 23, 15), district="Bengaluru Urban", police_station="Indiranagar PS",
                location_name="100 Feet Road Commercial Zone", latitude=12.9784, longitude=77.6408,
                severity="High", status="Under Investigation"
            )
            inc2 = Incident(
                id=uuid.uuid4(), case_number="CASE-2026-BLR-102", crime_type="Armed Robbery",
                date_time=datetime(2026, 6, 18, 2, 30), district="Bengaluru Urban", police_station="Koramangala PS",
                location_name="80 Feet Road Junction", latitude=12.9352, longitude=77.6245,
                severity="High", status="Open"
            )
            inc3 = Incident(
                id=uuid.uuid4(), case_number="CASE-2026-MYS-201", crime_type="Extortion & Intimidation",
                date_time=datetime(2026, 7, 1, 14, 0), district="Mysuru", police_station="Narasimharaja PS",
                location_name="Mysuru Highway Transit Corridor", latitude=12.3106, longitude=76.6635,
                severity="Medium", status="Open"
            )
            db.add_all([inc1, inc2, inc3])
            db.commit()
            incidents = [inc1, inc2, inc3]

        inc1, inc2, inc3 = incidents[0], incidents[1], incidents[2]

        # 3. Create graph relationships (Link Analysis)
        rels = [
            # Ramesh involved in Inc 1 & Inc 2 (Repeat Offender across jurisdictions!)
            Relationship(source_type="person", source_id=p1.id, target_type="incident", target_id=inc1.id, relation_type="involved_in"),
            Relationship(source_type="person", source_id=p1.id, target_type="incident", target_id=inc2.id, relation_type="involved_in"),
            # Suresh is co-accused with Ramesh in Inc 1
            Relationship(source_type="person", source_id=p2.id, target_type="incident", target_id=inc1.id, relation_type="involved_in"),
            Relationship(source_type="person", source_id=p1.id, target_type="person", target_id=p2.id, relation_type="co_accused"),
            # Rajesh Sharma was victim in Inc 1
            Relationship(source_type="person", source_id=p4.id, target_type="incident", target_id=inc1.id, relation_type="victim_of"),
            # Vikram Reddy involved in Inc 2 & Inc 3 (Inter-district network!)
            Relationship(source_type="person", source_id=p3.id, target_type="incident", target_id=inc2.id, relation_type="involved_in"),
            Relationship(source_type="person", source_id=p3.id, target_type="incident", target_id=inc3.id, relation_type="involved_in"),
            Relationship(source_type="person", source_id=p1.id, target_type="person", target_id=p3.id, relation_type="syndicate_associate"),
            # Ananya Rao victim in Inc 2
            Relationship(source_type="person", source_id=p5.id, target_type="incident", target_id=inc2.id, relation_type="victim_of"),
            # Manjunath witnessed Inc 1
            Relationship(source_type="person", source_id=p6.id, target_type="incident", target_id=inc1.id, relation_type="witnessed")
        ]

        db.add_all(rels)
        db.commit()
        print("✅ Successfully seeded demo criminological network relationships!")
        print(f"👉 Example Entity ID to query network endpoint: {inc1.case_number} or {p1.id}")

    finally:
        db.close()

if __name__ == "__main__":
    seed_network()
