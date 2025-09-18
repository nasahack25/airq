"use client";
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import LocationSearch from '../components/LocationSearch';
import MainAqiDisplay from '../components/dashboard/MainAqiDisplay';
import AqiGauge from '../components/dashboard/AqiGauge';
import CurrentWeather from '../components/dashboard/CurrentWeather';
import HourlyForecast from '../components/dashboard/HourlyForecast';

export default function AirQHome() {
  const [locationName, setLocationName] = useState<string>('New York, NY');
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]);

  const [loading, setLoading] = useState<boolean>(true); // Start loading initially
  const [forecast, setForecast] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const MapView = useMemo(() => dynamic(() => import('../components/MapView'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-700 flex items-center justify-center"><p>Loading map...</p></div>,
  }), []);

  const fetchForecast = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    setForecast(null);

    try {
      const response = await axios.get(`http://localhost:3001/api/forecast?lat=${lat}&lon=${lon}`);
      setForecast(response.data);
      setLocationName(response.data.location.name);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for initial geolocation fetch
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          fetchForecast(latitude, longitude);
        },
        (error) => { // Handle user denying permission
          console.error("Geolocation error:", error);
          fetchForecast(mapCenter[0], mapCenter[1]); // Fetch for default location
        }
      );
    } else {
      fetchForecast(mapCenter[0], mapCenter[1]); // Geolocation not supported
    }
  }, [fetchForecast]); // Note: mapCenter is removed to prevent re-fetching on map move

  const handleLocationSelect = (lat: number, lon: number, name: string) => {
    setMapCenter([lat, lon]);
    setLocationName(name);
    fetchForecast(lat, lon);
  };

  const handleMapClick = (lat: number, lon: number) => {
    setMapCenter([lat, lon]);
    fetchForecast(lat, lon);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <header className="text-center py-6 bg-gray-800/50">
        <h1 className="text-4xl font-bold text-blue-400">AirQ</h1>
        <p className="text-md text-gray-400 mt-1">Global Air Quality Forecasting</p>
      </header>

      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow-lg">
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </div>

        {loading && <div className="text-center p-10">Loading forecast data...</div>}
        {error && <div className="text-center p-10 text-red-400">Error: {error}</div>}

        {forecast && (
          <main className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column: Dashboard Widgets */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <MainAqiDisplay
                  aqi={forecast.current.aqi}
                  level={forecast.current.level}
                  pollutant={forecast.current.pollutant}
                  locationName={locationName}
                />
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <AqiGauge aqi={forecast.current.aqi} />
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <CurrentWeather
                  humidity={forecast.current.humidity}
                  windSpeed={forecast.current.wind_speed_kmh}
                  windDirection={forecast.current.wind_direction_deg}
                />
              </div>
            </div>

            {/* Right Column: Map and Hourly */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-[450px] lg:h-[500px]">
                <MapView
                  center={mapCenter}
                  zoom={10}
                  onMapClick={handleMapClick}
                />
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <HourlyForecast hourlyData={forecast.forecast.hourly} />
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

