"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AQ</span>
              </div>
              <span className="text-xl font-bold text-foreground">AirQ</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Global air quality forecasting platform providing real-time monitoring, predictive analytics, and
              health-focused insights to help you breathe easier and plan smarter.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                >
                  Technology
                </Link>
              </li>
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Data Sources</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-muted-foreground text-sm">WAQI Project</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">Open-Meteo</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">NASA TEMPO</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 AirQ. Helping you breathe easier with data-driven insights.
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="text-xs text-muted-foreground">Powered by global environmental data</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
