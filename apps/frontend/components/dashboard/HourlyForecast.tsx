"use client";

import { useMemo } from 'react';

interface HourlyForecastProps {
    hourlyData: any[];
}

const HourlyForecast = ({ hourlyData }: HourlyForecastProps) => {

    const getWeatherIcon = (code: number) => {
        if (code <= 1) return '☀️'; // Sunny
        if (code <= 3) return '☁️'; // Cloudy
        if (code <= 48) return '🌫️'; // Fog
        if (code <= 65) return '🌧️'; // Rain
        if (code <= 86) return '❄️'; // Snow
        if (code <= 99) return '⛈️'; // Thunderstorm
        return '❓';
    }

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-300">Next 8 Hours</h3>
            <div className="flex space-x-4 overflow-x-auto pb-2">
                {hourlyData.map((hour, index) => (
                    <div key={index} className="flex-shrink-0 w-20 text-center bg-gray-700/50 p-2 rounded-lg">
                        <p className="font-semibold">{new Date(hour.time).toLocaleTimeString([], { hour: 'numeric', hour12: true })}</p>
                        <p className="text-3xl my-1">{getWeatherIcon(hour.weather_code)}</p>
                        <p className="text-sm">{Math.round(hour.speed_kmh)} km/h</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HourlyForecast;
