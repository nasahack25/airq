"use client"

// --- FIX: Defined props interface ---
interface HourlyForecastProps {
    forecast:
    | {
        time: string
        aqi: number
        weather_code: number
    }[]
    | undefined
}

const getAqiColorClass = (aqi: number) => {
    if (aqi <= 50) return "bg-green-500/20 text-green-300"
    if (aqi <= 100) return "bg-yellow-500/20 text-yellow-300"
    if (aqi <= 150) return "bg-orange-500/20 text-orange-300"
    return "bg-red-500/20 text-red-300"
}

const WeatherIcon = ({ code }: { code: number }) => {
    if (code === 0) return "☀️"
    if (code >= 1 && code <= 3) return "⛅️"
    if (code >= 45 && code <= 48) return "🌫️"
    if (code >= 51 && code <= 67) return "🌧️"
    if (code >= 71 && code <= 77) return "❄️"
    if (code >= 80 && code <= 99) return "⛈️"
    return "-"
}

export default function HourlyForecast({ forecast }: HourlyForecastProps) {
    if (!forecast) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Hourly Forecast</h3>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-20 h-28 bg-gray-700 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Next 8 Hours</h3>
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {forecast.slice(0, 8).map((hour, index) => (
                    <div
                        key={index}
                        className={`flex-shrink-0 w-24 flex flex-col items-center justify-between p-3 rounded-lg ${getAqiColorClass(hour.aqi)}`}
                    >
                        <span className="text-sm font-medium text-gray-300">
                            {new Date(hour.time).toLocaleTimeString([], { hour: "numeric", hour12: true })}
                        </span>
                        <span className="text-3xl">
                            <WeatherIcon code={hour.weather_code} />
                        </span>
                        <span className="text-lg font-bold">{Math.round(hour.aqi)}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
