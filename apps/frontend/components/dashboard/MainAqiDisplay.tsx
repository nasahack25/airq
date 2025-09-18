"use client";

interface MainAqiDisplayProps {
    aqi: number;
    level: string;
    pollutant: string;
    locationName: string;
}

const MainAqiDisplay = ({ aqi, level, pollutant, locationName }: MainAqiDisplayProps) => {
    const getAqiColor = (level: string) => {
        switch (level) {
            case "Good": return "text-green-400";
            case "Moderate": return "text-yellow-400";
            case "Unhealthy for Sensitive Groups": return "text-orange-400";
            case "Unhealthy": return "text-red-500";
            case "Very Unhealthy": return "text-purple-500";
            case "Hazardous": return "text-red-800";
            default: return "text-gray-400";
        }
    };

    const getActionableAdvice = (level: string) => {
        switch (level) {
            case "Good": return "It's a great day for outdoor activities!";
            case "Moderate": return "Unusually sensitive people should reduce heavy exertion.";
            case "Unhealthy for Sensitive Groups": return "Sensitive groups should limit outdoor exertion.";
            case "Unhealthy": return "Everyone should limit prolonged outdoor exertion.";
            case "Very Unhealthy": return "Everyone should avoid prolonged outdoor exertion.";
            case "Hazardous": return "Everyone should avoid all outdoor exertion.";
            default: return "Air quality information is currently unavailable.";
        }
    }

    return (
        <div className="text-center">
            <p className="text-gray-400">Current AQI in</p>
            <h2 className="text-3xl font-bold mb-2">{locationName}</h2>
            <p className={`text-8xl font-bold ${getAqiColor(level)}`}>{aqi}</p>
            <p className={`text-2xl font-semibold ${getAqiColor(level)}`}>{level}</p>
            <p className="text-gray-400 mt-1">Main Pollutant: {pollutant}</p>
            <p className="text-lg mt-4 text-gray-300">{getActionableAdvice(level)}</p>
        </div>
    );
};

export default MainAqiDisplay;
