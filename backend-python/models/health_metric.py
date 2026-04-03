from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database.database import Base
import uuid

class HealthMetric(Base):
    __tablename__ = "health_metrics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    type = Column(String(100), nullable=False)  # glucose, bmi, etc.
    value = Column(Numeric(10, 2), nullable=False)
    unit = Column(String(50), nullable=False)
    date = Column(DateTime, nullable=False)
    
    # Relationship
    user = relationship("User", back_populates="health_metrics")
