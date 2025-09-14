"use client";
import { useState, FormEvent, useCallback } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import LocationSearch from '@/components/LocationSearch';

// Main component for the AirQ application
export default function AirQHome() {
  const [locationName, setLocationName] = useState<string>('New York, NY');
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]);

  const [loading, setLoading] = useState<boolean>(false);
  const [forecast, setForecast] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Dynamically import the MapView component and disable Server-Side Rendering (SSR)
  const MapView = useMemo(() => dynamic(() => import('../components/MapView'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-700 flex items-center justify-center"><p>Loading map...</p></div>,
  }), []);


  const tempoTileUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/TEMPO_L3_NO2_V03_Trop_Col/default/2023-11-01/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png`;

  // Use useCallback to memoize the function
  const fetchForecast = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    setForecast(null);

    try {
      const response = await axios.get(`http://localhost:3001/api/forecast?lat=${lat}&lon=${lon}`);
      setForecast(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created only once

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchForecast(mapCenter[0], mapCenter[1]);
  };

  const handleLocationSelect = (lat: number, lon: number, name: string) => {
    setMapCenter([lat, lon]);
    setLocationName(name);
    fetchForecast(lat, lon); // Automatically fetch forecast on selection
  };

  const handleMapClick = async (lat: number, lon: number) => {
    setMapCenter([lat, lon]);
    setLocationName(`Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`);
    fetchForecast(lat, lon); // Automatically fetch forecast on map click
  };

  const getAqiColor = (level: string) => {
    switch (level) {
      case "Good": return "text-green-400";
      case "Moderate": return "text-yellow-400";
      case "Unhealthy for Sensitive Groups": return "text-orange-400";
      case "Unhealthy": return "text-red-500";
      default: return "text-gray-400";
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-sans">
      <div className="w-full max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-blue-400">AirQ</h1>
          <p className="text-lg text-gray-400 mt-2">Real-time Air Quality Forecasting with NASA Data</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Map */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-2xl h-[450px] lg:h-[600px]">
            <MapView
              center={mapCenter}
              zoom={9}
              tempoTileUrl={tempoTileUrl}
              onMapClick={handleMapClick}
            />
          </div>

          {/* Right Column: Controls and Forecast */}
          <div className="flex flex-col gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
              <form onSubmit={handleFormSubmit}>
                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                  Search for a location or click on the map
                </label>
                <div className="flex gap-4">
                  <LocationSearch onLocationSelect={handleLocationSelect} />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-md transition-colors"
                  >
                    {loading ? '...' : 'Forecast'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-2xl flex-grow">
              <h2 className="text-2xl font-semibold mb-4 text-gray-300">Forecast Details for {locationName}</h2>
              {loading && <p>Loading forecast...</p>}
              {error && <div className="text-red-400">{error}</div>}
              {forecast && forecast.current && forecast.forecast?.three_hour && (
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400">Current AQI in {forecast.current.reporting_area}:</p>
                    <p className={`text-5xl font-bold ${getAqiColor(forecast.current.level)}`}>
                      {forecast.current.aqi}
                    </p>
                    <p className={`text-xl ${getAqiColor(forecast.current.level)}`}>
                      {forecast.current.level} ({forecast.current.pollutant})
                    </p>
                  </div>
                  <hr className="border-gray-700" />
                  <div>
                    <p className="text-gray-400">Predicted AQI in 3 Hours:</p>
                    <p className={`text-5xl font-bold ${getAqiColor(forecast.forecast.three_hour.level)}`}>
                      {forecast.forecast.three_hour.aqi}
                    </p>
                    <p className={`text-xl ${getAqiColor(forecast.forecast.three_hour.level)}`}>
                      {forecast.forecast.three_hour.level}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

