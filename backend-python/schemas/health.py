from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class HealthMetricCreate(BaseModel):
    type: str
    value: float
    unit: str

class HealthMetricResponse(BaseModel):
    id: str
    type: str
    value: float
    unit: str
    date: datetime

class ChatbotRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatbotResponse(BaseModel):
    response: str
