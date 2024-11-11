import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface LocationState {
  location: string
  coordinates: {
    latitude: number | null
    longitude: number | null
  }
  isLoading: boolean
  error: string | null
  setLocation: (location: string) => void
  setCoordinates: (lat: number, lng: number) => void
  setError: (error: string | null) => void
  setLoading: (status: boolean) => void
}

export const useLocationStore = create<LocationState>()(
  devtools((set) => ({
    location: '',
    coordinates: {
      latitude: null,
      longitude: null
    },
    isLoading: false,
    error: null,
    setLocation: (location) => set({ location }),
    setCoordinates: (latitude, longitude) => 
      set({ coordinates: { latitude, longitude } }),
    setError: (error) => set({ error }),
    setLoading: (status) => set({ isLoading: status })
  }))
)