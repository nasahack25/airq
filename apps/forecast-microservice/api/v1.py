from fastapi import APIRouter, HTTPException, Query
from services import forecast_service

router = APIRouter()

@router.get("/forecast", summary="Generate air quality forecast")
def get_forecast(
    lat: float = Query(..., description="Latitude of the location"),
    lon: float = Query(..., description="Longitude of the location")
):
    """
    Provides a current and 3-hour forecasted Air Quality Index (AQI) for a given location.
    """
    # --- THIS IS THE FIX ---
    # Add server-side validation to reject impossible coordinates.
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        raise HTTPException(
            status_code=400,
            detail="Invalid coordinates. Latitude must be between -90 and 90, and longitude between -180 and 180."
        )
    # ---------------------

    try:
        print(f"API layer: Received request for lat={lat}, lon={lon}")
        forecast_data = forecast_service.get_air_quality_forecast(lat, lon)
        return forecast_data
    except ValueError as e:
        print(f"An error occurred in the API layer: {e}")
        # Pass a more specific error message to the client
        raise HTTPException(status_code=500, detail=str(e))

