"use client"

import { useEffect, useState } from "react"
import AnimatedCounter from "../ui/AnimatedCounter"

// --- FIX: Defined props interface ---
interface WeatherData { temperature?: number; humidity?: number; wind_speed?: number; [key: string]: unknown }
interface CurrentData { aqi?: number; level?: string; pollutant?: string; weather?: WeatherData }
interface ForecastData { current?: CurrentData }
interface AnimatedMainAqiDisplayProps {
    loading: boolean
    error: string | null
    forecast: ForecastData | null
    locationName: string
}

// Helper function to get the appropriate color for the AQI level
const getAqiColor = (level: string) => {
    if (!level) return "text-muted-foreground"
    if (level.includes("Good")) return "text-green-500"
    if (level.includes("Moderate")) return "text-yellow-500"
    if (level.includes("Unhealthy for Sensitive")) return "text-orange-500"
    if (level.includes("Unhealthy")) return "text-red-500"
    if (level.includes("Very Unhealthy")) return "text-purple-500"
    if (level.includes("Hazardous")) return "text-red-700"
    return "text-muted-foreground"
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

export default function AnimatedMainAqiDisplay({
    loading,
    error,
    forecast,
    locationName,
}: AnimatedMainAqiDisplayProps) {
    const [currentAqi, setCurrentAqi] = useState<number>(0)

    useEffect(() => {
        if (forecast?.current?.aqi && forecast.current.aqi !== currentAqi) {
            setCurrentAqi(forecast.current.aqi)
        }
    }, [forecast?.current?.aqi, currentAqi])

    if (loading) {
        return (
            <div className="glass-dark p-8 rounded-2xl shadow-2xl animate-pulse">
                <div className="h-6 bg-muted/20 rounded w-3/4 mb-6"></div>
                <div className="h-20 bg-muted/20 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-muted/20 rounded w-1/3"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="glass-dark p-8 rounded-2xl shadow-2xl text-center border border-destructive/20">
                <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Data</h2>
                <p className="text-muted-foreground text-sm">{error}</p>
            </div>
        )
    }

    if (!forecast || !forecast.current) {
        return (
            <div className="glass-dark p-8 rounded-2xl shadow-2xl text-center">
                <div className="w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-muted-foreground mb-2">No Data Available</h2>
                <p className="text-muted-foreground text-sm">Could not retrieve data for the selected location.</p>
            </div>
        )
    }

    const { aqi, level, pollutant } = forecast.current

    return (
        <div className="glass-dark p-8 rounded-2xl shadow-2xl border border-border/20 hover:border-primary/30 transition-all duration-500">
            <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-lg font-medium text-muted-foreground truncate" title={locationName}>
                    {locationName}
                </h2>
            </div>

            <div className="text-center mb-6">
                <div className={`text-8xl font-bold mb-2 animate-count-up ${getAqiColor(level || "")}`}>
                    <AnimatedCounter value={aqi || 0} duration={1500} />
                </div>
                <div className={`text-2xl font-semibold mb-2 ${getAqiColor(level || "")}`}>
                    {level || "Unknown"} {pollutant ? `(${pollutant})` : ""}
                </div>
            </div>

            <div className="bg-card/30 rounded-lg p-4 border border-border/10">
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <p className="text-card-foreground text-sm leading-relaxed">{getAqiAdvice(level || "")}</p>
                </div>
            </div>
        </div>
    )
}
