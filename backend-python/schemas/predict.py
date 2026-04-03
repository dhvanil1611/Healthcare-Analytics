from pydantic import BaseModel, Field
from typing import Optional

class PredictRequest(BaseModel):
    age: int = Field(..., ge=1, le=120, description="Age in years")
    gender: str = Field(..., description="Gender: Male, Female, or Other")
    bmi: float = Field(..., ge=10, le=60, description="Body Mass Index")
    fasting_glucose: float = Field(..., ge=50, le=400, description="Fasting blood glucose (mg/dL)")
    hba1c: Optional[float] = Field(None, ge=4, le=15, description="HbA1c percentage")
    systolic_bp: Optional[int] = Field(None, ge=60, le=250, description="Systolic blood pressure")
    diastolic_bp: Optional[int] = Field(None, ge=40, le=150, description="Diastolic blood pressure")
    family_history: bool = Field(False, description="Family history of diabetes")
    physical_activity: Optional[str] = Field("Moderate Activity", description="Physical activity level")
    smoking: Optional[bool] = Field(False, description="Smoking status")
    alcohol: Optional[bool] = Field(False, description="Alcohol consumption")
    pregnancies: Optional[int] = Field(None, ge=0, le=10, description="Number of pregnancies (for females)")
    excessive_thirst: Optional[bool] = Field(False, description="Excessive thirst symptom")
    frequent_urination: Optional[bool] = Field(False, description="Frequent urination symptom")
    sudden_weight_loss: Optional[bool] = Field(False, description="Sudden weight loss symptom")

class PredictResponse(BaseModel):
    risk_level: str = Field(..., description="Risk level: Low, Low-Moderate, Moderate, High, Very High")
    probability: float = Field(..., ge=0, le=1, description="Risk probability (0-1)")
    model_used: str = Field(..., description="ML model used for prediction")
    confidence: float = Field(..., ge=0, le=1, description="Model confidence score")
    input_data_validated: bool = Field(True, description="Whether input data was validated")
