"use client";

// --- FIX: Defined props interface ---
interface CurrentWeatherProps {
    weather: {
        wind_speed: number;
        wind_direction: number;
        humidity: number;
    } | undefined;
}

const WeatherIcon = ({ code }: { code: number }) => {
    // Simple mapping of WMO weather codes to emojis
    if (code === 0) return '☀️'; // Clear sky
    if (code >= 1 && code <= 3) return '⛅️'; // Mainly clear, partly cloudy, overcast
    if (code >= 45 && code <= 48) return '🌫️'; // Fog
    if (code >= 51 && code <= 67) return '🌧️'; // Drizzle, Rain
    if (code >= 71 && code <= 77) return '❄️'; // Snow
    if (code >= 80 && code <= 99) return '⛈️'; // Showers, Thunderstorm
    return '-';
};

export default function CurrentWeather({ weather }: CurrentWeatherProps) {
    if (!weather) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg shadow-2xl animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-full mt-2"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Environmental Factors</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Wind</span>
                    <span className="font-semibold text-white">
                        {weather.wind_speed?.toFixed(1) ?? 'N/A'} km/h
                        <span className="inline-block ml-2" style={{ transform: `rotate(${weather.wind_direction ?? 0}deg)` }}>↑</span>
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Humidity</span>
                    <span className="font-semibold text-white">{weather.humidity ?? 'N/A'}%</span>
                </div>
            </div>
        </div>
    );
}

