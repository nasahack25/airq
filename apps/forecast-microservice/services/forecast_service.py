from utils import api_clients
from utils import advection_model

def get_air_quality_forecast(lat: float, lon: float):
    """
    The core service that orchestrates the forecast generation.
    """
    print("Service layer: Starting forecast generation...")

    # 1. Fetch real-time ground truth data from AirNow
    current_air_data = api_clients.get_airnow_data(lat, lon)
    if not current_air_data:
        raise ValueError("Could not retrieve current air quality data from AirNow.")
    
    current_aqi = current_air_data.get("AQI", 50) # Default to 50 if not found
    print(f"Service layer: Current AQI at location is {current_aqi}")

    # 2. Fetch wind forecast grid from NWS
    # This gives us a list of hourly wind forecasts (speed and direction)
    wind_forecast_hourly = api_clients.get_nws_wind_forecast(lat, lon)
    if not wind_forecast_hourly:
        raise ValueError("Could not retrieve wind forecast data from NWS.")
    print(f"Service layer: Fetched {len(wind_forecast_hourly)} hours of wind data.")

    # 3. Run the advection model
    # This simulates the movement of the current pollution plume over the next 3 hours
    forecast_aqi = advection_model.run_simple_advection(
        initial_aqi=current_aqi,
        wind_data=wind_forecast_hourly,
        hours=3
    )
    print(f"Service layer: Model predicts a 3-hour AQI of {forecast_aqi}")

    def get_level(aqi):
        if aqi <= 50: return "Good"
        if aqi <= 100: return "Moderate"
        if aqi <= 150: return "Unhealthy for Sensitive Groups"
        return "Unhealthy"

    # 4. Format and return the final response
    result = {
        "location": {"lat": lat, "lon": lon},
        "current": {
            "aqi": current_aqi,
            "level": get_level(current_aqi),
            "source": "AirNow.gov",
            "reporting_area": current_air_data.get("ReportingArea", "N/A"),
            "pollutant": current_air_data.get("CategoryName", "N/A")
        },
        "forecast": {
            "three_hour": {
                "aqi": round(forecast_aqi),
                "level": get_level(forecast_aqi)
            }
        },
        "message": "Forecast generated using NWS wind data and an advection model."
    }
    
    return result

