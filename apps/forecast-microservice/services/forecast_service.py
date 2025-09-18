from utils import api_clients
from utils import advection_model

def get_aqi_level(aqi):
    if aqi <= 50: return "Good"
    if aqi <= 100: return "Moderate"
    if aqi <= 150: return "Unhealthy for Sensitive Groups"
    if aqi <= 200: return "Unhealthy"
    if aqi <= 300: return "Very Unhealthy"
    return "Hazardous"

def get_air_quality_forecast(lat: float, lon: float):
    print("Service layer: Starting global forecast generation...")

    current_air_data = api_clients.get_waqi_data(lat, lon)
    if not current_air_data:
        raise ValueError("Could not retrieve current air quality data from WAQI.")
    
    current_aqi = current_air_data.get("aqi", 50)
    city_name = current_air_data.get("city", {}).get("name", "Unknown Location")
    primary_pollutant = current_air_data.get("dominentpol", "N/A").upper()
    print(f"Service layer: Current AQI at location is {current_aqi}")

    weather_data_hourly = api_clients.get_open_meteo_wind_forecast(lat, lon)
    if not weather_data_hourly:
        raise ValueError("Could not retrieve wind forecast data from Open-Meteo.")
    print(f"Service layer: Fetched {len(weather_data_hourly)} hours of weather data.")

    # --- THIS IS THE FIX ---
    # 1. Run the model to get a list of hourly AQI predictions.
    hourly_aqi_predictions = advection_model.run_simple_advection(
        initial_aqi=current_aqi,
        wind_data=weather_data_hourly,
        hours=8 # We want to forecast for the next 8 hours
    )

    # 2. Create the 'hourly_forecast' list for the frontend.
    hourly_forecast_for_frontend = []
    for i, prediction in enumerate(hourly_aqi_predictions):
        weather_hour = weather_data_hourly[i]
        hourly_forecast_for_frontend.append({
            "time": weather_hour["time"],
            "aqi": prediction,
            "weather_code": weather_hour["weather_code"]
        })

    # 3. Get the first hour of weather data for the 'current.weather' object.
    first_hour_weather = weather_data_hourly[0] if weather_data_hourly else {}

    # 4. Build the complete, correct result object.
    result = {
        "location": {"lat": lat, "lon": lon},
        "current": {
            "aqi": current_aqi,
            "level": get_aqi_level(current_aqi),
            "city_name": city_name,
            "pollutant": primary_pollutant,
            # Add the 'weather' object the frontend needs
            "weather": {
                "wind_speed": first_hour_weather.get("speed_kmh"),
                "wind_direction": first_hour_weather.get("direction_deg"),
                "humidity": first_hour_weather.get("humidity")
            }
        },
        # Add the 'hourly_forecast' array the frontend needs
        "hourly_forecast": hourly_forecast_for_frontend,
        "message": "Forecast generated using Open-Meteo wind data and an advection model."
    }
    
    return result

