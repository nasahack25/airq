from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from api.v1 import router as api_router
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="SkySense Forecast Microservice",
    description="Provides air quality forecasts by processing satellite and weather data.",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/", summary="Root endpoint for health check")
def read_root():
    return {"status": "ok", "message": f"Welcome to the SkySense Forecast API. API Key loaded: {'Yes' if os.getenv('AIRNOW_API_KEY') else 'No'}"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=3002, reload=True)

