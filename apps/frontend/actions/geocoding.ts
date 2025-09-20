"use server"

import axios from "axios"

export async function searchLocations(query: string) {
  if (query.length <= 2) {
    return []
  }

  const apiKey = process.env.OPENCAGE_API_KEY
  if (!apiKey) {
    console.error("OpenCage API key not found in server environment.")
    return []
  }

  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${apiKey}&limit=5`,
    )
    return response.data.results || []
  } catch (error) {
    console.error("Error fetching geocoding suggestions:", error)
    return []
  }
}
