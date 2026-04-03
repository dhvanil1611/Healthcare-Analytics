from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional

from database.database import get_db
from models.user import User
from models.prediction import Prediction
from auth.auth import get_current_user
from schemas.prediction import (
    PredictionCreate, 
    PredictionResponse, 
    AssessmentCreate,
    AssessmentResponse,
    PredictionHistoryResponse
)
from services.prediction_service import PredictionService

router = APIRouter()

@router.get("/history", response_model=List[PredictionHistoryResponse])
async def get_prediction_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get prediction history for user."""
    predictions = db.query(Prediction).filter(
        Prediction.user_id == current_user.id
    ).order_by(Prediction.created_at.desc()).all()
    
    return [
        PredictionHistoryResponse(
            id=str(p.id),
            patient_name=p.patient_name,
            age=p.age,
            gender=p.gender,
            risk_level=p.risk_level,
            probability=float(p.probability),
            created_at=p.created_at
        )
        for p in predictions
    ]

@router.get("/{prediction_id}", response_model=PredictionResponse)
async def get_prediction(
    prediction_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get prediction by ID."""
    prediction = db.query(Prediction).filter(
        Prediction.id == prediction_id,
        Prediction.user_id == current_user.id
    ).first()
    
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction not found"
        )
    
    return PredictionResponse(
        id=str(prediction.id),
        user_id=str(prediction.user_id),
        patient_name=prediction.patient_name,
        age=prediction.age,
        gender=prediction.gender,
        pregnancies=prediction.pregnancies,
        systolic_bp=prediction.systolic_bp,
        diastolic_bp=prediction.diastolic_bp,
        bmi=float(prediction.bmi),
        hba1c=float(prediction.hba1c) if prediction.hba1c else None,
        fasting_glucose=float(prediction.fasting_glucose) if prediction.fasting_glucose else None,
        family_history=prediction.family_history,
        diastolic_blood_pressure=prediction.diastolic_blood_pressure,
        serum_insulin=float(prediction.serum_insulin) if prediction.serum_insulin else None,
        skin_fold_thickness=prediction.skin_fold_thickness,
        physical_activity=prediction.physical_activity,
        smoking=prediction.smoking,
        alcohol=prediction.alcohol,
        excessive_thirst=prediction.excessive_thirst,
        frequent_urination=prediction.frequent_urination,
        sudden_weight_loss=prediction.sudden_weight_loss,
        risk_level=prediction.risk_level,
        probability=float(prediction.probability),
        created_at=prediction.created_at
    )

