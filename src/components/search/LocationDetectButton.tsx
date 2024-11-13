'use client'
import { Button } from "@/components/ui/button"
// import { MapPin } from "lucide-react"
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
          
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
          const data = await response.json()
          
          const mainCity = determineMainCity(data.address)
          
          if (mainCity) {
            setLocation(mainCity)
            setError(null)
          } else {
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
      variant="ghost" 
      size="sm" 
      onClick={detectLocation}
      className="text-[#39B7FF] hover:text-[#2da8f0] hover:bg-transparent px-2"
    >
      Detect
    </Button>
  )
}