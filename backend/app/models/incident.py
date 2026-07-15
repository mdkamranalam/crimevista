import uuid
from sqlalchemy import Column, String, Float, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geometry
from app.db.session import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_number = Column(String(100), index=True)
    crime_type = Column(String(150), index=True, nullable=False)
    date_time = Column(DateTime, index=True, nullable=False)
    district = Column(String(100), index=True, nullable=False)
    police_station = Column(String(150), index=True, nullable=False)
    location_name = Column(Text)
    geom = Column(Geometry(geometry_type='POINT', srid=4326), nullable=True)
    latitude = Column(Float)
    longitude = Column(Float)
    severity = Column(String(50), index=True) # High, Medium, Low
    status = Column(String(50), index=True)   # Open, Closed, Under Investigation
