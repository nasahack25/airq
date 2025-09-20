"use client"

import { useEffect, useState } from "react"

export default function AdvectionAnimation() {
    const [animationStep, setAnimationStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)

    useEffect(() => {
        if (!isPlaying) return

        const interval = setInterval(() => {
            setAnimationStep((prev) => (prev + 1) % 6)
        }, 1500)

        return () => clearInterval(interval)
    }, [isPlaying])

    const gridSize = 8
    const centerX = Math.floor(gridSize / 2)
    const centerY = Math.floor(gridSize / 2)

    // Wind direction vectors for each step
    const windDirections = [
        { x: 1, y: 0 }, // East
        { x: 1, y: -0.5 }, // Northeast
        { x: 0.5, y: -1 }, // North
        { x: -0.5, y: -1 }, // Northwest
        { x: -1, y: 0 }, // West
        { x: 0, y: 1 }, // South
    ]

    const currentWind = windDirections[animationStep]

    // Calculate pollution plume positions based on wind and time
    const getPlumeIntensity = (x: number, y: number, step: number) => {
        const distance = Math.sqrt(
            Math.pow(x - centerX - currentWind.x * step * 0.5, 2) + Math.pow(y - centerY - currentWind.y * step * 0.5, 2),
        )

        const maxIntensity = Math.max(0, 1 - distance / 3)
        return Math.max(0, maxIntensity - step * 0.1)
    }

    return (
        <div className="glass-dark p-8 rounded-2xl border border-border/20 max-w-2xl mx-auto">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Advection Model Visualization</h3>
                <p className="text-muted-foreground text-sm">
                    Watch how wind patterns move pollution across our prediction grid
                </p>
            </div>

            <div className="relative bg-card/30 rounded-xl p-6 mb-6">
                {/* Grid */}
                <div className="grid grid-cols-8 gap-1 mb-4">
                    {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                        const x = index % gridSize
                        const y = Math.floor(index / gridSize)
                        const intensity = getPlumeIntensity(x, y, animationStep)

                        return (
                            <div
                                key={index}
                                className="w-8 h-8 rounded border border-border/20 transition-all duration-1000 ease-in-out"
                                style={{
                                    backgroundColor: intensity > 0 ? `rgba(239, 68, 68, ${intensity})` : "rgba(255, 255, 255, 0.05)",
                                    boxShadow: intensity > 0.5 ? `0 0 ${intensity * 20}px rgba(239, 68, 68, ${intensity * 0.5})` : "none",
                                }}
                            />
                        )
                    })}
                </div>

                {/* Wind Arrows */}
                <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 12 }).map((_, index) => {
                        const x = (index % 4) * 25 + 15
                        const y = Math.floor(index / 4) * 25 + 15

                        return (
                            <div
                                key={index}
                                className="absolute transition-all duration-1000 ease-in-out"
                                style={{
                                    left: `${x}%`,
                                    top: `${y}%`,
                                    transform: `rotate(${(Math.atan2(currentWind.y, currentWind.x) * 180) / Math.PI}deg)`,
                                }}
                            >
                                <svg className="w-6 h-6 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors duration-200"
                >
                    {isPlaying ? (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                            </svg>
                            Pause
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Play
                        </>
                    )}
                </button>

                <div className="text-sm text-muted-foreground">Step {animationStep + 1} of 6</div>

                <button
                    onClick={() => setAnimationStep((prev) => (prev + 1) % 6)}
                    className="flex items-center gap-2 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors duration-200"
                >
                    Next Step
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </button>
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 bg-card/20 rounded-lg border border-border/10">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500/80 rounded"></div>
                        <span className="text-muted-foreground">High Pollution</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span className="text-muted-foreground">Wind Direction</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-card/50 rounded border border-border/20"></div>
                        <span className="text-muted-foreground">Clean Air</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
