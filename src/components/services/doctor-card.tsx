import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DoctorWithServices } from "@/types"
import Image from "next/image"
import { User } from "lucide-react"
import { useState } from "react"
import { HomeServiceDialog } from "./booking-dialogue"

interface DoctorCardProps {
  doctor: DoctorWithServices
}


export function DoctorCard({ doctor }: DoctorCardProps) {
  const isAvailable = doctor.Services?.homeService?.isActive ?? false
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] relative bg-gray-100">
        {doctor.verification?.profilePhoto ? (
          <Image
            src={doctor.verification.profilePhoto}
            alt={doctor.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="h-20 w-20 text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{doctor.title} {doctor.name}</h3>
            <Badge variant={isAvailable?"default":"secondary"}>
              {isAvailable ? "Available" : "Not Available"}
            </Badge>
          </div>
          
        </div>

        {doctor.Services?.homeService?.specializations.length as number > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Services Offered:</p>
            <div className="flex flex-wrap gap-2">
              {doctor.Services?.homeService?.specializations.map(spec => (
                <Badge key={spec.type} variant="outline">
                  {spec.type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button 
          className="w-full" 
          disabled={!isAvailable}
          onClick={() => setIsBookingOpen(true)}
        >
          Book Now
        </Button>

        <HomeServiceDialog 
doctor={doctor}
isOpen={isBookingOpen}
onClose={() => setIsBookingOpen(false)}
/>
      </div>
    </Card>


  )
}
