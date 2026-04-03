# Python Healthcare Backend

FastAPI-based backend for AI-Powered Diabetes Risk Self-Assessment application, migrated from Node.js/Express to Python.

## Features

- **Authentication**: User registration, login, password reset with JWT tokens
- **Health Assessments**: Comprehensive diabetes risk prediction
- **ML Models**: Random Forest and XGBoost models with automatic model selection
- **Database Integration**: PostgreSQL with SQLAlchemy ORM
- **File Upload**: Medical report management
- **Health Metrics**: Tracking and storage of health data
- **Chatbot**: Health-related Q&A bot
- **Appointments**: Medical appointment scheduling
- **Hospitals & Reviews**: Hospital directory with rating system

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-reset-token/{token}` - Verify reset token

### Predictions
- `POST /api/predictions/assess` - Comprehensive health assessment
- `POST /api/predictions/` - Legacy prediction (backward compatibility)
- `GET /api/predictions/history` - Get prediction history
- `GET /api/predictions/{id}` - Get specific prediction

### ML Prediction
- `POST /api/predict` - AI-powered diabetes risk prediction
- `GET /api/model-info` - Get ML model information
- `POST /api/retrain` - Retrain ML models (admin)

### Health Metrics
- `GET /api/health/metrics` - Get health metrics
- `POST /api/health/metrics` - Add health metric
- `POST /api/health/chatbot` - Chat with health bot

### Appointments
- `GET /api/appointments/` - Get appointments
- `POST /api/appointments/` - Create appointment
- `PUT /api/appointments/{id}` - Update appointment status

### Reports
- `POST /api/reports/` - Upload medical report
- `GET /api/reports/` - Get reports
- `GET /api/reports/{id}` - Download report

### Hospitals
- `GET /api/hospitals/` - Get all hospitals
- `POST /api/hospitals/` - Create hospital (admin)

### Reviews
- `GET /api/reviews/` - Get all reviews
- `POST /api/reviews/` - Create review
- `GET /api/reviews/hospital/{hospital_id}` - Get hospital reviews

## Installation

1. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database Setup:**
Ensure PostgreSQL is running and the database exists with the schema from the original Node.js backend.

4. **Run the application:**
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --host 0.0.0.0 --port 5000 --reload
```

## Environment Variables

- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `JWT_SECRET`: JWT secret key
- `PORT`: Application port (default: 5000)
- `EMAIL_USER`: Email for password reset
- `EMAIL_PASS`: Email password for password reset
- `FRONTEND_URL`: Frontend URL for password reset links
- `ML_MODEL_PATH`: Path to store ML models (default: ./ml_models)

## ML Models

The application includes two ML models:
- **Random Forest**: Ensemble learning method
- **XGBoost**: Gradient boosting framework

Models are automatically trained on sample data and the best performing model is selected for predictions. Models are persisted and loaded on startup.

### Model Features
- Age, BMI, fasting glucose, HbA1c
- Blood pressure (systolic/diastolic)
- Family history, lifestyle factors
- Symptoms and physical activity
- Gender-specific features (pregnancies)

## Database Schema

The backend uses the same database schema as the original Node.js application:
- `users` - User accounts and profiles
- `predictions` - Diabetes risk predictions
- `health_metrics` - Health tracking data
- `appointments` - Medical appointments
- `chatbot_logs` - Chatbot interactions
- `reports` - Medical reports
- `hospitals` - Hospital directory
- `reviews` - Hospital reviews

## Development

### Project Structure
```
backend-python/
├── main.py                 # FastAPI application entry point
├── config.py              # Configuration settings
├── database/              # Database configuration and models
├── models/                # SQLAlchemy models
├── routes/                # API route handlers
├── schemas/               # Pydantic schemas
├── services/              # Business logic services
├── auth/                  # Authentication utilities
├── ml_model/              # Machine learning models
├── uploads/               # File upload directory
└── ml_models/             # Trained model storage
```

### Adding New Features

1. **New API Endpoint:**
   - Add schema in `schemas/`
   - Create route in `routes/`
   - Add model in `models/` if needed
   - Register route in `main.py`

2. **New ML Model:**
   - Implement in `ml_model/model_trainer.py`
   - Update training and prediction logic
   - Add model-specific configuration

## Testing

The backend maintains API compatibility with the original Node.js version. All existing frontend functionality should work without modifications.

### Key Compatibility Features
- Same API endpoints and response formats
- Identical authentication flow
- Compatible database schema
- Same file upload behavior
- Matching error responses

## Deployment

### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
```

### Production Considerations
- Use proper secret management
- Enable HTTPS
- Set up database connection pooling
- Configure logging
- Set up monitoring and health checks
- Use production-grade ASGI server (Gunicorn + Uvicorn)

## API Documentation

Once running, visit:
- `http://localhost:5000/docs` - Interactive API documentation (Swagger)
- `http://localhost:5000/redoc` - Alternative API documentation

## Migration Notes

This Python backend maintains 100% API compatibility with the original Node.js backend while adding:
- Enhanced ML capabilities with automatic model selection
- Better type safety with Pydantic schemas
- Improved error handling
- More robust authentication
- Enhanced logging and monitoring
