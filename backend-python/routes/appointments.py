from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from database.database import get_db
from models.user import User
from models.appointment import Appointment
from auth.auth import get_current_user
from schemas.appointment import AppointmentCreate, AppointmentResponse, AppointmentUpdate

router = APIRouter()

@router.get("/", response_model=List[AppointmentResponse])
async def get_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get appointments for user."""
    appointments = db.query(Appointment).filter(
        Appointment.user_id == current_user.id
    ).order_by(Appointment.date.desc()).all()
    
    return [
        AppointmentResponse(
            id=str(appointment.id),
            doctor_name=appointment.doctor_name,
            specialization=appointment.specialization,
            date=appointment.date,
            time=appointment.time,
            status=appointment.status,
            notes=appointment.notes,
            created_at=appointment.created_at
        )
        for appointment in appointments
    ]

@router.post("/", response_model=AppointmentResponse)
async def create_appointment(
    appointment_data: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create appointment."""
    db_appointment = Appointment(
        user_id=current_user.id,
        doctor_name=appointment_data.doctor_name,
        specialization=appointment_data.specialization,
        date=appointment_data.date,
        time=appointment_data.time,
        notes=appointment_data.notes,
        created_at=datetime.utcnow()
    )
    
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    
    return AppointmentResponse(
        id=str(db_appointment.id),
        doctor_name=db_appointment.doctor_name,
        specialization=db_appointment.specialization,
        date=db_appointment.date,
        time=db_appointment.time,
        status=db_appointment.status,
        notes=db_appointment.notes,
        created_at=db_appointment.created_at
    )

@router.put("/{appointment_id}", response_model=AppointmentResponse)
async def update_appointment_status(
    appointment_id: str,
    appointment_update: AppointmentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update appointment status."""
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()
    
    if not appointment or appointment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    if appointment_update.status:
        appointment.status = appointment_update.status
    
    db.commit()
    db.refresh(appointment)
    
    return AppointmentResponse(
        id=str(appointment.id),
        doctor_name=appointment.doctor_name,
        specialization=appointment.specialization,
        date=appointment.date,
        time=appointment.time,
        status=appointment.status,
        notes=appointment.notes,
        created_at=appointment.created_at
    )
