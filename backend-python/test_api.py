#!/usr/bin/env python3
"""
Test script for Python Healthcare Backend API endpoints.
"""

import requests
import json
import time

BASE_URL = "http://127.0.0.1:5000"

def test_health_check():
    """Test health check endpoint."""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health Check: {response.status_code} - {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Health Check Failed: {e}")
        return False

def test_root():
    """Test root endpoint."""
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Root: {response.status_code} - {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Root Failed: {e}")
        return False

def test_user_registration():
    """Test user registration."""
    try:
        user_data = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "testpassword123",
            "age": 35,
            "gender": "Male",
            "phone": "1234567890",
            "address": "123 Test Street"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/register", json=user_data)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Registration: {response.status_code}")
            return data['token']
        else:
            print(f"❌ Registration Failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Registration Failed: {e}")
        return None

def test_user_login():
    """Test user login."""
    try:
        login_data = {
            "email": "test@example.com",
            "password": "testpassword123"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login: {response.status_code}")
            return data['token']
        else:
            print(f"❌ Login Failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login Failed: {e}")
        return None

def test_ml_prediction(token):
    """Test ML prediction endpoint."""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        prediction_data = {
            "age": 45,
            "gender": "Male",
            "bmi": 28.5,
            "fasting_glucose": 110,
            "hba1c": 5.8,
            "systolic_bp": 130,
            "diastolic_bp": 85,
            "family_history": True,
            "physical_activity": "Moderate Activity",
            "smoking": False,
            "alcohol": False,
            "excessive_thirst": False,
            "frequent_urination": False,
            "sudden_weight_loss": False
        }
        
        response = requests.post(f"{BASE_URL}/api/predict", json=prediction_data, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ ML Prediction: {response.status_code}")
            print(f"   Risk Level: {data['risk_level']}")
            print(f"   Probability: {data['probability']}")
            print(f"   Model Used: {data['model_used']}")
            return True
        else:
            print(f"❌ ML Prediction Failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ ML Prediction Failed: {e}")
        return False

def test_model_info():
    """Test model info endpoint."""
    try:
        response = requests.get(f"{BASE_URL}/api/model-info")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Model Info: {response.status_code}")
            print(f"   Best Model: {data['current_best_model']}")
            print(f"   Training Accuracy: {data.get('training_accuracy', 'N/A')}")
            return True
        else:
            print(f"❌ Model Info Failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Model Info Failed: {e}")
        return False

def test_assessment_prediction(token):
    """Test comprehensive assessment prediction."""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        assessment_data = {
            "patient_name": "Test Patient",
            "age": 55,
            "gender": "Female",
            "pregnancies": 2,
            "systolic_bp": 140,
            "diastolic_bp": 90,
            "bmi": 32.1,
            "hba1c": 6.2,
            "fasting_glucose": 125,
            "family_history": True,
            "physical_activity": "Little Activity",
            "smoking": False,
            "alcohol": True,
            "excessive_thirst": True,
            "frequent_urination": True,
            "sudden_weight_loss": False
        }
        
        response = requests.post(f"{BASE_URL}/api/predictions/assess", json=assessment_data, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Assessment Prediction: {response.status_code}")
            print(f"   Risk Level: {data['risk_level']}")
            print(f"   Risk Score: {data.get('risk_score', 'N/A')}")
            print(f"   Risk Factors: {len(data.get('risk_factors', []))} factors")
            print(f"   Recommendations: {len(data.get('recommendations', []))} recommendations")
            return True
        else:
            print(f"❌ Assessment Prediction Failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Assessment Prediction Failed: {e}")
        return False

def test_health_metrics(token):
    """Test health metrics endpoints."""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        # Add health metric
        metric_data = {
            "type": "glucose",
            "value": 95.5,
            "unit": "mg/dL"
        }
        
        response = requests.post(f"{BASE_URL}/api/health/metrics", json=metric_data, headers=headers)
        if response.status_code == 200:
            print(f"✅ Add Health Metric: {response.status_code}")
            
            # Get health metrics
            response = requests.get(f"{BASE_URL}/api/health/metrics", headers=headers)
            if response.status_code == 200:
                metrics = response.json()
                print(f"✅ Get Health Metrics: {response.status_code} ({len(metrics)} metrics)")
                return True
            else:
                print(f"❌ Get Health Metrics Failed: {response.status_code}")
                return False
        else:
            print(f"❌ Add Health Metric Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health Metrics Failed: {e}")
        return False

def test_chatbot(token):
    """Test chatbot endpoint."""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        chat_data = {
            "message": "What are the symptoms of diabetes?",
            "session_id": "test_session_123"
        }
        
        response = requests.post(f"{BASE_URL}/api/health/chatbot", json=chat_data, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Chatbot: {response.status_code}")
            print(f"   Response: {data['response'][:100]}...")
            return True
        else:
            print(f"❌ Chatbot Failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Chatbot Failed: {e}")
        return False

def main():
    """Run all API tests."""
    print("🚀 Testing Python Healthcare Backend API")
    print("=" * 50)
    
    # Wait for server to be ready
    time.sleep(2)
    
    # Test basic endpoints
    tests_passed = 0
    total_tests = 0
    
    # Basic health checks
    if test_health_check():
        tests_passed += 1
    total_tests += 1
    
    if test_root():
        tests_passed += 1
    total_tests += 1
    
    # Model info (no auth required)
    if test_model_info():
        tests_passed += 1
    total_tests += 1
    
    # Authentication tests
    print("\n🔐 Authentication Tests")
    print("-" * 20)
    
    token = test_user_registration()
    if token:
        tests_passed += 1
    total_tests += 1
    
    if not token:
        token = test_user_login()
    if token:
        tests_passed += 1
    total_tests += 1
    
    if token:
        print("\n🧠 ML Prediction Tests")
        print("-" * 20)
        
        # ML prediction endpoint
        if test_ml_prediction(token):
            tests_passed += 1
        total_tests += 1
        
        # Assessment prediction
        if test_assessment_prediction(token):
            tests_passed += 1
        total_tests += 1
        
        print("\n🏥 Health Features Tests")
        print("-" * 20)
        
        # Health metrics
        if test_health_metrics(token):
            tests_passed += 1
        total_tests += 1
        
        # Chatbot
        if test_chatbot(token):
            tests_passed += 1
        total_tests += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! Backend is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the logs above.")
    
    return tests_passed == total_tests

if __name__ == "__main__":
    main()
