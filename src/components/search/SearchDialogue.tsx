'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { MapPin, Search, X } from 'lucide-react'
import { useLocationStore } from '@/store/useLocationStore'
import { LocationDetectButton } from './LocationDetectButton'
import { cn } from '@/lib/utils'

interface Specialty {
  id: string
  title: string
  urlPath: string
}

const SPECIALTIES: Specialty[] = [
  { id: '1', title: 'Gynecologist', urlPath: 'gynecologist' },
  { id: '2', title: 'Skin Specialist', urlPath: 'dermatologist' },
  { id: '3', title: 'Child Specialist', urlPath: 'pediatrician' },
  { id: '4', title: 'Neurologist', urlPath: 'neurologist' },
  { id: '5', title: 'Orthopedic Surgeon', urlPath: 'orthopedic-surgeon' },
  { id: '6', title: 'Gastroenterologist', urlPath: 'gastroenterologist' },
  { id: '7', title: 'Endocrinologist', urlPath: 'endocrinologist' },
]

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
}

export const SearchDialog = ({ isOpen, onClose }: SearchDialogProps) => {
  const router = useRouter()
  const { location } = useLocationStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredSpecialties, setFilteredSpecialties] = useState(SPECIALTIES)

  // Filter specialties based on search term
  useEffect(() => {
    const filtered = SPECIALTIES.filter(specialty =>
      specialty.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredSpecialties(filtered)
  }, [searchTerm])

  const handleSpecialtyClick = (specialty: Specialty) => {
    if (location) {
      router.push(`/pakistan/${location.toLowerCase()}/${specialty.urlPath}`)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search for doctors</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        {/* Location Section */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Input
              value={location || ''}
              readOnly
              placeholder="Select Location"
              className="pl-10"
            />
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <LocationDetectButton />
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for doctors, hospitals, specialties, services, diseases"
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        {/* Specialties List */}
        <div className="space-y-2">
          {filteredSpecialties.map((specialty) => (
            <button
              key={specialty.id}
              onClick={() => handleSpecialtyClick(specialty)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-lg",
                "text-left hover:bg-gray-100 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary"
              )}
            >
              <span>{specialty.title}</span>
              <span className="text-sm text-gray-500">Specialty</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}