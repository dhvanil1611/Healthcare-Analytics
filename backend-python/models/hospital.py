from sqlalchemy import Column, String, Integer, Numeric
from sqlalchemy.dialects.postgresql import UUID
from database.database import Base
import uuid

class Hospital(Base):
    __tablename__ = "hospitals"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    address = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255), nullable=True)
    specialization = Column(String(255), nullable=True)
    rating = Column(Numeric(3, 2), nullable=True)
    image_url = Column(String(255), nullable=True)
