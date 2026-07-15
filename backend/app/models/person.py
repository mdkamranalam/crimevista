import uuid
from sqlalchemy import Column, String, Integer
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base

class Person(Base):
    __tablename__ = "persons"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(150), index=True, nullable=False)
    role = Column(String(50), index=True, nullable=False) # Suspect, Victim, Witness
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    alias = Column(String(100), nullable=True)
