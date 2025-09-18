import os
import requests

# Get the API key from environment variables
AQICN_API_KEY = os.getenv("AQICN_API_KEY")

def get_waqi_data(lat: float, lon: float):
    # ... this function remains the same
    if not AQICN_API_KEY:
        raise ValueError("AQICN_API_KEY not found in environment variables.")
        
    url = f"https://api.waqi.info/feed/geo:{lat};{lon}/?token={AQICN_API_KEY}"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        if data.get("status") == "ok":
            return data.get("data")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from WAQI: {e}")
        return None

def get_open_meteo_wind_forecast(lat: float, lon: float):
    """Fetches hourly wind forecast from the Open-Meteo API."""
    
    # --- THIS IS THE FIX ---
    # Changed 'humidity_2m' to the correct parameter 'relative_humidity_2m'.
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=wind_speed_10m,wind_direction_10m,weather_code,relative_humidity_2m"
    # ---------------------
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json().get("hourly")
        
        if not data:
            return None

        # Combine the data into a list of hourly forecasts
        hourly_forecasts = []
        for i, time in enumerate(data.get("time", [])):
            hourly_forecasts.append({
                "time": time,
                "direction_deg": data["wind_direction_10m"][i],
                "speed_kmh": data["wind_speed_10m"][i],
                "weather_code": data["weather_code"][i],
                "humidity": data["relative_humidity_2m"][i], # Updated key here as well
            })

        return hourly_forecasts

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from Open-Meteo: {e}")
        return None
    except (KeyError, IndexError) as e:
        print(f"Error parsing Open-Meteo data structure: {e}")
        return None

