"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { BadgeCheck, Calendar, Clock, Video } from "lucide-react"
import { cn } from "@/lib/utils"
import { DoctorWithDetails } from "@/lib/actions/doctor2"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {OnlineBookingDialog } from "./TwoBookingDialgue"


interface DoctorCardProps {
  doctor: DoctorWithDetails
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const nextAvailableSlot = doctor.onlineService?.slots[0]
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const toast = useToast()

  const handleBooking = () => {
    // If you want to check auth before opening dialog
    // if (!user) {
    //   toast({
    //     title: "Login Required",
    //     description: "Please login to book an appointment",
    //     variant: "destructive"
    //   })
    //   return
    // }

    if (!doctor.onlineService?.isActive) {
      // toast({
      //   title: "Not Available",
      //   description: "This doctor is not currently accepting online appointments",
      //   variant: "destructive"
      // })
      return
    }

    setIsBookingOpen(true)
  }

  return (
    <>
    <Card className="w-full max-w-3xl mx-auto">
      {/* Top section */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-24 w-24 border-2 border-primary/10">
            <AvatarImage 
              src={doctor.verification?.profilePhoto} 
              alt={doctor.name}
              className="object-cover"
            />
            <AvatarFallback className="text-lg">
              {doctor.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Dr. {doctor.name}</h3>
                </div>
                <p className="text-muted-foreground">{doctor.verification?.specialization[0]}</p>
                <p className="text-sm text-muted-foreground">{doctor.verification?.experienceYears} Years Experience</p>
              </div>
              {doctor.isVerifiedDoctor && (
                <Badge variant="outline" className="h-6 bg-primary/5 text-primary">
                  <BadgeCheck className="mr-1 h-4 w-4" />
                  PMC Verified
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-4">
              <div className="text-sm">
                <p className="text-muted-foreground">Wait Time</p>
                <p className="font-medium">15-30 Min</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Experience</p>
                <p className="font-medium">{doctor.verification?.experienceYears} Years</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Satisfied Patients</p>
                <p className="font-medium">99% (150+)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video consultation section */}
      {doctor.onlineService && (
        <div className="border-t p-6 bg-gray-50/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                <span className="font-medium">Video Consultation</span>
              </div>
              <Badge variant="secondary" className="font-semibold text-lg">
                Rs. {doctor.onlineService.fee}
              </Badge>
            </div>

            {nextAvailableSlot && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Next Available: {nextAvailableSlot.dayOfWeek}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{nextAvailableSlot.startTime}</span>
                </div>
              </div>
            )}

         {doctor.onlineService && (
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 h-11"
              >
                <Video className="mr-2 h-4 w-4" />
                Video Consultation
              </Button>
              <Button 
                className="flex-1 h-11 bg-[#FF9100] hover:bg-[#FF9100]/90"
                onClick={handleBooking}
              >
                Book Appointment
              </Button>
            </div>
          )}
          </div>
        </div>
      )}
    </Card>
     <OnlineBookingDialog 
     doctor={doctor}
     isOpen={isBookingOpen}
     onClose={() => setIsBookingOpen(false)}
   />
   </>

  )
}