"use client"

// --- FIX: Defined props interface ---
interface CurrentWeatherProps {
    weather:
        | {
              wind_speed?: number
              wind_direction?: number
              humidity?: number
          }
        | undefined
}

const WeatherIcon = ({ code }: { code: number }) => {
    // Simple mapping of WMO weather codes to emojis
    if (code === 0) return "☀️" // Clear sky
    if (code >= 1 && code <= 3) return "⛅️" // Mainly clear, partly cloudy, overcast
    if (code >= 45 && code <= 48) return "🌫️" // Fog
    if (code >= 51 && code <= 67) return "🌧️" // Drizzle, Rain
    if (code >= 71 && code <= 77) return "❄️" // Snow
    if (code >= 80 && code <= 99) return "⛈️" // Showers, Thunderstorm
    return "-"
}

export default function CurrentWeather({ weather }: CurrentWeatherProps) {
    if (!weather) {
        return (
            <div className="glass-dark p-8 rounded-2xl shadow-2xl animate-pulse border border-border/20">
                <div className="h-6 bg-muted/20 rounded w-1/2 mb-6"></div>
                <div className="h-4 bg-muted/20 rounded w-full mb-3"></div>
                <div className="h-4 bg-muted/20 rounded w-full"></div>
            </div>
        )
    }

    return (
        <div className="glass-dark p-8 rounded-2xl shadow-2xl border border-border/20 hover:border-primary/30 transition-all duration-500">
            <h3 className="text-lg font-semibold text-card-foreground mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                </svg>
                Environmental Factors
            </h3>
            <div className="space-y-4" aria-label="Environmental Factors">
                <div className="flex justify-between items-center p-4 bg-card/30 rounded-lg border border-border/10 hover:bg-card/40 transition-colors duration-200">
                    <span className="text-muted-foreground font-medium">Wind Speed</span>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-card-foreground">{weather.wind_speed?.toFixed(1) ?? "N/A"} km/h</span>
                        <div
                            className="w-6 h-6 flex items-center justify-center transition-transform duration-500"
                            style={{ transform: `rotate(${weather.wind_direction ?? 0}deg)` }}
                        >
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-card/30 rounded-lg border border-border/10 hover:bg-card/40 transition-colors duration-200">
                    <span className="text-muted-foreground font-medium">Humidity</span>
                    <span className="font-semibold text-card-foreground">{weather.humidity ?? "N/A"}%</span>
                </div>
            </div>
        </div>
    )
}
