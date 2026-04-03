@echo off
REM Quick Start Script for AI Healthcare System (Windows)
REM This script helps set up the entire project quickly

echo.
echo ============================================================
echo 0  AI-Powered Diabetes Risk Assessment System - Quick Start
echo ============================================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Y Node.js found: %NODE_VERSION%
echo.

REM Backend Setup
echo.
echo Packages Setting up Backend...
cd backend

REM Check for .env
if not exist .env (
    echo.  .env file not found. Creating from .env.example...
    copy .env.example .env >nul
    echo Y .env created. Please update it with your database credentials.
    echo.
    echo   Edit backend\.env and set:
    echo    DB_HOST=localhost
    echo    DB_PORT=5432
    echo    DB_USERNAME=postgres
    echo    DB_PASSWORD=your_password
    echo    DB_NAME=diabetes_assessment_db
    echo    JWT_SECRET=your_secret_key
    echo.
)

REM Install dependencies
if not exist node_modules (
    echo.
    echo Packages Installing backend dependencies...
    call npm install
    echo Y Backend dependencies installed
) else (
    echo Y Backend dependencies already installed
)

cd ..

REM Frontend Setup
echo.
echo.
echo Packages Setting up Frontend...
cd frontend

if not exist node_modules (
    echo Packages Installing frontend dependencies...
    call npm install
    echo Y Frontend dependencies installed
) else (
    echo Y Frontend dependencies already installed
)

cd ..

REM Database Setup Instructions
echo.
echo.
echo Database Setup Instructions:
echo ==========================
echo.
echo 1. Make sure PostgreSQL is running
echo.
echo 2. Create the database using pgAdmin or psql:
echo    CREATE DATABASE diabetes_assessment_db;
echo.
echo 3. Update backend\.env with your database credentials:
echo    DB_USERNAME=postgres
echo    DB_PASSWORD=your_postgres_password
echo.

REM Start Instructions
echo.
echo To Start the Application:
echo ==========================
echo.
echo Command Prompt 1 - Backend:
echo   cd backend
echo   npm run dev
echo.
echo Command Prompt 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Frontend will be available at: http://localhost:5173
echo Backend API at: http://localhost:5000
echo.
echo Y Setup complete! Happy coding!
echo.
pause
