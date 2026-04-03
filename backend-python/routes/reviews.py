from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from database.database import get_db
from models.user import User
from models.hospital import Hospital
from models.review import Review
from auth.auth import get_current_user
from schemas.review import ReviewCreate, ReviewResponse

router = APIRouter()

@router.get("/", response_model=List[ReviewResponse])
async def get_reviews(db: Session = Depends(get_db)):
    """Get all reviews."""
    reviews = db.query(Review).order_by(Review.created_at.desc()).all()
    
    return [
        ReviewResponse(
            id=str(review.id),
            hospital_id=str(review.hospital_id),
            rating=review.rating,
            comment=review.comment,
            created_at=review.created_at
        )
        for review in reviews
    ]

@router.post("/", response_model=ReviewResponse)
async def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create review for hospital."""
    # Check if hospital exists
    hospital = db.query(Hospital).filter(Hospital.id == review_data.hospital_id).first()
    if not hospital:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital not found"
        )
    
    # Validate rating
    if not 1 <= review_data.rating <= 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1 and 5"
        )
    
    db_review = Review(
        user_id=current_user.id,
        hospital_id=review_data.hospital_id,
        rating=review_data.rating,
        comment=review_data.comment,
        created_at=datetime.utcnow()
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    return ReviewResponse(
        id=str(db_review.id),
        hospital_id=str(db_review.hospital_id),
        rating=db_review.rating,
        comment=db_review.comment,
        created_at=db_review.created_at
    )

@router.get("/hospital/{hospital_id}", response_model=List[ReviewResponse])
async def get_hospital_reviews(hospital_id: str, db: Session = Depends(get_db)):
    """Get reviews for a specific hospital."""
    reviews = db.query(Review).filter(
        Review.hospital_id == hospital_id
    ).order_by(Review.created_at.desc()).all()
    
    return [
        ReviewResponse(
            id=str(review.id),
            hospital_id=str(review.hospital_id),
            rating=review.rating,
            comment=review.comment,
            created_at=review.created_at
        )
        for review in reviews
    ]
