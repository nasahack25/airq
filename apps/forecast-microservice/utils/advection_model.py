import numpy as np
from scipy.ndimage import shift

def run_simple_advection(initial_aqi: float, wind_data: list, hours: int = 8):
    """
    Simulates the movement of a pollution plume and returns an AQI forecast for each hour.
    """
    grid_size = 101
    center = grid_size // 2
    
    grid = np.zeros((grid_size, grid_size))
    
    for i in range(grid_size):
        for j in range(grid_size):
            distance = np.sqrt((i - center)**2 + (j - center)**2)
            if distance < 10:
                grid[i, j] = initial_aqi * np.exp(-distance**2 / 10)

    print("Initial Grid State (center):\n", grid[center-2:center+3, center-2:center+3].round(2))

    # --- THIS IS THE FIX ---
    # Create a list to store the AQI forecast for each hour.
    hourly_aqi_forecasts = []

    for i in range(min(hours, len(wind_data))):
        hour_data = wind_data[i]
        speed_kmh = hour_data.get('speed_kmh', 0)
        direction_deg = hour_data.get('direction_deg', 0)

        direction_rad = np.deg2rad(direction_deg)
        dx = speed_kmh * np.sin(direction_rad)
        dy = -speed_kmh * np.cos(direction_rad)
        
        max_shift = grid_size / 4
        dx_clamped = np.clip(dx, -max_shift, max_shift)
        dy_clamped = np.clip(dy, -max_shift, max_shift)
        
        grid = shift(grid, [dy_clamped, dx_clamped], mode='constant', cval=0)
        
        # Append the AQI at the center for this hour to our list.
        hourly_aqi_forecasts.append(grid[center, center])
    
    print("Final Grid State (center):\n", grid[center-2:center+3, center-2:center+3].round(2))
    
    # Return the entire list of hourly forecasts.
    return hourly_aqi_forecasts

