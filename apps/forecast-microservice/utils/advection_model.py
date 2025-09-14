import numpy as np

# --- CONFIGURATION CONSTANTS ---
GRID_SIZE = 51      # Size of the simulation grid (e.g., 51x51 pixels)
CENTER_PIXEL = 25   # The center pixel where the user is located
KM_PER_PIXEL = 1.0  # Each pixel represents a 1km x 1km area

def run_simple_advection(initial_aqi: int, wind_data: list, hours: int):
    """
    Simulates the movement of a pollution plume over a grid.
    
    :param initial_aqi: The starting AQI value at the center.
    :param wind_data: List of hourly wind forecasts from NWS.
    :param hours: Number of hours to simulate.
    :return: The forecasted AQI at the center pixel after the simulation.
    """
    # 1. Create the initial pollution grid
    grid = np.zeros((GRID_SIZE, GRID_SIZE), dtype=float)
    
    # Create a small, concentrated "plume" of pollution around the center
    # This simulates a high-resolution starting point based on ground data
    grid[CENTER_PIXEL, CENTER_PIXEL] = initial_aqi
    grid[CENTER_PIXEL-1:CENTER_PIXEL+2, CENTER_PIXEL-1:CENTER_PIXEL+2] += initial_aqi / 4
    grid = np.clip(grid, 0, 500) # AQI values don't exceed 500
    
    print("Initial Grid State (center):")
    print(grid[CENTER_PIXEL-2:CENTER_PIXEL+3, CENTER_PIXEL-2:CENTER_PIXEL+3])

    # 2. Simulate for each hour
    for i in range(min(hours, len(wind_data))):
        hour_wind = wind_data[i]
        wind_direction_deg = hour_wind['direction_deg']
        # NWS wind speed is in mph, convert to km/h (1 mph = 1.60934 km/h)
        wind_speed_kmh = hour_wind['speed_mph'] * 1.60934
        
        # Calculate how many pixels the wind moves the plume
        # The shift is in (row, column) format, which corresponds to (dy, dx)
        # Convert angle to radians for np.sin/cos
        angle_rad = np.deg2rad(270 - wind_direction_deg) # Adjusting for meteorological angle
        
        # dy is change in rows (North/South), dx is change in columns (East/West)
        dy = -wind_speed_kmh / KM_PER_PIXEL * np.sin(angle_rad)
        dx = wind_speed_kmh / KM_PER_PIXEL * np.cos(angle_rad)

        print(f"Hour {i+1}: Wind {wind_direction_deg}°, Speed {wind_speed_kmh:.2f} km/h -> Shift by (dx:{dx:.2f}, dy:{dy:.2f}) pixels")
        
        # 3. Apply the advection (shift the grid)
        # We use np.roll to shift the array. The shift must be integer pixels.
        grid = np.roll(grid, int(round(dy)), axis=0) # Shift up/down
        grid = np.roll(grid, int(round(dx)), axis=1) # Shift left/right

    print("Final Grid State (center):")
    print(grid[CENTER_PIXEL-2:CENTER_PIXEL+3, CENTER_PIXEL-2:CENTER_PIXEL+3])
    
    # 4. The forecast is the value at the original center pixel after the simulation
    forecast_aqi = grid[CENTER_PIXEL, CENTER_PIXEL]
    
    return forecast_aqi
