"use client"

import { useEffect, useState } from "react"

// --- FIX: Defined props interface ---
interface AnimatedHourlyForecastProps {
  forecast:
    | {
        time: string
        aqi: number
        weather_code: number
      }[]
    | undefined
}

const getAqiColorClass = (aqi: number) => {
  if (aqi <= 50) return "from-green-500/20 to-green-400/10 text-green-400 border-green-500/20"
  if (aqi <= 100) return "from-yellow-500/20 to-yellow-400/10 text-yellow-400 border-yellow-500/20"
  if (aqi <= 150) return "from-orange-500/20 to-orange-400/10 text-orange-400 border-orange-500/20"
  return "from-red-500/20 to-red-400/10 text-red-400 border-red-500/20"
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

export default function AnimatedHourlyForecast({ forecast }: AnimatedHourlyForecastProps) {
  const [animatedHeights, setAnimatedHeights] = useState<number[]>([])

  useEffect(() => {
    if (forecast) {
      // Animate bars growing from bottom up
      const timer = setTimeout(() => {
        const heights = forecast.slice(0, 8).map((hour) => {
          const maxAqi = Math.max(...forecast.slice(0, 8).map((h) => h.aqi))
          return (hour.aqi / maxAqi) * 100
        })
        setAnimatedHeights(heights)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [forecast])

  if (!forecast) {
    return (
      <div className="glass-dark p-8 rounded-2xl shadow-2xl border border-border/20">
        <h3 className="text-lg font-semibold text-card-foreground mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Hourly Forecast
        </h3>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-24 h-32 bg-muted/10 rounded-xl animate-pulse border border-border/10"
            ></div>
          ))}
        </div>
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Next 8 Hours
      </h3>
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin">
        {forecast.slice(0, 8).map((hour, index) => {
          const height = animatedHeights[index] || 0
          return (
            <div
              key={index}
              className={`flex-shrink-0 w-28 flex flex-col items-center justify-between p-4 rounded-xl bg-gradient-to-b ${getAqiColorClass(hour.aqi)} border backdrop-blur-sm hover:scale-105 transition-all duration-300 group`}
            >
              <span className="text-xs font-medium text-card-foreground mb-2">
                {new Date(hour.time).toLocaleTimeString([], { hour: "numeric", hour12: true })}
              </span>

              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  <WeatherIcon code={hour.weather_code} />
                </span>

                {/* Animated AQI Bar */}
                <div className="w-4 h-16 bg-card/20 rounded-full overflow-hidden mb-2">
                  <div
                    className={`w-full bg-gradient-to-t ${getAqiColorClass(hour.aqi).split(" ")[0]} transition-all duration-1000 ease-out rounded-full`}
                    style={{
                      height: `${height}%`,
                      transitionDelay: `${index * 100}ms`,
                    }}
                  />
                </div>
              </div>

              <span className="text-lg font-bold">{Math.round(hour.aqi)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
