"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"

export default function HeatmapPage() {
    // Dynamically import the Heatmap component to avoid SSR issues with Leaflet
    const Heatmap = useMemo(
        () =>
            dynamic(() => import("@/components/heatmap/Heatmap"), {
                ssr: false,
                loading: () => (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                        <p className="text-white text-lg animate-pulse">Loading Global Heatmap...</p>
                    </div>
                ),
            }),
        [],
    )

    return (
        <div className="relative h-screen w-screen">
            {/* Page Header */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 p-4 bg-black/50 backdrop-blur-md rounded-xl shadow-lg text-center">
                <h1 className="text-2xl font-bold text-white">Global Air Quality Heatmap</h1>
                <p className="text-gray-300 text-sm mt-1">Live data from over 13,000 monitoring stations worldwide.</p>
            </div>
            
            {/* The Map takes up the full screen */}
            <Heatmap />
        </div>
    )
}

