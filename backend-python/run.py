#!/usr/bin/env python3
"""
Development server runner for Python Healthcare Backend.
"""

import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    environment = os.getenv("ENVIRONMENT", "development")
    
    print(f"🚀 Starting Python Healthcare Backend...")
    print(f"📍 Port: {port}")
    print(f"🌍 Environment: {environment}")
    print(f"📚 API Docs: http://localhost:{port}/docs")
    print(f"🔍 Health Check: http://localhost:{port}/health")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True if environment == "development" else False,
        log_level="info"
    )
