"use client";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useDebounce } from 'use-debounce';

import LocationSearch from '../components/LocationSearch';
import MainAqiDisplay from '../components/dashboard/MainAqiDisplay';
import AqiGauge from '../components/dashboard/AqiGauge';
import HourlyForecast from '../components/dashboard/HourlyForecast';
import CurrentWeather from '../components/dashboard/CurrentWeather';

export default function AirQHome() {
  // State management
  const [locationName, setLocationName] = useState<string>('Detecting location...');
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // Default to India center
  const [debouncedMapCenter] = useDebounce(mapCenter, 500);

  const [loading, setLoading] = useState<boolean>(true);
  const [forecast, setForecast] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const MapView = useMemo(() => dynamic(() => import('../components/MapView'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-700 animate-pulse rounded-lg" />,
  }), []);

  const getForecast = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3001/api/forecast?lat=${lat}&lon=${lon}`);
      setForecast(response.data);
      if (response.data.current?.city_name) {
        setLocationName(response.data.current.city_name);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.error || err.message || 'An unexpected error occurred.');
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for initial geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
      },
      (err) => {
        console.error("Geolocation error:", err.message);
        // If user denies location, fetch for the default location
        getForecast(mapCenter[0], mapCenter[1]);
        setLocationName('New Delhi, India');
      }
    );
  }, []);

  // Effect to fetch forecast when map center changes
  useEffect(() => {
    getForecast(debouncedMapCenter[0], debouncedMapCenter[1]);
  }, [debouncedMapCenter, getForecast]);

  // --- THIS IS THE FIX ---
  // Handler for map clicks, passed to the MapView component.
  const handleMapClick = (lat: number, lon: number) => {
    setMapCenter([lat, lon]);
    setLocationName('Selected Location'); // Reset name on click
  };
  // ---------------------

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4 font-sans">
      <div className="w-full max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-blue-400">AirQ</h1>
            <p className="text-lg text-gray-400 mt-1">Global Air Quality Forecasting</p>
          </div>
          <div className="w-full md:w-1/3 mt-4 md:mt-0">
            <LocationSearch onLocationSelect={(lat, lon, name) => {
              setMapCenter([lat, lon]);
              setLocationName(name);
            }} />
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Dashboard Widgets */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <MainAqiDisplay loading={loading} error={error} forecast={forecast} locationName={locationName} />
            <AqiGauge aqi={forecast?.current?.aqi} />
            <CurrentWeather weather={forecast?.current?.weather} />
          </div>

          {/* Right Column: Map and Hourly Forecast */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-gray-800 p-2 rounded-lg shadow-2xl h-[450px] lg:h-[450px]">
              <MapView center={mapCenter} zoom={9} onMapClick={handleMapClick} />
            </div>
            <HourlyForecast forecast={forecast?.hourly_forecast} />
          </div>
        </main>
      </div>
    </div>
  );
}

