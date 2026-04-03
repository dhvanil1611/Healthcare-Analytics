from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any

from database.database import get_db
from models.user import User
from auth.auth import get_current_user
from ml_model.model_trainer import ModelTrainer
from schemas.predict import PredictRequest, PredictResponse

router = APIRouter()

# Initialize model trainer
model_trainer = ModelTrainer()

@router.post("/predict", response_model=PredictResponse)
async def predict_diabetes_risk(
    request: PredictRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Predict diabetes risk using ML models.
    
    This endpoint uses the best available model (Random Forest or XGBoost) 
    to predict diabetes risk based on user assessment data.
    """
    try:
        # Ensure models are initialized
        if model_trainer.best_model is None:
            model_trainer.initialize_models()
        
        # Prepare input data for prediction
        input_data = {
            'age': request.age,
            'gender': request.gender,
            'bmi': request.bmi,
            'fasting_glucose': request.fasting_glucose,
            'hba1c': request.hba1c,
            'systolic_bp': request.systolic_bp,
            'diastolic_bp': request.diastolic_bp,
            'family_history': 1 if request.family_history else 0,
            'physical_activity': request.physical_activity,
            'smoking': 1 if request.smoking else 0,
            'alcohol': 1 if request.alcohol else 0,
            'pregnancies': request.pregnancies if request.gender == 'Female' else 0,
            'excessive_thirst': 1 if request.excessive_thirst else 0,
            'frequent_urination': 1 if request.frequent_urination else 0,
            'sudden_weight_loss': 1 if request.sudden_weight_loss else 0
        }
        
        # Make prediction
        prediction_result = model_trainer.predict(input_data)
        
        return PredictResponse(
            risk_level=prediction_result["risk_level"],
            probability=prediction_result["probability"],
            model_used=prediction_result["model_used"],
            confidence=prediction_result["confidence"],
            input_data_validated=True
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(e)}"
        )

@router.get("/model-info")
async def get_model_info():
    """Get information about the ML models."""
    try:
        if model_trainer.best_model is None:
            model_trainer.initialize_models()
        
        model_info = model_trainer.get_model_info()
        
        return {
            "status": "active",
            "models_available": ["RandomForest", "XGBoost"],
            "current_best_model": model_info.get("best_model", "RandomForest"),
            "last_trained": model_info.get("last_trained"),
            "training_accuracy": model_info.get("best_accuracy"),
            "feature_importance": model_info.get("feature_importance", {}),
            "sample_size": model_info.get("sample_size")
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "models_available": ["RandomForest", "XGBoost"],
            "current_best_model": "RandomForest"
        }

@router.post("/retrain")
async def retrain_models(current_user: User = Depends(get_current_user)):
    """
    Retrain ML models (admin function).
    
    This endpoint forces retraining of the ML models with fresh data.
    In production, this should be protected with admin authentication.
    """
    try:
        # Retrain models
        model_trainer._train_models()
        
        model_info = model_trainer.get_model_info()
        
        return {
            "message": "Models retrained successfully",
            "best_model": model_info.get("best_model"),
            "accuracy": model_info.get("best_accuracy"),
            "last_trained": model_info.get("last_trained")
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Retraining error: {str(e)}"
        )
