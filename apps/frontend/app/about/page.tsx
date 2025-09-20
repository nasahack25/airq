"use client"

import ScrollReveal from "@/components/ui/ScrollReveal"
import AdvectionAnimation from "@/components/ui/AdvectionAnimation"

export default function AboutPage() {
    const dataSources = [
        {
            name: "WAQI Project",
            description: "Global network of over 13,000 ground-based air quality monitoring stations",
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                </svg>
            ),
            features: [
                "Real-time measurements from certified stations",
                "Hyperlocal data with GPS coordinates",
                "Multiple pollutant monitoring (PM2.5, PM10, O3, NO2, SO2, CO)",
                "Quality-assured data with validation protocols",
            ],
        },
        {
            name: "Open-Meteo Weather API",
            description: "Advanced global weather modeling for atmospheric predictions",
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                </svg>
            ),
            features: [
                "Hourly wind speed and direction data",
                "High-resolution atmospheric modeling",
                "Global coverage with 1km resolution",
                "7-day weather forecasts for prediction accuracy",
            ],
        },
        {
            name: "NASA TEMPO Satellite",
            description: "Cutting-edge satellite imagery for North American pollution visualization",
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                    />
                </svg>
            ),
            features: [
                "High-resolution NO2 column measurements",
                "Hourly daytime observations",
                "Spatial resolution down to 2.1 x 4.4 km",
                "Real-time pollution plume visualization",
            ],
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20">
            {/* Hero Section */}
            <section className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center max-w-4xl mx-auto">
                            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                                The Science Behind{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">AirQ</span>
                            </h1>
                            <p className="text-xl lg:text-2xl text-muted-foreground text-pretty leading-relaxed">
                                Advanced atmospheric modeling meets real-world data to predict how air quality changes over time and
                                space.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Advection Model Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 text-balance">
                                The Predictive Model: Advection Explained
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-4xl mx-auto text-pretty leading-relaxed">
                                At the heart of AirQ is a scientific principle called advection. Our model treats pollution like a plume
                                of smoke and wind as the force that moves it.
                            </p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={200}>
                        <AdvectionAnimation />
                    </ScrollReveal>

                    <ScrollReveal delay={400}>
                        <div className="mt-12 max-w-4xl mx-auto">
                            <div className="glass-dark p-8 rounded-2xl border border-border/20">
                                <p className="text-lg text-card-foreground leading-relaxed text-center">
                                    We create a digital grid representing the area around you, place the current pollution level at its
                                    center, then use real wind data to mathematically 'push' that plume across the grid, hour by hour. The
                                    result is our highly accurate forecast that helps you plan your day with confidence.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Data Sources Section */}
            <section className="py-20 bg-gradient-to-b from-card/10 to-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 text-balance">Our Data Sources</h2>
                            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
                                AirQ combines multiple authoritative data sources to provide the most comprehensive and accurate air
                                quality insights available.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="space-y-12">
                        {dataSources.map((source, index) => (
                            <ScrollReveal key={index} delay={index * 200}>
                                <div className="glass-dark p-8 rounded-2xl border border-border/20 hover:border-primary/30 transition-all duration-500">
                                    <div className="flex flex-col lg:flex-row gap-8">
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                                                {source.icon}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-foreground mb-3">{source.name}</h3>
                                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{source.description}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {source.features.map((feature, featureIndex) => (
                                                    <div key={featureIndex} className="flex items-start gap-3">
                                                        <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-card-foreground text-sm leading-relaxed">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technical Specifications */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 text-balance">
                                Technical Specifications
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
                                Built with precision and performance in mind, AirQ delivers enterprise-grade air quality intelligence.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: "Update Frequency",
                                value: "Hourly",
                                description: "Real-time data updates every hour",
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                title: "Forecast Range",
                                value: "8 Hours",
                                description: "Predictive analytics for planning ahead",
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                ),
                            },
                            {
                                title: "Global Coverage",
                                value: "195 Countries",
                                description: "Worldwide monitoring network",
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                title: "Data Accuracy",
                                value: "±5 AQI",
                                description: "Validated against ground truth",
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                ),
                            },
                        ].map((spec, index) => (
                            <ScrollReveal key={index} delay={index * 100}>
                                <div className="glass-dark p-6 rounded-2xl border border-border/20 text-center hover:border-primary/30 transition-all duration-300">
                                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                        {spec.icon}
                                    </div>
                                    <div className="text-2xl font-bold text-foreground mb-1">{spec.value}</div>
                                    <div className="text-sm font-semibold text-primary mb-2">{spec.title}</div>
                                    <div className="text-xs text-muted-foreground">{spec.description}</div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <ScrollReveal>
                <section className="py-20">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 text-balance">
                            Experience the Technology
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 text-pretty">
                            See our advanced air quality modeling in action with real-time data and predictions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/dashboard"
                                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-primary-foreground bg-gradient-to-r from-primary to-accent rounded-full hover:scale-105 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
                            >
                                Try the Dashboard
                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </a>
                            <a
                                href="/"
                                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-foreground bg-card/50 border border-border/20 rounded-full hover:bg-card/70 hover:border-primary/30 transition-all duration-300"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}
