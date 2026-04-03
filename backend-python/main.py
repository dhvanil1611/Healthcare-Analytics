import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from database.database import engine, Base
from routes import auth, predictions, health, appointments, reports, hospitals, reviews, predict
from ml_model.model_trainer import ModelTrainer

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting up Python Healthcare Backend...")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created/verified")
    
    # Initialize ML models
    try:
        trainer = ModelTrainer()
        trainer.initialize_models()
        print("ML models initialized successfully")
    except Exception as e:
        print(f"Warning: Could not initialize ML models: {e}")
    
    yield
    
    # Shutdown
    print("Shutting down Python Healthcare Backend...")

app = FastAPI(
    title="Healthcare API",
    description="AI-Powered Diabetes Risk Self-Assessment Backend",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(predictions.router, prefix="/api/predictions", tags=["predictions"])
app.include_router(health.router, prefix="/api/health", tags=["health"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["appointments"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(hospitals.router, prefix="/api/hospitals", tags=["hospitals"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["reviews"])
app.include_router(predict.router, prefix="/api", tags=["ml-prediction"])

@app.get("/")
async def root():
    return {"message": "Healthcare API is running", "version": "2.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "backend": "python"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True if os.getenv("ENVIRONMENT") == "development" else False
    )
