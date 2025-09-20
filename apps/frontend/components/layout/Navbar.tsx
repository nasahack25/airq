"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/about", label: "Technology" },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4">
      <div className="bg-slate-200/40 backdrop-blur-lg border border-black/10 rounded-full shadow-xl px-6 py-3 max-w-2xl w-full">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group mx-10">
            <div className="w-15 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md">
              <span className="text-white font-bold text-sm">AirQ</span>
            </div>
            {/* <span className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
              AirQ
            </span> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-lg font-bold rounded-full transition-all duration-300 hover:scale-105 hover:bg-black/10 ${isActive(item.href) ? "text-slate-800 bg-black/20 shadow-md" : "text-slate-700 hover:text-slate-900"
                  }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full -z-10" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full text-slate-700 hover:text-slate-900 hover:bg-black/10 transition-all duration-300 hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <g className={`transition-all duration-300 ${isMenuOpen ? "rotate-180" : "rotate-0"}`}>
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </g>
            </svg>
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? "max-h-48 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
            }`}
        >
          <div className="border-t border-black/20 pt-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 transform ${isActive(item.href)
                    ? "text-slate-800 bg-black/20 shadow-md"
                    : "text-slate-700 hover:text-slate-900 hover:bg-black/10"
                    } ${isMenuOpen ? `translate-y-0 opacity-100 delay-${index * 100}` : "translate-y-4 opacity-0"}`}
                  style={{
                    transitionDelay: isMenuOpen ? `${index * 100}ms` : "0ms",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
