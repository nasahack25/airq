"use client"

// --- FIX: Defined props interface ---
interface MainAqiDisplayProps {
    loading: boolean
    error: string | null
    forecast: any
    locationName: string
}

// Helper function to get the appropriate color for the AQI level
const getAqiColor = (level: string) => {
    if (!level) return "text-gray-400"
    if (level.includes("Good")) return "text-green-400"
    if (level.includes("Moderate")) return "text-yellow-400"
    if (level.includes("Unhealthy for Sensitive")) return "text-orange-400"
    if (level.includes("Unhealthy")) return "text-red-500"
    if (level.includes("Very Unhealthy")) return "text-purple-500"
    if (level.includes("Hazardous")) return "text-maroon-500"
    return "text-gray-400"
}

// Helper function to get actionable advice based on AQI
const getAqiAdvice = (level: string) => {
    if (!level) return "AQI data is not available."
    if (level.includes("Good")) return "It's a great day for outdoor activities!"
    if (level.includes("Moderate"))
        return "Unusually sensitive individuals should consider reducing prolonged or heavy exertion."
    if (level.includes("Unhealthy for Sensitive"))
        return "Sensitive groups may experience health effects. The general public is less likely to be affected."
    if (level.includes("Unhealthy")) return "Everyone may begin to experience some adverse health effects."
    if (level.includes("Very Unhealthy")) return "Health alert: everyone may experience more serious health effects."
    if (level.includes("Hazardous"))
        return "Health warning of emergency conditions: everyone is more likely to be affected."
    return "AQI data is not available."
}

export default function MainAqiDisplay({ loading, error, forecast, locationName }: MainAqiDisplayProps) {
    if (loading) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg shadow-2xl animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-16 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg shadow-2xl text-center">
                <h2 className="text-xl font-semibold text-red-400">Error</h2>
                <p className="text-gray-400 mt-2">{error}</p>
            </div>
        )
    }

    if (!forecast || !forecast.current) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg shadow-2xl text-center">
                <h2 className="text-xl font-semibold text-gray-400">No Data Available</h2>
                <p className="text-gray-300 mt-2">Could not retrieve data for the selected location.</p>
            </div>
        )
    }

    const { aqi, level, pollutant } = forecast.current

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
            <h2 className="text-lg font-medium text-gray-400 truncate" title={locationName}>
                {locationName}
            </h2>
            <p className={`text-7xl font-bold mt-2 ${getAqiColor(level)}`}>{aqi || "N/A"}</p>
            <p className={`text-2xl font-semibold ${getAqiColor(level)}`}>
                {level || "Unknown"} {pollutant ? `(${pollutant})` : ""}
            </p>
            <p className="text-gray-300 mt-4 text-sm">{getAqiAdvice(level)}</p>
        </div>
    )
}
