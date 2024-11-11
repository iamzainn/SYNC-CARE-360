'use client'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { useLocationStore } from "@/store/useLocationStore"
import { LocationDetectButton } from "./LocationDetectButton"
import { SearchDialog } from "./SearchDialogue"
import { useState } from "react"

export const HeroSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { location } = useLocationStore()

  return (
    <Card className="w-full max-w-[1000px] mx-auto overflow-hidden rounded-3xl mt-8">
      <div className="relative w-full bg-gradient-to-r from-[#48323C] via-[#4B2D4B] to-[#1E1B4B]">
        {/* Content Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Text and Search Section */}
          <div className="lg:col-span-8 p-6 lg:p-12">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
              Find and Book the{" "}
              <span className="text-orange-400">Best Doctors</span>{" "}
              <span className="inline">near you</span>
            </h1>

            <div className="flex flex-col gap-2 max-w-2xl">
              {/* Location Input with Detect */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter Location"
                  value={location || ''}
                  readOnly
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-white h-12 text-base pl-8"
                />
                <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <LocationDetectButton />
                </div>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Doctors, Hospital, Conditions"
                  onClick={() => setIsDialogOpen(true)}
                  readOnly
                  className="bg-white h-12 text-base pr-24"
                />
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="absolute right-0 top-0 h-full bg-orange-500 hover:bg-orange-600 text-white px-8 rounded-l-none"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Image Section - Only visible on larger screens */}
          <div className="hidden lg:block lg:col-span-4 relative h-full">
            <img
              src="/images/bg-image.jpg"
              alt="Doctor"
              className="absolute right-0 bottom-0 h-full object-cover object-left"
            />
          </div>
        </div>
      </div>

      <SearchDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </Card>
  )
}