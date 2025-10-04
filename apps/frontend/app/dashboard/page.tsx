"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import dynamic from "next/dynamic"
import { useMemo } from "react"
import { useDebounce } from "use-debounce"

import LocationSearch from "@/components/LocationSearch"
import AnimatedAqiGauge from "@/components/dashboard/AnimatedAqiGauge"
import CurrentWeather from "@/components/dashboard/CurrentWeather"
import AnimatedMainAqiDisplay from "@/components/dashboard/AnimatedMainAqi"
import AnimatedHourlyForecast from "@/components/dashboard/AnimatedHourly"
import Chatbot from "@/components/chatbot/Chatbot"

export default function DashboardPage() {
    // State management
    const [locationName, setLocationName] = useState<string>("Detecting location...")
    const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]) // Default to India center
    const [debouncedMapCenter] = useDebounce(mapCenter, 500)

    const [loading, setLoading] = useState<boolean>(true)
    interface WeatherData { temperature?: number; humidity?: number; wind_speed?: number;[key: string]: unknown }
    interface CurrentData { aqi?: number; level?: string; pollutant?: string; weather?: WeatherData; city_name?: string }
    interface ForecastResponse { current?: CurrentData; hourly_forecast?: Array<{ hour: string; aqi: number }>;[key: string]: unknown }
    const [forecast, setForecast] = useState<ForecastResponse | null>(null)
    const [error, setError] = useState<string | null>(null)

    const MapView = useMemo(
        () =>
            dynamic(() => import("@/components/MapView"), {
                ssr: false,
                loading: () => (
                    <div className="w-full h-full glass-dark animate-pulse rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                            </div>
                            <p className="text-muted-foreground text-sm">Loading map...</p>
                        </div>
                    </div>
                ),
            }),
        [],
    )

    const getForecast = useCallback(async (lat: number, lon: number) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.get<ForecastResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/forecast?lat=${lat}&lon=${lon}`)
            setForecast(response.data)
            if (response.data.current?.city_name) {
                setLocationName(response.data.current.city_name)
            }
        } catch (err: unknown) {
            const anyErr = err as { response?: { data?: { detail?: string; error?: string; message?: string } }; message?: string }
            setError(
                anyErr.response?.data?.detail || anyErr.response?.data?.error || anyErr.message || "An unexpected error occurred.",
            )
            setForecast(null)
        } finally {
            setLoading(false)
        }
    }, [])

    // Effect for initial geolocation (run once)
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                setMapCenter([latitude, longitude])
            },
            (err) => {
                console.error("Geolocation error:", err.message)
                // If user denies location, fetch for the default location
                getForecast(mapCenter[0], mapCenter[1])
                setLocationName("New Delhi, India")
            },
        )
    }, [])

    // Effect to fetch forecast when map center changes
    useEffect(() => {
        getForecast(debouncedMapCenter[0], debouncedMapCenter[1])
    }, [debouncedMapCenter, getForecast])

    // Handler for map clicks
    const handleMapClick = (lat: number, lon: number) => {
        setMapCenter([lat, lon])
        setLocationName("Selected Location") // Reset name on click
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Air Quality Dashboard</h1>
                        <p className="text-muted-foreground text-lg">Real-time monitoring and predictive analytics</p>
                    </div>
                    <div className="w-full lg:w-96">
                        <LocationSearch
                            onLocationSelect={(lat, lon, name) => {
                                setMapCenter([lat, lon])
                                setLocationName(name)
                            }}
                        />
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column: Main Metrics */}
                    <div className="xl:col-span-1 space-y-8">
                        <AnimatedMainAqiDisplay loading={loading} error={error} forecast={forecast} locationName={locationName} />
                        <AnimatedAqiGauge aqi={forecast?.current?.aqi} />
                        <CurrentWeather weather={forecast?.current?.weather} />
                    </div>

                    {/* Right Column: Map and Forecast */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Interactive Map */}
                        <div className="glass-dark p-4 rounded-2xl shadow-2xl border border-border/20 hover:border-primary/30 transition-all duration-500">
                            <div className="flex items-center gap-2 mb-4">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
                                    />
                                </svg>
                                <h3 className="text-lg font-semibold text-card-foreground">Interactive Map</h3>
                                <div className="ml-auto text-xs text-muted-foreground bg-card/30 px-2 py-1 rounded-full">
                                    Click to explore
                                </div>
                            </div>
                            <div className="h-[450px] lg:h-[500px] rounded-xl overflow-hidden">
                                <MapView center={mapCenter} zoom={9} onMapClick={handleMapClick} />
                            </div>
                        </div>

                        {/* Hourly Forecast */}
                        <AnimatedHourlyForecast
                            forecast={forecast?.hourly_forecast?.map((h: { hour: string; aqi: number; weather_code?: number }) => ({
                                time: h.hour,
                                aqi: h.aqi,
                                weather_code: h.weather_code ?? 0,
                            }))}
                        />
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-dark p-6 rounded-2xl border border-border/20 text-center">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-card-foreground mb-2">Real-time Data</h3>
                        <p className="text-muted-foreground text-sm">Updated every hour from global monitoring stations</p>
                    </div>

                    <div className="glass-dark p-6 rounded-2xl border border-border/20 text-center">
                        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-card-foreground mb-2">Predictive Analytics</h3>
                        <p className="text-muted-foreground text-sm">8-hour forecasts using advanced atmospheric modeling</p>
                    </div>

                    <div className="glass-dark p-6 rounded-2xl border border-border/20 text-center">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-card-foreground mb-2">Global Coverage</h3>
                        <p className="text-muted-foreground text-sm">Worldwide monitoring with satellite and ground-based data</p>
                    </div>
                </div>
            </div>

            <Chatbot forecastData={forecast} />

        </div>
    )
}

