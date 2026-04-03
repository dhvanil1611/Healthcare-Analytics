from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Legacy prediction schemas
class PredictionCreate(BaseModel):
    diastolic_blood_pressure: Optional[int] = None
    bmi: float
    serum_insulin: Optional[float] = None
    skin_fold_thickness: Optional[int] = None
    age: int
    family_history: bool = False

class PredictionResponse(BaseModel):
    id: str
    user_id: str
    patient_name: Optional[str] = None
    age: int
    gender: Optional[str] = None
    pregnancies: Optional[int] = None
    systolic_bp: Optional[int] = None
    diastolic_bp: Optional[int] = None
    bmi: float
    hba1c: Optional[float] = None
    fasting_glucose: Optional[float] = None
    family_history: bool
    diastolic_blood_pressure: Optional[int] = None
    serum_insulin: Optional[float] = None
    skin_fold_thickness: Optional[int] = None
    physical_activity: Optional[str] = None
    smoking: Optional[bool] = None
    alcohol: Optional[bool] = None
    excessive_thirst: Optional[bool] = None
    frequent_urination: Optional[bool] = None
    sudden_weight_loss: Optional[bool] = None
    risk_level: str
    probability: float
    created_at: datetime

# Assessment schemas
class AssessmentCreate(BaseModel):
    patient_name: Optional[str] = None
    age: int
    gender: str
    pregnancies: Optional[int] = None
    systolic_bp: Optional[int] = None
    diastolic_bp: Optional[int] = None
    bmi: float
    hba1c: Optional[float] = None
    fasting_glucose: float
    family_history: bool = False
    physical_activity: Optional[str] = None
    smoking: Optional[bool] = None
    alcohol: Optional[bool] = None
    excessive_thirst: Optional[bool] = None
    frequent_urination: Optional[bool] = None
    sudden_weight_loss: Optional[bool] = None
    # Legacy fields for backward compatibility
    diastolic_blood_pressure: Optional[int] = None
    serum_insulin: Optional[float] = None
    skin_fold_thickness: Optional[int] = None

class AssessmentResponse(PredictionResponse):
    risk_score: Optional[int] = None
    risk_factors: Optional[List[str]] = []
    recommendations: Optional[List[str]] = []

class PredictionHistoryResponse(BaseModel):
    id: str
    patient_name: Optional[str] = None
    age: int
    gender: Optional[str] = None
    risk_level: str
    probability: float
    created_at: datetime
