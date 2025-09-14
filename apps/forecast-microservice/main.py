from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from api.v1 import router as api_router # Import the router

app = FastAPI(
    title="AirGuard Forecast Microservice",
    description="Provides air quality forecasts by processing satellite and weather data.",
    version="0.1.0",
)

# Configure CORS to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API router
# This tells the main app to use the endpoints defined in api/v1.py
app.include_router(api_router, prefix="/api/v1")

@app.get("/", summary="Root endpoint for health check")
def read_root():
    return {"status": "ok", "message": "Welcome to the AirGuard Forecast API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=3002, reload=True)

