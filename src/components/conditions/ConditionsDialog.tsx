'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { useLocationStore } from '@/store/useLocationStore'
import { CONDITIONS } from '@/lib/conditions/data'
interface ConditionsDialogProps {
  isOpen: boolean
  onClose: () => void
}

export const ConditionsDialog = ({ isOpen, onClose }: ConditionsDialogProps) => {
  const router = useRouter()
  const location = useLocationStore(state => state.location)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredConditions, setFilteredConditions] = useState(CONDITIONS)

  useEffect(() => {
    const filtered = CONDITIONS.filter(condition =>
      condition.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredConditions(filtered)
  }, [searchTerm])

  const handleConditionClick = (urlPath: string) => {
    const currentLocation = location || 'lahore'
    router.push(`/pakistan/${currentLocation}/condition/${urlPath}`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 bg-white">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Find doctors by condition
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for condition"
              className="pl-10 h-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Conditions Grid */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredConditions.map((condition) => {
              const Icon = condition.icon
              return (
                <button
                  key={condition.id}
                  onClick={() => handleConditionClick(condition.urlPath)}
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-base text-gray-900 font-medium">
                    {condition.title}
                  </span>
                </button>
              )}
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
