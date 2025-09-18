"use client";

interface CurrentWeatherProps {
    humidity?: number;
    windSpeed?: number;
    windDirection?: number;
}

const CurrentWeather = ({ humidity, windSpeed, windDirection }: CurrentWeatherProps) => {
    const getWindDirection = (deg?: number) => {
        if (deg === undefined) return 'N/A';
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return directions[Math.round(deg / 45) % 8];
    };

    return (
        <div className="grid grid-cols-3 gap-4 text-center">
            <div>
                <p className="text-sm text-gray-400">Humidity</p>
                <p className="text-xl font-bold">{humidity !== undefined ? `${humidity}%` : 'N/A'}</p>
            </div>
            <div>
                <p className="text-sm text-gray-400">Wind</p>
                <p className="text-xl font-bold">{windSpeed !== undefined ? `${Math.round(windSpeed)} km/h` : 'N/A'}</p>
            </div>
            <div>
                <p className="text-sm text-gray-400">Direction</p>
                <p className="text-xl font-bold">{getWindDirection(windDirection)}</p>
            </div>
        </div>
    );
};

export default CurrentWeather;
