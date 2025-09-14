import time
import random
from utils import api_clients

def run_advection_model(lat: float, lon: float):
    """
    This is the core "brain" of our application.
    
    For this hackathon starter, it simulates the process.
    Your goal is to replace the mock data generation with real logic.
    """
    print(f"Service layer: Simulating forecast for lat={lat}, lon={lon}...")
    
    # --- TODO: REPLACE MOCK DATA WITH REAL API CALLS AND ALGORITHM ---
    # 1. Fetch real data using the utility clients
    # current_air_data = api_clients.get_airnow_data(lat, lon)
    # wind_data_grid = api_clients.get_nws_wind_forecast(lat, lon)
    # tempo_data_grid = api_clients.get_tempo_data(lat, lon)

    # 2. Run the advection (pixel-pushing) algorithm using numpy
    # forecast_aqi = perform_advection(current_air_data, wind_data_grid, tempo_data_grid)
    
    # Simulating the process for now
    time.sleep(1.5) 

    # Generate mock data
    current_aqi = random.randint(30, 70)
    forecast_aqi_value = current_aqi + random.randint(-10, 30)

    def get_level(aqi):
        if aqi <= 50: return "Good"
        if aqi <= 100: return "Moderate"
        if aqi <= 150: return "Unhealthy for Sensitive Groups"
        return "Unhealthy"

    mock_forecast = {
        "location": {"lat": lat, "lon": lon},
        "current": {
            "aqi": current_aqi,
            "level": get_level(current_aqi)
        },
        "forecast": {
            "three_hour": {
                "aqi": forecast_aqi_value,
                "level": get_level(forecast_aqi_value)
            }
        },
        "message": "This is a simulated forecast from the Python service."
    }
    
    print("Service layer: Simulation complete.")
    return mock_forecast
