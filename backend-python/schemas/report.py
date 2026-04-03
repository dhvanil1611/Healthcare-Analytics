from pydantic import BaseModel
from datetime import datetime

class ReportResponse(BaseModel):
    id: str
    filename: str
    original_name: str
    mimetype: str
    size: int
    upload_date: datetime
