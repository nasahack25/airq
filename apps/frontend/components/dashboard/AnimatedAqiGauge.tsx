"use client"

import { useEffect, useState } from "react"

// --- FIX: Defined props interface ---
interface AnimatedAqiGaugeProps {
  aqi: number | undefined
}

export default function AnimatedAqiGauge({ aqi }: AnimatedAqiGaugeProps) {
  const [animatedAqi, setAnimatedAqi] = useState(0)
  const aqiValue = aqi ?? 0

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedAqi(aqiValue)
    }, 300)
    return () => clearTimeout(timer)
  }, [aqiValue])

  // Calculate the rotation for the gauge needle with smooth animation
  const percentage = Math.min(animatedAqi / 300, 1)
  const rotation = percentage * 180 - 90 // -90 to 0 to 90 degrees

  const segments = [
    { color: "from-green-500 to-green-400", label: "Good", range: "0-50", textColor: "text-green-500" },
    { color: "from-yellow-500 to-yellow-400", label: "Moderate", range: "51-100", textColor: "text-yellow-500" },
    { color: "from-orange-500 to-orange-400", label: "USG", range: "101-150", textColor: "text-orange-500" },
    { color: "from-red-500 to-red-400", label: "Unhealthy", range: "151-200", textColor: "text-red-500" },
    { color: "from-purple-500 to-purple-400", label: "Very Unhealthy", range: "201-300", textColor: "text-purple-500" },
  ]

  const getCurrentSegment = (value: number) => {
    if (value <= 50) return segments[0]
    if (value <= 100) return segments[1]
    if (value <= 150) return segments[2]
    if (value <= 200) return segments[3]
    return segments[4]
  }

  const currentSegment = getCurrentSegment(animatedAqi)

  return (
    <div className="glass-dark p-8 rounded-2xl shadow-2xl border border-border/20 hover:border-primary/30 transition-all duration-500">
      <h3 className="text-lg font-semibold text-card-foreground mb-6 text-center flex items-center justify-center gap-2">
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        AQI Scale
      </h3>

      <div className="relative w-full h-32 flex items-end justify-center mb-6">
        {/* Gauge Background with Gradient */}
        <div className="absolute bottom-0 w-full h-full overflow-hidden rounded-t-full">
          <div className="absolute w-full h-[200%] rounded-full flex">
            <div className="w-1/5 bg-gradient-to-t from-green-500 to-green-400"></div>
            <div className="w-1/5 bg-gradient-to-t from-yellow-500 to-yellow-400"></div>
            <div className="w-1/5 bg-gradient-to-t from-orange-500 to-orange-400"></div>
            <div className="w-1/5 bg-gradient-to-t from-red-500 to-red-400"></div>
            <div className="w-1/5 bg-gradient-to-t from-purple-500 to-purple-400"></div>
          </div>
        </div>

        {/* Needle with smooth animation and bounce effect */}
        <div
          className="absolute bottom-0 h-28 w-1 transition-all duration-1000 ease-out"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "bottom center",
            transitionTimingFunction: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
          }}
        >
          <div className="w-full h-full bg-gradient-to-t from-white to-gray-200 rounded-t-full shadow-lg"></div>
        </div>

        {/* Center Circle with glow effect */}
        <div
          className="absolute w-8 h-8 bg-gradient-to-br from-card to-muted rounded-full border-2 border-white shadow-lg"
          style={{ bottom: "-1rem" }}
        >
          <div className="absolute inset-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full"></div>
        </div>
      </div>

      {/* Scale Labels */}
      <div className="text-xs text-muted-foreground flex justify-between mb-4 px-2">
        <span>0</span>
        <span>150</span>
        <span>300</span>
      </div>

      {/* Current Reading */}
      <div className="text-center p-4 bg-card/30 rounded-lg border border-border/10">
        <div className={`text-2xl font-bold mb-1 ${currentSegment.textColor}`}>{Math.round(animatedAqi)}</div>
        <div className="text-sm text-muted-foreground">
          {currentSegment.label} ({currentSegment.range})
        </div>
      </div>
    </div>
  )
}