@router.post("/assess", response_model=AssessmentResponse)
async def create_assessment(
    assessment_data: AssessmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create comprehensive health assessment."""
    # Validate required fields
    if not assessment_data.age or assessment_data.age < 1 or assessment_data.age > 120:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid age"
        )
    
    if not assessment_data.bmi or assessment_data.bmi < 10 or assessment_data.bmi > 60:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid BMI"
        )
    
    if not assessment_data.fasting_glucose or assessment_data.fasting_glucose < 50 or assessment_data.fasting_glucose > 400:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid fasting blood glucose"
        )
    
    # Validate blood pressure (at least one should be provided)
    if not assessment_data.diastolic_bp and not assessment_data.diastolic_blood_pressure:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Blood pressure is required"
        )
    
    # Validate blood pressure values if provided
    if assessment_data.diastolic_bp and (assessment_data.diastolic_bp < 40 or assessment_data.diastolic_bp > 150):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid diastolic blood pressure"
        )
    
    if assessment_data.diastolic_blood_pressure and (assessment_data.diastolic_blood_pressure < 40 or assessment_data.diastolic_blood_pressure > 150):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid diastolic blood pressure"
        )
    
    if assessment_data.systolic_bp and (assessment_data.systolic_bp < 60 or assessment_data.systolic_bp > 250):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid systolic blood pressure"
        )
    
    # Validate gender-specific fields
    if assessment_data.gender == "Female" and assessment_data.pregnancies is not None:
        if assessment_data.pregnancies < 0 or assessment_data.pregnancies > 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid number of pregnancies (0-10)"
            )
    
    # Calculate risk using prediction service
    prediction_service = PredictionService()
    risk_result = prediction_service.calculate_risk(assessment_data.model_dump())
    
    # Create prediction record
    db_prediction = Prediction(
        user_id=current_user.id,
        patient_name=assessment_data.patient_name,
        age=assessment_data.age,
        gender=assessment_data.gender,
        pregnancies=assessment_data.pregnancies if assessment_data.gender == "Female" else None,
        systolic_bp=assessment_data.systolic_bp,
        diastolic_bp=assessment_data.diastolic_bp or assessment_data.diastolic_blood_pressure,
        bmi=assessment_data.bmi,
        hba1c=assessment_data.hba1c,
        fasting_glucose=assessment_data.fasting_glucose,
        family_history=assessment_data.family_history,
        diastolic_blood_pressure=assessment_data.diastolic_bp or assessment_data.diastolic_blood_pressure,
        serum_insulin=assessment_data.serum_insulin,
        skin_fold_thickness=assessment_data.skin_fold_thickness,
        physical_activity=assessment_data.physical_activity,
        smoking=assessment_data.smoking,
        alcohol=assessment_data.alcohol,
        excessive_thirst=assessment_data.excessive_thirst,
        frequent_urination=assessment_data.frequent_urination,
        sudden_weight_loss=assessment_data.sudden_weight_loss,
        risk_level=risk_result["risk_level"],
        probability=risk_result["probability"],
        created_at=datetime.utcnow()
    )
    
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    
    return AssessmentResponse(
        id=str(db_prediction.id),
        user_id=str(db_prediction.user_id),
        patient_name=db_prediction.patient_name,
        age=db_prediction.age,
        gender=db_prediction.gender,
        pregnancies=db_prediction.pregnancies,
        systolic_bp=db_prediction.systolic_bp,
        diastolic_bp=db_prediction.diastolic_bp,
        bmi=float(db_prediction.bmi),
        hba1c=float(db_prediction.hba1c) if db_prediction.hba1c else None,
        fasting_glucose=float(db_prediction.fasting_glucose),
        family_history=db_prediction.family_history,
        diastolic_blood_pressure=db_prediction.diastolic_blood_pressure,
        serum_insulin=float(db_prediction.serum_insulin) if db_prediction.serum_insulin else None,
        skin_fold_thickness=db_prediction.skin_fold_thickness,
        physical_activity=db_prediction.physical_activity,
        smoking=db_prediction.smoking,
        alcohol=db_prediction.alcohol,
        excessive_thirst=db_prediction.excessive_thirst,
        frequent_urination=db_prediction.frequent_urination,
        sudden_weight_loss=db_prediction.sudden_weight_loss,
        risk_level=db_prediction.risk_level,
        probability=float(db_prediction.probability),
        created_at=db_prediction.created_at,
        risk_score=risk_result.get("risk_score"),
        risk_factors=risk_result.get("risk_factors", []),
        recommendations=risk_result.get("recommendations", [])
    )

@router.post("/", response_model=PredictionResponse)
async def create_legacy_prediction(
    prediction_data: PredictionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create legacy prediction (backward compatibility)."""
    # Validate required fields
    if not prediction_data.bmi or prediction_data.bmi < 10 or prediction_data.bmi > 60:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid BMI"
        )
    
    if not prediction_data.age or prediction_data.age < 1 or prediction_data.age > 120:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid age"
        )
    
    # Calculate risk using prediction service
    prediction_service = PredictionService()
    risk_result = prediction_service.calculate_risk(prediction_data.model_dump())
    
    # Create prediction record
    db_prediction = Prediction(
        user_id=current_user.id,
        age=prediction_data.age,
        bmi=prediction_data.bmi,
        diastolic_blood_pressure=prediction_data.diastolic_blood_pressure,
        serum_insulin=prediction_data.serum_insulin,
        skin_fold_thickness=prediction_data.skin_fold_thickness,
        family_history=prediction_data.family_history,
        risk_level=risk_result["risk_level"],
        probability=risk_result["probability"],
        created_at=datetime.utcnow()
    )
    
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    
    return PredictionResponse(
        id=str(db_prediction.id),
        user_id=str(db_prediction.user_id),
        age=db_prediction.age,
        bmi=float(db_prediction.bmi),
        diastolic_blood_pressure=db_prediction.diastolic_blood_pressure,
        serum_insulin=float(db_prediction.serum_insulin) if db_prediction.serum_insulin else None,
        skin_fold_thickness=db_prediction.skin_fold_thickness,
        family_history=db_prediction.family_history,
        risk_level=db_prediction.risk_level,
        probability=float(db_prediction.probability),
        created_at=db_prediction.created_at
    )
