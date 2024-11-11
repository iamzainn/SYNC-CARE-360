'use client'
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { useLocationStore } from "@/store/useLocationStore"
import { determineMainCity } from "@/utils/cityHelper"


export const LocationDetectButton = () => {
  const { setLocation, setCoordinates, setError, setLoading } = useLocationStore()

  const detectLocation = () => {
    setLoading(true)
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          setCoordinates(latitude, longitude)
          
          // Reverse geocoding using OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
          const data = await response.json()
          
          // Log the full response for debugging
          console.log('Full location data:', data)
          
          // Determine main city from address data
          const mainCity = determineMainCity(data.address)
          console.log('Main city:', mainCity)
          
          if (mainCity) {
            setLocation(mainCity)
            setError(null)
          } else {
            console.log('Location details:', {
              city: data.address.city,
              town: data.address.town,
              village: data.address.village,
              district: data.address.district,
              state: data.address.state
            })
            setError("Please select Lahore, Karachi, or Islamabad")
          }
        } catch (error) {
          console.error('Location detection error:', error)
          setError("Failed to detect location")
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        setError("Unable to retrieve your location")
        setLoading(false)
      }
    )
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={detectLocation}
      className="flex items-center gap-2"
    >
      <MapPin className="h-4 w-4" />
      Detect
    </Button>
  )
}