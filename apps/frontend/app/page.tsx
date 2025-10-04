"use client"

import AnimatedCounter from "@/components/ui/AnimatedCounter"
import FeatureCard from "@/components/ui/FeatureCard"
import ScrollReveal from "@/components/ui/ScrollReveal"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const features = [
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Real-time Monitoring",
      description:
        "Access live air quality data from over 13,000 global monitoring stations with instant updates and alerts.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: "Predictive Analytics",
      description:
        "Advanced forecasting using wind patterns and atmospheric modeling to predict air quality changes hours ahead.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      title: "Health-focused Advice",
      description:
        "Personalized recommendations and health alerts based on current air quality conditions and your location.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Global Coverage",
      description:
        "Comprehensive worldwide coverage with satellite imagery and ground-based measurements for accurate insights.",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/videos/hero-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div
            className={`transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">
              Breathe Easier.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Plan Smarter.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty leading-relaxed">
              Your personal, real-time global air quality forecast powered by advanced atmospheric modeling and
              satellite data.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center mx-5 px-8 py-4 text-lg font-semibold text-primary-foreground bg-gradient-to-r from-primary to-accent rounded-full hover:scale-105 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 animate-pulse-glow"
            >
              View Live Dashboard
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/heatmap"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-black bg-amber-400 from-primary to-accent rounded-full hover:scale-105 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 animate-pulse-glow"
            >
              View HeatMap
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <ScrollReveal>
        <section className="py-20 bg-gradient-to-b from-background to-card/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  <AnimatedCounter value={13000} />+
                </div>
                <p className="text-muted-foreground">Global Monitoring Stations</p>
              </div>
              <div className="p-6">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                  <AnimatedCounter value={195} />
                </div>
                <p className="text-muted-foreground">Countries Covered</p>
              </div>
              <div className="p-6">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  <AnimatedCounter value={24} />
                  /7
                </div>
                <p className="text-muted-foreground">Real-time Updates</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Features Section */}
      <ScrollReveal>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                Advanced Air Quality Intelligence
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                Combining cutting-edge technology with global environmental data to provide the most accurate and
                actionable air quality insights.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 100}
                />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* How It Works Section */}
      <ScrollReveal>
        <section className="py-20 bg-gradient-to-b from-card/20 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">How It Works</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                Our platform integrates multiple data sources to provide comprehensive air quality forecasting.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <ScrollReveal delay={200}>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Global Ground Stations</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We source live data from a global network of over 13,000 ground-based monitoring stations, providing
                    hyperlocal, real-time measurements from the WAQI Project.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={400}>
                <div className="text-center p-6">
                  <div
                    className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-float"
                    style={{ animationDelay: "1s" }}
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Weather Forecasts</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Our platform integrates advanced global weather modeling from Open-Meteo, analyzing hourly wind data
                    to predict how pollution will move and disperse.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={600}>
                <div className="text-center p-6">
                  <div
                    className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-float"
                    style={{ animationDelay: "2s" }}
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">NASA Satellite Data</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    For North America, we provide stunning visualization from NASA&apos;s TEMPO satellite, showing
                    high-resolution views of pollutants from space.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA Section */}
      <ScrollReveal>
        <section className="py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
              Ready to Breathe Easier?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Start monitoring air quality in your area with real-time data and predictive insights.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-primary-foreground bg-gradient-to-r from-primary to-accent rounded-full hover:scale-105 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
            >
              Launch Dashboard
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
