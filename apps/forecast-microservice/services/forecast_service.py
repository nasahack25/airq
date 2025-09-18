from utils import api_clients
from utils import advection_model

def get_air_quality_forecast(lat: float, lon: float):
    """Orchestrates the forecast generation using global data sources."""
    print("Service layer: Starting global forecast generation...")

    # 1. Fetch real-time data from WAQI (aqicn.org)
    current_air_data = api_clients.get_waqi_data(lat, lon)
    if not current_air_data or "aqi" not in current_air_data:
        raise ValueError("Could not retrieve valid air quality data from WAQI.")
    
    current_aqi = current_air_data.get("aqi")
    print(f"Service layer: Current AQI at location is {current_aqi}")

    # 2. Fetch wind forecast from Open-Meteo
    full_forecast = api_clients.get_open_meteo_wind_forecast(lat, lon)
    if not full_forecast:
        raise ValueError("Could not retrieve wind forecast data from Open-Meteo.")
    print(f"Service layer: Fetched {len(full_forecast)} hours of weather data.")

    # 3. Run the advection model for the 3-hour forecast
    forecast_aqi = advection_model.run_simple_advection(
        initial_aqi=current_aqi,
        wind_data=full_forecast, # Pass the full forecast
        hours=3
    )
    print(f"Service layer: Model predicts a 3-hour AQI of {forecast_aqi}")

    def get_level(aqi):
        if aqi <= 50: return "Good"
        if aqi <= 100: return "Moderate"
        if aqi <= 150: return "Unhealthy for Sensitive Groups"
        if aqi <= 200: return "Unhealthy"
        if aqi <= 300: return "Very Unhealthy"
        return "Hazardous"

    # 4. Format the final response
    primary_pollutant = current_air_data.get("dominentpol", "N/A").upper()
    
    result = {
        "location": {
            "name": current_air_data.get("city", {}).get("name", "Unknown Location"),
            "lat": lat, 
            "lon": lon
        },
        "current": {
            "aqi": current_aqi,
            "level": get_level(current_aqi),
            "pollutant": primary_pollutant,
            "humidity": full_forecast[0].get("humidity"),
            "wind_speed_kmh": full_forecast[0].get("speed_kmh"),
            "wind_direction_deg": full_forecast[0].get("direction_deg"),
        },
        "forecast": {
            "three_hour_aqi": round(forecast_aqi),
            "three_hour_level": get_level(forecast_aqi),
            "hourly": full_forecast[:8] # Send the next 8 hours of weather to the frontend
        }
    }
    
    return result

