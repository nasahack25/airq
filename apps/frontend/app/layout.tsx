import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import PageTransition from "@/components/ui/PageTransition"
import FloatingElements from "@/components/ui/FloatingElements"
import { AuthProvider } from "@/context/AuthContext"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "AirQ - Global Air Quality Forecasting",
  description:
    "Real-time air quality monitoring and predictive analytics. Breathe easier with data-driven insights from global environmental monitoring stations.",
  keywords: "air quality, pollution, forecast, health, environment, monitoring",
  authors: [{ name: "AirQ Team" }],
  openGraph: {
    title: "AirQ - Global Air Quality Forecasting",
    description: "Real-time air quality monitoring and predictive analytics",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <FloatingElements />
          <Navbar />
          <main className="flex-1 relative z-10">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
