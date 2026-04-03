from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
import os
import uuid
import shutil

from database.database import get_db
from models.user import User
from models.report import Report
from auth.auth import get_current_user
from schemas.report import ReportResponse

router = APIRouter()

# Ensure uploads directory exists
UPLOADS_DIR = "./uploads"
os.makedirs(UPLOADS_DIR, exist_ok=True)

@router.post("/", response_model=ReportResponse)
async def upload_report(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload medical report."""
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file uploaded"
        )
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOADS_DIR, unique_filename)
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving file: {str(e)}"
        )
    
    # Create database record
    db_report = Report(
        user_id=current_user.id,
        filename=unique_filename,
        original_name=file.filename,
        mimetype=file.content_type or "application/octet-stream",
        size=file.size or 0,
        upload_date=datetime.utcnow()
    )
    
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    
    return ReportResponse(
        id=str(db_report.id),
        filename=db_report.filename,
        original_name=db_report.original_name,
        mimetype=db_report.mimetype,
        size=db_report.size,
        upload_date=db_report.upload_date
    )

@router.get("/", response_model=List[ReportResponse])
async def get_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get reports for user."""
    reports = db.query(Report).filter(
        Report.user_id == current_user.id
    ).order_by(Report.upload_date.desc()).all()
    
    return [
        ReportResponse(
            id=str(report.id),
            filename=report.filename,
            original_name=report.original_name,
            mimetype=report.mimetype,
            size=report.size,
            upload_date=report.upload_date
        )
        for report in reports
    ]

@router.get("/{report_id}")
async def download_report(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Download report."""
    report = db.query(Report).filter(
        Report.id == report_id
    ).first()
    
    if not report or report.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    file_path = os.path.join(UPLOADS_DIR, report.filename)
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    return FileResponse(
        path=file_path,
        filename=report.original_name,
        media_type=report.mimetype
    )
