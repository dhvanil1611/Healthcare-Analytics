#!/usr/bin/env python3
"""
Simple test for Python Healthcare Backend API endpoints.
"""

import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_simple_endpoints():
    """Test basic endpoints without authentication."""
    try:
        # Test root
        response = requests.get(f"{BASE_URL}/")
        print(f"Root: {response.status_code} - {response.text}")
        
        # Test health
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health: {response.status_code} - {response.text}")
        
        # Test model info
        response = requests.get(f"{BASE_URL}/api/model-info")
        print(f"Model Info: {response.status_code} - {response.text}")
        
    except Exception as e:
        print(f"Error: {e}")

def test_simple_registration():
    """Test registration with simple data."""
    try:
        user_data = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "testpassword123",
            "age": 35
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/register", json=user_data)
        print(f"Registration: {response.status_code} - {response.text}")
        
    except Exception as e:
        print(f"Registration Error: {e}")

if __name__ == "__main__":
    test_simple_endpoints()
    print("\n" + "="*50)
    test_simple_registration()
