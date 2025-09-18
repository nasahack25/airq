import numpy as np
from scipy.ndimage import shift

def run_simple_advection(initial_aqi: float, wind_data: list, hours: int = 3):
    """
    Simulates the movement of a pollution plume based on hourly wind data.
    """
    grid_size = 101  # A grid of 101x101 pixels
    center = grid_size // 2
    
    # Create the initial pollution grid
    grid = np.zeros((grid_size, grid_size))
    
    # Create a simple Gaussian-like plume around the center
    # The max value at the center is the initial AQI
    for i in range(grid_size):
        for j in range(grid_size):
            distance = np.sqrt((i - center)**2 + (j - center)**2)
            if distance < 10: # Create a plume with a radius of 10 pixels
                grid[i, j] = initial_aqi * np.exp(-distance**2 / 10)

    print("Initial Grid State (center):\n", grid[center-2:center+3, center-2:center+3].round(2))

    # Simulate for the specified number of hours
    for i in range(min(hours, len(wind_data))):
        hour_data = wind_data[i]
        
        # --- THIS IS THE FIX ---
        # Changed 'speed_mph' to the correct key 'speed_kmh' from Open-Meteo.
        speed_kmh = hour_data.get('speed_kmh', 0)
        # ---------------------

        direction_deg = hour_data.get('direction_deg', 0)

        # Assuming each pixel represents ~1km for a simple model
        # Calculate pixel shift based on wind vector
        direction_rad = np.deg2rad(direction_deg)
        # dx is horizontal shift (from East), dy is vertical shift (from North)
        # Note: In grid coordinates, positive y is down, so we invert the y-component.
        dx = speed_kmh * np.sin(direction_rad)
        dy = -speed_kmh * np.cos(direction_rad)

        print(f"Hour {i+1}: Wind {direction_deg}°, Speed {speed_kmh:.2f} km/h -> Shift by (dx:{dx:.2f}, dy:{dy:.2f}) pixels")
        
        # Use scipy's shift function to move the grid pixels
        # "Clamping" the shift to prevent the plume from disappearing off the small grid.
        # This is a simple but effective fix for the "AQI of 0.0" issue.
        max_shift = grid_size / 4 # Limit shift to 1/4 of the grid size per hour
        dx_clamped = np.clip(dx, -max_shift, max_shift)
        dy_clamped = np.clip(dy, -max_shift, max_shift)
        
        grid = shift(grid, [dy_clamped, dx_clamped], mode='constant', cval=0)

    print("Final Grid State (center):\n", grid[center-2:center+3, center-2:center+3].round(2))
    
    # The forecast is the AQI value at the center of the grid after the simulation
    forecast_aqi = grid[center, center]
    return forecast_aqi

