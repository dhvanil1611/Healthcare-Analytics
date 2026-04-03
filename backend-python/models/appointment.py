from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database.database import Base
import uuid

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    doctor_name = Column(String(255), nullable=False)
    specialization = Column(String(255), nullable=False)
    date = Column(Date, nullable=False)
    time = Column(String(50), nullable=False)
    status = Column(String(50), default="Pending")  # Pending, Confirmed, Completed
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False)
    
    # Relationship
    user = relationship("User", back_populates="appointments")
