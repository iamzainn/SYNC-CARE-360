'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MapPin, ChevronDown } from 'lucide-react'
import { useLocationStore } from '@/store/useLocationStore'
import { LocationDetectButton } from './LocationDetectButton'
import { SearchDialog } from './SearchDialogue'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const PAKISTANI_CITIES = [
  { id: 'lahore', name: 'Lahore' },
  { id: 'karachi', name: 'Karachi' },
  { id: 'islamabad', name: 'Islamabad' }
] as const

export const SearchBox = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const { location, setLocation } = useLocationStore()

  const handleCitySelect = (cityName: string) => {
    setLocation(cityName)
    setIsLocationOpen(false)
  }

  return (
    <div className="flex flex-col space-y-4 w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <Popover open={isLocationOpen} onOpenChange={setIsLocationOpen}>
          <PopoverTrigger asChild>
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Enter location"
                value={location || ''}
                readOnly
                className="pl-10 pr-8 cursor-pointer"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <div className="py-2">
              {PAKISTANI_CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city.name)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{city.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <LocationDetectButton />
      </div>

      <div className="relative">
        <Input
          type="text"
          placeholder="Search for doctors, hospitals, specialties..."
          onClick={() => setIsDialogOpen(true)}
          readOnly
          className="pl-10 cursor-pointer"
        />
        <Button 
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => setIsDialogOpen(true)}
        >
          Search
        </Button>
      </div>

      <SearchDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </div>
  )
}