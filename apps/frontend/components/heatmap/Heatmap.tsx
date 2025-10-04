"use client"

import { useState, useEffect, useCallback } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import axios from "axios"
// @ts-expect-error — this package doesn’t include TypeScript definitions
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3"

interface StationData {
    lat: number
    lon: number
    aqi: string
}

type HeatmapPoint = [number, number, number]

// A custom component to listen for map movements
const MapEvents = ({ onBoundsChange }: { onBoundsChange: (bounds: L.LatLngBounds) => void }) => {
    const map = useMap()

    useEffect(() => {
        let timer: NodeJS.Timeout

        const handleMove = () => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                onBoundsChange(map.getBounds())
            }, 500)
        }

        map.on("moveend", handleMove)
        handleMove()

        return () => {
            map.off("moveend", handleMove)
            clearTimeout(timer)
        }
    }, [map, onBoundsChange])

    return null
}

export default function Heatmap() {
    const [points, setPoints] = useState<HeatmapPoint[]>([])
    const [loading, setLoading] = useState(true)

    const apiKey = process.env.NEXT_PUBLIC_AQICN_API_KEY

    const fetchPoints = useCallback(
        async (bounds: L.LatLngBounds) => {
            if (!apiKey) {
                console.error("AQICN API key is not configured.")
                setLoading(false)
                return
            }

            setLoading(true)
            const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`
            const url = `https://api.waqi.info/map/bounds/?latlng=${bbox}&token=${apiKey}`

            try {
                const response = await axios.get(url)
                if (response.data.status === "ok") {
                    const newPoints: HeatmapPoint[] = response.data.data
                        .map((station: StationData | null): HeatmapPoint | null => {
                            if (!station) return null
                            const aqi = parseInt(station.aqi, 10)
                            if (!isNaN(aqi) && station.lat && station.lon) {
                                return [station.lat, station.lon, aqi]
                            }
                            return null
                        })
                        .filter((p: HeatmapPoint | null): p is HeatmapPoint => p !== null)

                    setPoints(newPoints)
                }
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error("Error fetching heatmap data:", error)
                }
            } finally {
                setLoading(false)
            }
        },
        [apiKey]
    )


    return (
        <div className="h-full w-full relative">
            {loading && (
                <div className="absolute top-4 right-4 z-[1000] bg-white/80 backdrop-blur-sm p-2 rounded-lg text-sm text-gray-700 animate-pulse">
                    Loading data...
                </div>
            )}

            <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                <HeatmapLayer
                    points={points}
                    longitudeExtractor={(m: HeatmapPoint) => m[1]}
                    latitudeExtractor={(m: HeatmapPoint) => m[0]}
                    intensityExtractor={(m: HeatmapPoint) => m[2]}
                    radius={25}
                    blur={15}
                    max={200}
                    gradient={{
                        0.1: "blue",
                        0.3: "lime",
                        0.5: "yellow",
                        0.7: "orange",
                        1.0: "red",
                    }}
                />

                <MapEvents onBoundsChange={fetchPoints} />
            </MapContainer>
        </div>
    )
}
