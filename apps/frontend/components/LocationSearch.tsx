"use client"

import { searchLocations } from "@/actions/geocoding"
import { useState, useEffect } from "react"
import { useDebounce } from "use-debounce"

interface LocationSearchProps {
  onLocationSelect: (lat: number, lon: number, name: string) => void
}

export default function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState("")
  type GeoResult = { formatted: string; geometry: { lat: number; lng: number }; annotations?: { geohash?: string } }
  const [suggestions, setSuggestions] = useState<GeoResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [debouncedQuery] = useDebounce(query, 500) // 500ms delay

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length > 2) {
        setIsLoading(true)
        try {
          const results = await searchLocations(debouncedQuery)
          setSuggestions(results as GeoResult[])
        } catch (error) {
          console.error("Error fetching suggestions:", error)
          setSuggestions([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setSuggestions([])
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedQuery])

  const handleSelect = (result: GeoResult) => {
    onLocationSelect(result.geometry.lat, result.geometry.lng, result.formatted)
    setQuery(result.formatted)
    setSuggestions([])
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city or address..."
          className="w-full bg-input/50 backdrop-blur-sm text-foreground rounded-lg px-4 py-3 border border-border/20 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:outline-none transition-all duration-200 pr-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute z-20 w-full mt-2 bg-card/95 backdrop-blur-md border border-border/20 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {suggestions.map((result, index) => (
            <li
              key={result.annotations?.geohash || index}
              onClick={() => handleSelect(result)}
              className="px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-b border-border/10 last:border-b-0 flex items-center gap-3"
            >
              <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-card-foreground text-sm">{result.formatted}</span>
            </li>
          ))}
        </ul>
      )}

      {query.length > 2 && suggestions.length === 0 && !isLoading && (
        <div className="absolute z-20 w-full mt-2 bg-card/95 backdrop-blur-md border border-border/20 rounded-lg shadow-xl p-4 text-center">
          <p className="text-muted-foreground text-sm">No locations found</p>
        </div>
      )}
    </div>
  )
}
