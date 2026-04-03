from sqlalchemy import Column, String, Integer, Boolean, DateTime, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database.database import Base
import uuid

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Personal Details
    patient_name = Column(String(255), nullable=True)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=True)  # Male, Female, Other
    pregnancies = Column(Integer, nullable=True)  # Only for females
    
    # Medical Measurements
    systolic_bp = Column(Integer, nullable=True)
    diastolic_bp = Column(Integer, nullable=True)
    bmi = Column(Numeric(10, 2), nullable=False)
    hba1c = Column(Numeric(10, 2), nullable=True)
    fasting_glucose = Column(Numeric(10, 2), nullable=True)
    family_history = Column(Boolean, default=False)
    
    # Legacy fields (kept for backward compatibility)
    diastolic_blood_pressure = Column(Integer, nullable=True)
    serum_insulin = Column(Numeric(10, 2), nullable=True)
    skin_fold_thickness = Column(Integer, nullable=True)
    
    # Lifestyle Factors
    physical_activity = Column(String(50), nullable=True)  # No Activity, Little Activity, Moderate Activity, High Activity
    smoking = Column(Boolean, nullable=True)
    alcohol = Column(Boolean, nullable=True)
    
    # Symptoms
    excessive_thirst = Column(Boolean, nullable=True)
    frequent_urination = Column(Boolean, nullable=True)
    sudden_weight_loss = Column(Boolean, nullable=True)
    
    # Results
    risk_level = Column(String(50), nullable=False)  # Low, Moderate, High
    probability = Column(Numeric(5, 4), nullable=False)
    
    created_at = Column(DateTime, nullable=False)
    
    # Relationship
    user = relationship("User", back_populates="predictions")
