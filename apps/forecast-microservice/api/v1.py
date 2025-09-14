from fastapi import APIRouter
from services import forecast_service

# Create a new router instance
router = APIRouter()

@router.get("/generate-forecast", summary="Generate Air Quality Forecast")
def generate_forecast(lat: float, lon: float):
    """
    Main endpoint for forecasting. It receives coordinates, passes them
    to the forecast service, and returns the resulting data.
    """
    print(f"API layer: Received request for lat={lat}, lon={lon}")
    
    # Call the service layer to perform the core logic
    forecast_data = forecast_service.run_advection_model(lat=lat, lon=lon)
    
    return forecast_data
