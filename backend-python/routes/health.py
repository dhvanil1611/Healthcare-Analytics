from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from database.database import get_db
from models.user import User
from models.health_metric import HealthMetric
from models.chatbot_log import ChatbotLog
from auth.auth import get_current_user
from schemas.health import HealthMetricCreate, HealthMetricResponse, ChatbotRequest, ChatbotResponse

router = APIRouter()

@router.get("/metrics", response_model=List[HealthMetricResponse])
async def get_health_metrics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get health metrics for user."""
    metrics = db.query(HealthMetric).filter(
        HealthMetric.user_id == current_user.id
    ).order_by(HealthMetric.date.desc()).all()
    
    return [
        HealthMetricResponse(
            id=str(metric.id),
            type=metric.type,
            value=float(metric.value),
            unit=metric.unit,
            date=metric.date
        )
        for metric in metrics
    ]

@router.post("/metrics", response_model=HealthMetricResponse)
async def add_health_metric(
    metric_data: HealthMetricCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add health metric."""
    db_metric = HealthMetric(
        user_id=current_user.id,
        type=metric_data.type,
        value=metric_data.value,
        unit=metric_data.unit,
        date=datetime.utcnow()
    )
    
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    
    return HealthMetricResponse(
        id=str(db_metric.id),
        type=db_metric.type,
        value=float(db_metric.value),
        unit=db_metric.unit,
        date=db_metric.date
    )

@router.post("/chatbot", response_model=ChatbotResponse)
async def chatbot_interaction(
    chat_data: ChatbotRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Chatbot endpoint for health queries."""
    message = chat_data.message.lower()
    response = "I'm sorry, I didn't understand that. Please ask about diabetes or health."
    
    # Simple keyword-based responses (can be enhanced with NLP)
    if 'diabetes' in message:
        response = 'Diabetes is a condition that affects how your body uses blood sugar. Regular monitoring and healthy lifestyle are key.'
    elif 'glucose' in message:
        response = 'Fasting blood glucose should be less than 100 mg/dL for normal. Consult your doctor for personalized advice.'
    elif 'diet' in message:
        response = 'A balanced diet with low carbs, high fiber, and regular meals can help manage diabetes. Include vegetables, lean proteins, and whole grains.'
    elif 'exercise' in message or 'physical activity' in message:
        response = 'Regular physical activity like walking, swimming, or cycling for 30 minutes most days can improve insulin sensitivity.'
    elif 'symptoms' in message:
        response = 'Common diabetes symptoms include excessive thirst, frequent urination, sudden weight loss, and fatigue. Consult a doctor if you experience these.'
    elif 'prevention' in message:
        response = 'Diabetes prevention includes maintaining a healthy weight, regular exercise, balanced diet, and regular health check-ups.'
    elif 'medication' in message:
        response = 'Diabetes medications vary by type and individual needs. Always follow your doctor\'s prescription and never self-medicate.'
    
    # Log the interaction
    db_log = ChatbotLog(
        user_id=current_user.id,
        session_id=chat_data.session_id,
        message=chat_data.message,
        response=response,
        created_at=datetime.utcnow()
    )
    
    db.add(db_log)
    db.commit()
    
    return ChatbotResponse(response=response)
