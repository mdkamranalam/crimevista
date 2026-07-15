from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.incident import Incident
from app.schemas.incident import IncidentResponse, PaginatedIncidents

router = APIRouter()

@router.get("/incidents", response_model=PaginatedIncidents)
def list_incidents(
    crime_type: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    police_station: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    limit: int = Query(50, le=500),
    offset: int = Query(0),
    db: Session = Depends(get_db)
):
    query = db.query(Incident)
    if crime_type:
        query = query.filter(Incident.crime_type.ilike(f"%{crime_type}%"))
    if district:
        query = query.filter(Incident.district.ilike(f"%{district}%"))
    if police_station:
        query = query.filter(Incident.police_station.ilike(f"%{police_station}%"))
    if severity:
        query = query.filter(Incident.severity == severity)
        
    total = query.count()
    items = query.order_by(Incident.date_time.desc()).offset(offset).limit(limit).all()
    return {"items": items, "count": total, "limit": limit, "offset": offset}
