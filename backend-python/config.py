import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    db_host: str = "localhost"
    db_port: int = 5432
    db_username: str = "postgres"
    db_password: str = "admin123"
    db_name: str = "healthcare"
    database_url: Optional[str] = None
    
    # JWT
    jwt_secret: str = "your_jwt_secret_here"
    jwt_algorithm: str = "HS256"
    jwt_expiration: int = 7 * 24 * 60 * 60  # 7 days in seconds
    
    # App
    port: int = 5000
    environment: str = "development"
    
    # Email
    email_user: str = "healthcare.app@gmail.com"
    email_pass: str = "your_app_password"
    frontend_url: str = "http://localhost:3000"
    
    # ML Models
    ml_model_path: str = "./ml_models"
    model_retrain_interval: int = 7  # days
    
    class Config:
        env_file = ".env"
        case_sensitive = False

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Construct database URL if not provided
        if not self.database_url:
            self.database_url = f"postgresql://{self.db_username}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"

settings = Settings()
