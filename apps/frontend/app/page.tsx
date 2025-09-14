"use client";
import { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


// A component to update map view when the forecast location changes
const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

// Main component for the SkySense application
export default function SkySenseHome() {
  const [locationName, setLocationName] = useState<string>('New York, NY');
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]);

  const [loading, setLoading] = useState<boolean>(false);
  const [forecast, setForecast] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // TEMPO Satellite Layer for Nitrogen Dioxide from NASA GIBS
  const tempoTileUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/TEMPO_L3_NO2_V03_Trop_Col/default/2024-03-28/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setForecast(null);

    try {
      // NOTE: Using hardcoded coordinates for simplicity. 
      // A real app would use a geocoding API to convert locationName to lat/lon.
      const coordinates = { lat: mapCenter[0], lon: mapCenter[1] };

      const response = await axios.get(`http://localhost:3001/api/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}`);
      setForecast(response.data);

    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-5xl font-bold text-blue-400">SkySense</h1>
          <p className="text-lg text-gray-400 mt-2">Real-time Air Quality Forecasting with NASA Data</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Map */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-2xl h-[450px] lg:h-auto">
            <MapContainer center={mapCenter} zoom={9} style={{ height: '100%', width: '100%' }} className="rounded-md">
              <ChangeView center={mapCenter} zoom={9} />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              <TileLayer url={tempoTileUrl} opacity={0.6} attribution="NASA GIBS | TEMPO NO2" />
              <Marker position={mapCenter}>
                <Popup>Your selected location</Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Right Column: Controls and Forecast */}
          <div className="flex flex-col gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
              <form onSubmit={handleSubmit}>
                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                  Enter Location (Geocoding not implemented - uses map center)
                </label>
                <div className="flex gap-4">
                  <input
                    id="location"
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="flex-grow bg-gray-700 text-white rounded-md px-4 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
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
              <h2 className="text-2xl font-semibold mb-4 text-gray-300">Forecast Details</h2>
              {loading && <p>Loading forecast...</p>}
              {error && <div className="text-red-400">{error}</div>}
              {forecast && (
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

