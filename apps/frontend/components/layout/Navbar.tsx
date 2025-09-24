"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import axios from "axios"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/about", label: "Technology" },
  ]

  // Check if user is authenticated - runs on mount and when pathname changes
  useEffect(() => {
    const checkSession = async () => {
      setAuthLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/user/session`, {
          withCredentials: true,
        });
        if (response.data.message.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };
    checkSession();
  }, [pathname]); // Re-run when pathname changes to catch login/logout

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/user/logout`, {}, { withCredentials: true });
      setIsAuthenticated(false);
      setIsMenuOpen(false); // Close mobile menu on logout
      router.push("/");
      // Force a quick re-check of session status
      setTimeout(() => {
        checkSessionQuick();
      }, 100);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Quick session check without loading state for immediate UI update
  const checkSessionQuick = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/user/session`, {
        withCredentials: true,
      });
      setIsAuthenticated(response.data.message.isAuthenticated);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4">
      <div className="bg-slate-200/40 backdrop-blur-lg border border-black/10 rounded-full shadow-xl px-6 py-3 max-w-6xl w-full mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group md:mx-10 mx-4">
            <div className="w-15 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md">
              <span className="text-white font-bold text-sm">AirQ</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-between">
            <div className="flex items-center space-x-6">
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

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              <Link
                href="/community"
                className="px-4 py-2 text-lg font-bold text-slate-700 hover:text-slate-900 rounded-full transition-all duration-300 hover:scale-105 hover:bg-black/10"
              >
                Community
              </Link>

              {authLoading ? (
                <div className="px-4 py-2 text-lg font-bold text-slate-500 rounded-full">
                  Loading...
                </div>
              ) : isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-lg font-bold text-red-600 hover:text-red-800 rounded-full transition-all duration-300 hover:scale-105 hover:bg-red-100/50 border border-red-200/50"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/signin"
                  className="px-4 py-2 text-lg font-bold text-slate-700 hover:text-slate-900 rounded-full transition-all duration-300 hover:scale-105 hover:bg-black/10"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button and auth status */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Show auth status on mobile when menu is closed */}
            {!isMenuOpen && !authLoading && (
              <div className="flex items-center space-x-2 mr-2">
                {isAuthenticated ? (
                  <span className="text-xs text-green-600 font-medium bg-green-100/50 px-2 py-1 rounded-full">
                    Logged In
                  </span>
                ) : (
                  <span className="text-xs text-slate-600 font-medium bg-slate-100/50 px-2 py-1 rounded-full">
                    Guest
                  </span>
                )}
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full text-slate-700 hover:text-slate-900 hover:bg-black/10 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <g className={`transition-all duration-300 ${isMenuOpen ? "rotate-180" : "rotate-0"}`}>
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18-6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </g>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
            }`}
        >
          <div className="border-t border-black/20 pt-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 text-base font-medium rounded-full transition-all duration-300 hover:scale-105 transform ${isActive(item.href)
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

              {/* Mobile auth buttons */}
              <div className="border-t border-black/20 pt-4 mt-2 space-y-3">
                <Link
                  href="/community"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-base font-medium text-slate-700 hover:text-slate-900 rounded-full transition-all duration-300 hover:scale-105 hover:bg-black/10 block"
                >
                  Community
                </Link>

                {authLoading ? (
                  <div className="px-4 py-3 text-base font-medium text-slate-500 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                    Checking auth...
                  </div>
                ) : isAuthenticated ? (
                  <button
                    onClick={() => {
                      handleLogout();
                    }}
                    className="px-4 py-3 text-base font-medium text-red-600 hover:text-red-800 rounded-full transition-all duration-300 hover:scale-105 hover:bg-red-100/50 border border-red-200/50 w-full text-left flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 text-base font-medium text-slate-700 hover:text-slate-900 rounded-full transition-all duration-300 hover:scale-105 hover:bg-black/10 block flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}