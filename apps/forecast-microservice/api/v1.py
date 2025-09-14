from fastapi import APIRouter, HTTPException
from services import forecast_service

router = APIRouter()

@router.get("/forecast", summary="Generate Air Quality Forecast")
def generate_forecast(lat: float, lon: float):
    """
    Main endpoint for forecasting. It receives coordinates, passes them
    to the forecast service, and returns the resulting data.
    """
    try:
        print(f"API layer: Received request for lat={lat}, lon={lon}")
        forecast_data = forecast_service.get_air_quality_forecast(lat=lat, lon=lon)
        return forecast_data
    except Exception as e:
        print(f"An error occurred in the API layer: {e}")
        # In a real app, you'd have more specific error handling
        raise HTTPException(status_code=500, detail=str(e))

