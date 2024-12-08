"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { BadgeCheck, Calendar, Clock, Video } from "lucide-react"

import { DoctorWithDetails } from "@/lib/actions/doctor2"
import { useState } from "react"
import { OnlineBookingDialog } from "./TwoBookingDialgue"

interface DoctorCardProps {
  doctor: DoctorWithDetails
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const nextAvailableSlot = doctor.onlineService?.slots[0]
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const handleBooking = () => {
    if (!doctor.onlineService?.isActive) {
      return
    }
    setIsBookingOpen(true)
  }

  return (
    <>
    <Card className="w-full max-w-3xl mx-auto">
      {/* Top section */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-primary/10">
            <AvatarImage 
              src={doctor.verification?.profilePhoto} 
              alt={doctor.name}
              className="object-cover"
            />
            <AvatarFallback className="text-base sm:text-lg">
              {doctor.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-2">
              <div className="space-y-1 text-center sm:text-left w-full">
                <div className="flex flex-col sm:flex-row items-center gap-2 justify-center sm:justify-start">
                  <h3 className="text-base sm:text-lg font-semibold">Dr. {doctor.name}</h3>
                  {doctor.isVerifiedDoctor && (
                    <Badge variant="outline" className="h-5 bg-primary/5 text-primary text-xs sm:text-sm">
                      <BadgeCheck className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      PMC Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground text-center sm:text-left">
                  {doctor.verification?.specialization[0]}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                  {doctor.verification?.experienceYears} Years Experience
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6 mt-4">
              <div className="text-center sm:text-left">
                <p className="text-xs text-muted-foreground">Wait Time</p>
                <p className="text-sm font-medium">15-30 Min</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="text-sm font-medium">{doctor.verification?.experienceYears} Years</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs text-muted-foreground">Satisfied Patients</p>
                <p className="text-sm font-medium">99% (150+)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video consultation section */}
      {doctor.onlineService && (
        <div className="border-t p-4 sm:p-6 bg-gray-50/50">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full justify-center sm:justify-start">
                <Video className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-sm sm:text-base font-medium">Video Consultation</span>
              </div>
              <Badge variant="secondary" className="font-semibold text-base">
                Rs. {doctor.onlineService.fee}
              </Badge>
            </div>

            {nextAvailableSlot && (
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Next Available: {nextAvailableSlot.dayOfWeek}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{nextAvailableSlot.startTime}</span>
                </div>
              </div>
            )}

            {doctor.onlineService && (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  className="w-full h-10 sm:h-11"
                >
                  <Video className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Video Consultation
                </Button>
                <Button 
                  className="w-full h-10 sm:h-11 bg-[#FF9100] hover:bg-[#FF9100]/90"
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