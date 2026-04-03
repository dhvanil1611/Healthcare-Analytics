from pydantic import BaseModel
from typing import Optional

class HospitalResponse(BaseModel):
    id: str
    name: str
    address: str
    phone: str
    email: Optional[str] = None
    specialization: Optional[str] = None
    rating: Optional[float] = None
    image_url: Optional[str] = None
