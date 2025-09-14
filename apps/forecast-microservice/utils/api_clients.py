import os
import requests
from datetime import date

# Get the API key from environment variables
AIRNOW_API_KEY = os.getenv("AIRNOW_API_KEY")

def get_airnow_data(lat: float, lon: float):
    """Fetches real-time air quality data from AirNow."""
    if not AIRNOW_API_KEY:
        raise ValueError("AIRNOW_API_KEY not found in environment variables.")
        
    today = date.today().strftime("%Y-%m-%d")
    url = f"https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude={lat}&longitude={lon}&date={today}&distance=25&API_KEY={AIRNOW_API_KEY}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        # AirNow returns a list, we care about the most relevant pollutant, often the first or second one
        if data:
            # Find the highest AQI value to be representative
            return max(data, key=lambda x: x['AQI'])
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from AirNow: {e}")
        return None

def get_nws_wind_forecast(lat: float, lon: float):
    """Fetches wind forecast grid from the National Weather Service."""
    headers = {
        'User-Agent': '(NASA Space Apps - AirQ Project, shubhashish147@gmail.com)'
    }
    
    try:
        # Step 1: Get the gridpoint URL for the given coordinates
        points_url = f"https://api.weather.gov/points/{lat},{lon}"
        points_response = requests.get(points_url, headers=headers)
        points_response.raise_for_status()
        grid_url = points_response.json()['properties']['forecastGridData']

        # Step 2: Get the raw grid data
        grid_response = requests.get(grid_url, headers=headers)
        grid_response.raise_for_status()
        grid_data = grid_response.json()

        # Step 3: Parse wind speed and direction
        # The data structure is complex, we need to find the layers for wind
        wind_direction_data = grid_data['properties']['windDirection']['values']
        wind_speed_data = grid_data['properties']['windSpeed']['values']
        
        # Combine the data into a list of hourly forecasts
        hourly_forecasts = []
        # We assume the lists are of the same length
        for dir_entry, speed_entry in zip(wind_direction_data, wind_speed_data):
            # We also assume validTime and value are present
            hourly_forecasts.append({
                "time": dir_entry['validTime'],
                "direction_deg": dir_entry['value'],
                "speed_mph": speed_entry['value']
            })

        return hourly_forecasts

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from NWS: {e}")
        return None
    except (KeyError, IndexError) as e:
        print(f"Error parsing NWS data structure: {e}")
        return None

