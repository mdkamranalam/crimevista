import uuid
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base

class Relationship(Base):
    __tablename__ = "relationships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_type = Column(String(50), nullable=False) # Incident, Person, Location
    source_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    target_type = Column(String(50), nullable=False) # Incident, Person, Location
    target_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    relation_type = Column(String(100), nullable=False) # involved_in, co_accused, repeat_offender_at
