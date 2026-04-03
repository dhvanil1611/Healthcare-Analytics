from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class AppointmentCreate(BaseModel):
    doctor_name: str
    specialization: str
    date: date
    time: str
    notes: Optional[str] = None

class AppointmentUpdate(BaseModel):
    status: Optional[str] = None

class AppointmentResponse(BaseModel):
    id: str
    doctor_name: str
    specialization: str
    date: date
    time: str
    status: str
    notes: Optional[str] = None
    created_at: datetime
