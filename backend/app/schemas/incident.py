from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class IncidentResponse(BaseModel):
    id: UUID
    case_number: Optional[str] = None
    crime_type: str
    date_time: datetime
    district: str
    police_station: str
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    severity: Optional[str] = None
    status: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class PaginatedIncidents(BaseModel):
    items: List[IncidentResponse]
    count: int
    limit: int
    offset: int
