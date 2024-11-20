import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DoctorWithServices } from "@/types"
import Image from "next/image"

interface DoctorCardProps {
  doctor: DoctorWithServices
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const isAvailable = doctor.Services?.homeService?.isActive ?? false

  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] relative">
        <Image
          src="/images/placeholder-doctor.jpg"
          alt={doctor.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{doctor.title} {doctor.name}</h3>
            <Badge variant={isAvailable ? "default" : "destructive"} >
              {isAvailable ? "Available" : "Not Available"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
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
        >
          Book Now
        </Button>
      </div>
    </Card>
  )
}
