"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type City = string

interface Coordinates {
  lat: number
  lng: number
}

interface LocationContextType {
  city: City
  setCity: (city: City) => void
  pincode?: string
  coordinates: Coordinates | null
  detectLocation: () => Promise<void>
  isLoadingLocation: boolean
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [city, setCity] = useState<City>("Mumbai")
  const [pincode, setPincode] = useState<string>("")
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  useEffect(() => {
    const savedCity = localStorage.getItem("saaz-city") as City
    if (savedCity) {
      setCity(savedCity)
    } else {
      detectLocation()
    }
  }, [])

  const handleSetCity = (newCity: City) => {
    setCity(newCity)
    localStorage.setItem("saaz-city", newCity)
    setCoordinates(null) // Reset coordinates when manually selecting city
  }

  const detectLocation = async () => {
    setIsLoadingLocation(true)
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      setIsLoadingLocation(false)
      return
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true })
      })

      const { latitude, longitude } = position.coords
      setCoordinates({ lat: latitude, lng: longitude })

      // Reverse geocode to get city name
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        )
        const data = await response.json()

        // Try to map to our supported cities or just use what we get
        const detectedCity = data.city || data.locality || "All India"
        const detectedPincode = data.postcode || ""

        setPincode(detectedPincode)

        if (["Mumbai", "Delhi", "Bangalore"].includes(detectedCity)) {
          setCity(detectedCity as City)
          localStorage.setItem("saaz-city", detectedCity)
        } else {
          setCity(detectedCity)
          localStorage.setItem("saaz-city", detectedCity)
        }
      } catch (err) {
        console.error("Reverse geocoding failed", err)
      }

      console.log("Location detected:", latitude, longitude)
    } catch (error) {
      console.error("Error detecting location:", error)
      alert("Unable to retrieve your location")
    } finally {
      setIsLoadingLocation(false)
    }
  }

  return (
    <LocationContext.Provider value={{ city, setCity: handleSetCity, pincode, coordinates, detectLocation, isLoadingLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
}
