"use client";
import { useState, FormEvent } from 'react';

// A simple loading spinner component
const Spinner = () => (
  <div className="border-4 border-gray-200 border-t-blue-500 rounded-full w-8 h-8 animate-spin"></div>
);

// Main component for the AirGuard application
export default function AirGuardHome() {
  const [location, setLocation] = useState<string>('New York, NY');
  const [loading, setLoading] = useState<boolean>(false);
  const [forecast, setForecast] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Handles the form submission to fetch air quality forecast
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setForecast(null);

    try {
      // NOTE: In a real app, you'd geocode the location string to get lat/lon
      // For this hackathon, we'll hardcode some coordinates for simplicity.
      const coordinates = { lat: 40.7128, lon: -74.0060 }; // New York City

      const response = await fetch(`http://localhost:3001/api/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}`);

      if (!response.ok) {
        throw new Error('Failed to fetch forecast from the server.');
      }

      const data = await response.json();
      setForecast(data);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-sans">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-blue-400">AirGuard</h1>
          <p className="text-lg text-gray-400 mt-2">Forecasting Air Quality with NASA's TEMPO Data</p>
        </header>

        <main>
          {/* Search and Input Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-2xl mb-8">
            <form onSubmit={handleSubmit}>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                Enter Your Location
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-grow bg-gray-700 text-white rounded-md px-4 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g., Los Angeles, CA"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-md transition-colors duration-300 flex items-center justify-center"
                >
                  {loading ? <Spinner /> : 'Get Forecast'}
                </button>
              </div>
            </form>
          </div>

          {/* Results Display Section */}
          {error && <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg text-center">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Map Placeholder */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
              <h2 className="text-2xl font-semibold mb-4 text-gray-300">Pollution Map</h2>
              <div className="w-full h-64 bg-gray-700 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Map will be here</p>
                {/* TODO: Integrate Leaflet.js or Mapbox here to display TEMPO GIBS tiles */}
              </div>
            </div>

            {/* Forecast Display */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-2xl min-h-[300px]">
              <h2 className="text-2xl font-semibold mb-4 text-gray-300">Your Forecast</h2>
              {loading && <div className="flex justify-center pt-8"><Spinner /></div>}
              {forecast ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400">Current AQI:</p>
                    <p className="text-4xl font-bold text-green-400">{forecast.current.aqi} - {forecast.current.level}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">3-Hour Forecast:</p>
                    <p className="text-4xl font-bold text-yellow-400">{forecast.forecast.three_hour.aqi} - {forecast.forecast.three_hour.level}</p>
                  </div>
                  <p className="text-sm text-gray-500 pt-4">{forecast.message}</p>
                </div>
              ) : (
                !loading && <p className="text-gray-500 text-center pt-8">Your air quality forecast will appear here.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
