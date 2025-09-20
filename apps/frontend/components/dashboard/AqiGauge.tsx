"use client"

// --- FIX: Defined props interface ---
interface AqiGaugeProps {
  aqi: number | undefined
}

export default function AqiGauge({ aqi }: AqiGaugeProps) {
  const aqiValue = aqi ?? 0

  // Calculate the rotation for the gauge needle.
  // The gauge spans 180 degrees. Max AQI for this scale is 300 for simplicity.
  const percentage = Math.min(aqiValue / 300, 1)
  const rotation = percentage * 180 - 90 // -90 to 0 to 90 degrees

  const segments = [
    { color: "bg-green-500", label: "Good", range: "0-50" },
    { color: "bg-yellow-500", label: "Mod", range: "51-100" },
    { color: "bg-orange-500", label: "USG", range: "101-150" },
    { color: "bg-red-500", label: "Unhealthy", range: "151-200" },
    { color: "bg-purple-500", label: "Very Unhealthy", range: "201-300" },
  ]

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
      <h3 className="text-lg font-semibold text-gray-300 mb-4 text-center">AQI Scale</h3>
      <div className="relative w-full h-28 flex items-end justify-center">
        {/* Gauge Background */}
        <div className="absolute bottom-0 w-full h-full overflow-hidden rounded-t-full">
          <div className="absolute w-full h-[200%] rounded-full flex">
            <div className="w-1/5 bg-green-500"></div>
            <div className="w-1/5 bg-yellow-500"></div>
            <div className="w-1/5 bg-orange-500"></div>
            <div className="w-1/5 bg-red-500"></div>
            <div className="w-1/5 bg-purple-500"></div>
          </div>
        </div>

        {/* Needle */}
        <div
          className="absolute bottom-0 h-24 w-1 transition-transform duration-700 ease-in-out"
          style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "bottom center" }}
        >
          <div className="w-full h-full bg-white rounded-t-full"></div>
        </div>

        {/* Center Circle */}
        <div
          className="absolute w-6 h-6 bg-gray-700 rounded-full border-2 border-white"
          style={{ bottom: "-0.75rem" }}
        ></div>
      </div>
      <div className="text-xs text-gray-400 flex justify-between mt-2 px-2">
        <span>0</span>
        <span>150</span>
        <span>300</span>
      </div>
    </div>
  )
}
