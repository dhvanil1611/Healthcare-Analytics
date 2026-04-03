#!/bin/bash

# Quick Start Script for AI Healthcare System
# This script helps set up the entire project quickly

echo "🏥 AI-Powered Diabetes Risk Assessment System - Quick Start"
echo "==========================================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd backend || exit 1

# Check for .env
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env created. Please update it with your database credentials."
    echo "📝 Edit backend/.env and set:"
    echo "   DB_HOST=localhost"
    echo "   DB_PORT=5432"
    echo "   DB_USERNAME=postgres"
    echo "   DB_PASSWORD=your_password"
    echo "   DB_NAME=diabetes_assessment_db"
    echo "   JWT_SECRET=your_secret_key"
    echo ""
fi

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "📥 Installing backend dependencies..."
    npm install
    echo "✅ Backend dependencies installed"
else
    echo "✅ Backend dependencies already installed"
fi

cd .. || exit 1
echo ""

# Frontend Setup
echo "🎨 Setting up Frontend..."
cd frontend || exit 1

if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    npm install
    echo "✅ Frontend dependencies installed"
else
    echo "✅ Frontend dependencies already installed"
fi

cd .. || exit 1
echo ""

# Database Setup Instructions
echo "🗄️  Database Setup Instructions:"
echo "================================"
echo ""
echo "1. Make sure PostgreSQL is running"
echo ""
echo "2. Create the database:"
echo "   psql -U postgres -c \"CREATE DATABASE diabetes_assessment_db;\""
echo ""
echo "3. Update backend/.env with your database credentials:"
echo "   DB_USERNAME=postgres"
echo "   DB_PASSWORD=your_postgres_password"
echo ""

# Start Instructions
echo ""
echo "🚀 To Start the Application:"
echo "============================"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Frontend will be available at: http://localhost:5173"
echo "Backend API at: http://localhost:5000"
echo ""
echo "✨ Setup complete! Happy coding! ✨"
