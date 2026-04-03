from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database.database import get_db
from models.hospital import Hospital
from schemas.hospital import HospitalResponse

router = APIRouter()

@router.get("/", response_model=List[HospitalResponse])
async def get_hospitals(db: Session = Depends(get_db)):
    """Get all hospitals."""
    hospitals = db.query(Hospital).all()
    
    return [
        HospitalResponse(
            id=str(hospital.id),
            name=hospital.name,
            address=hospital.address,
            phone=hospital.phone,
            email=hospital.email,
            specialization=hospital.specialization,
            rating=float(hospital.rating) if hospital.rating else None,
            image_url=hospital.image_url
        )
        for hospital in hospitals
    ]

@router.post("/", response_model=HospitalResponse)
async def create_hospital(
    hospital_data: HospitalResponse,
    db: Session = Depends(get_db)
):
    """Create new hospital (admin function)."""
    db_hospital = Hospital(
        name=hospital_data.name,
        address=hospital_data.address,
        phone=hospital_data.phone,
        email=hospital_data.email,
        specialization=hospital_data.specialization,
        rating=hospital_data.rating,
        image_url=hospital_data.image_url
    )
    
    db.add(db_hospital)
    db.commit()
    db.refresh(db_hospital)
    
    return HospitalResponse(
        id=str(db_hospital.id),
        name=db_hospital.name,
        address=db_hospital.address,
        phone=db_hospital.phone,
        email=db_hospital.email,
        specialization=db_hospital.specialization,
        rating=float(db_hospital.rating) if db_hospital.rating else None,
        image_url=db_hospital.image_url
    )
