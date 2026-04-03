from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
import secrets
import aiosmtplib
from email.message import EmailMessage

from database.database import get_db
from models.user import User
from auth.auth import get_password_hash, verify_password, create_access_token, get_current_user
from config import settings
from schemas.auth import UserCreate, UserResponse, UserLogin, PasswordReset, PasswordResetRequest

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    
    # Convert empty string age to None for database compatibility
    age_value = user_data.age if user_data.age and user_data.age > 0 else None
    
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        age=age_value,
        gender=user_data.gender,
        phone=user_data.phone,
        address=user_data.address,
        medical_history=user_data.medical_history,
        created_at=datetime.utcnow()
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token = create_access_token(data={"id": str(db_user.id)})
    
    return UserResponse(
        token=access_token,
        user={
            "id": str(db_user.id),
            "name": db_user.name,
            "email": db_user.email
        }
    )

@router.post("/login", response_model=UserResponse)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user."""
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found"
        )
    
    if not verify_password(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials"
        )
    
    access_token = create_access_token(data={"id": str(user.id)})
    
    return UserResponse(
        token=access_token,
        user={
            "id": str(user.id),
            "name": user.name,
            "email": user.email
        }
    )

@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get user profile."""
    user_data = {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "age": current_user.age,
        "gender": current_user.gender,
        "phone": current_user.phone,
        "address": current_user.address,
        "medical_history": current_user.medical_history,
        "created_at": current_user.created_at
    }
    return user_data

async def send_password_reset_email(user_email: str, reset_token: str):
    """Send password reset email."""
    message = EmailMessage()
    message["From"] = settings.email_user
    message["To"] = user_email
    message["Subject"] = "Password Reset - Healthcare App"
    
    reset_url = f"{settings.frontend_url}/reset-password?token={reset_token}"
    
    html_content = f"""
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>You requested to reset your password. Click the link below to reset your password:</p>
      <a href="{reset_url}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
        Reset Password
      </a>
      <p>This link will expire in 1 hour for security reasons.</p>
      <p>If you didn't request this password reset, please ignore this email.</p>
      <p>Best regards,<br>Healthcare App Team</p>
    </div>
    """
    
    message.set_content(html_content, subtype='html')
    
    try:
        await aiosmtplib.send(
            message,
            hostname="smtp.gmail.com",
            port=587,
            start_tls=True,
            username=settings.email_user,
            password=settings.email_pass,
        )
    except Exception as e:
        print(f"Failed to send email: {e}")
        # Don't raise exception to avoid exposing email configuration issues

@router.post("/forgot-password")
async def forgot_password(request: PasswordResetRequest, db: Session = Depends(get_db)):
    """Send password reset email."""
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    reset_token_expires = datetime.utcnow() + timedelta(hours=1)
    
    # Save reset token to database
    user.reset_token = reset_token
    user.reset_token_expires = reset_token_expires
    db.commit()
    
    # Send email
    await send_password_reset_email(user.email, reset_token)
    
    return {"message": "Password reset email sent"}

@router.post("/reset-password")
async def reset_password(request: PasswordReset, db: Session = Depends(get_db)):
    """Reset password using token."""
    user = db.query(User).filter(User.reset_token == request.token).first()
    
    if not user or not user.reset_token_expires or user.reset_token_expires < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Hash new password
    hashed_password = get_password_hash(request.new_password)
    
    # Update password and clear reset token
    user.password = hashed_password
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()
    
    return {"message": "Password reset successful"}

@router.get("/verify-reset-token/{token}")
async def verify_reset_token(token: str, db: Session = Depends(get_db)):
    """Verify if reset token is valid."""
    user = db.query(User).filter(User.reset_token == token).first()
    
    if not user or not user.reset_token_expires or user.reset_token_expires < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    return {"valid": True}
