
import { DayOfWeek } from "@prisma/client"

export type SessionType = 'morning' | 'afternoon' | 'evening'

export interface TimeSlot {
  time: string
  isReserved: boolean
  session: SessionType
  isPast: boolean
}

export interface BookingSlot {
  date: Date
  time: string
}

// components/booking/BookingDialog/index.tsx
"use client"

import { useState, useCallback } from "react"
import { addDays, format, isToday, startOfToday, parseISO } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { DoctorWithDetails } from "@/lib/actions/doctor2"


import { Separator } from "@/components/ui/separator"

interface BookingDialogProps {
  doctor: DoctorWithDetails
  isOpen: boolean
  onClose: () => void
}

export function BookingDialog({ doctor, isOpen, onClose }: BookingDialogProps) {
  const [selectedDate, setSelectedDate] = useState(startOfToday())
  const [startDate, setStartDate] = useState(startOfToday())
  const dates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))

  // Helper to categorize time into sessions
  const getSession = (time: string): SessionType => {
    const hour = parseInt(time.split(':')[0])
    if (hour < 12) return 'morning'
    if (hour < 17) return 'afternoon'
    return 'evening'
  }

  // Get available slots for selected day
  const getDaySlots = useCallback((date: Date) => {
    const dayOfWeek = format(date, 'EEEE').toUpperCase() as DayOfWeek
    const now = new Date()
    const isSelectedDateToday = isToday(date)
    
    const daySlots = doctor.onlineService?.slots.filter(
      slot => slot.dayOfWeek === dayOfWeek
    ) || []

    const slotsBySession = daySlots.reduce((acc, slot) => {
      const session = getSession(slot.startTime)
      if (!acc[session]) acc[session] = []
      
      // Check if slot is in the past for today
      let isPastSlot = false
      if (isSelectedDateToday) {
        const [slotHour, slotMinute] = slot.startTime.split(':').map(Number)
        const slotDate = new Date()
        slotDate.setHours(slotHour, slotMinute, 0)
        isPastSlot = slotDate <= now
      }
      
      acc[session].push({
        time: slot.startTime,
        isReserved: slot.isReserved || isPastSlot,
        session,
        isPast: isPastSlot
      })
      
      return acc
    }, {} as Record<SessionType, TimeSlot[]>)

    return slotsBySession
  }, [doctor.onlineService?.slots])

  const selectedDaySlots = getDaySlots(selectedDate)

  const handlePrevWeek = () => {
    setStartDate(prev => addDays(prev, -7))
  }

  const handleNextWeek = () => {
    setStartDate(prev => addDays(prev, 7))
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleSlotSelect = (time: string) => {
    // Here you'll add your booking logic
    console.log('Selected slot:', { date: selectedDate, time })
  }

  const renderSlot = (slot: TimeSlot) => {
    const tooltipText = slot.isPast 
      ? "This time has passed" 
      : slot.isReserved 
      ? "Already booked"
      : ""

    return (
      <Button
        variant="outline"
        size="sm"
        disabled={slot.isReserved || slot.isPast}
        onClick={() => handleSlotSelect(slot.time)}
        className={cn(
          "text-sm relative group transition-all",
          "hover:border-primary hover:bg-primary/5",
          (slot.isReserved || slot.isPast) && "opacity-50 cursor-not-allowed hover:bg-transparent",
          slot.isPast && "bg-gray-100"
        )}
      >
        {format(parseISO(`2024-01-01T${slot.time}`), 'h:mm a')}
        
        {tooltipText && (
          <span className="invisible group-hover:visible absolute -top-8 left-1/2 -translate-x-1/2 
            bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-50">
            {tooltipText}
          </span>
        )}
      </Button>
    )
  }

  const renderSession = (session: SessionType) => {
    const slots = selectedDaySlots[session] || []
    const sessionIcons = {
      morning: "🌅",
      afternoon: "🌤️",
      evening: "🌙"
    }
    
    return (
      <div key={session} className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{sessionIcons[session]}</span>
          <h4 className="font-medium text-muted-foreground capitalize">
            {session}
          </h4>
        </div>
        
        {slots.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No slots available for this session
          </p>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {slots
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((slot, idx) => (
                <div key={idx}>
                  {renderSlot(slot)}
                </div>
              ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={doctor.verification?.profilePhoto} />
              <AvatarFallback>
                {doctor.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl">
                Book Appointment with Dr. {doctor.name}
              </DialogTitle>
              <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                <span>{doctor.verification?.specialization[0]}</span>
                <Badge variant="outline" className="font-semibold">
                  Rs. {doctor.onlineService?.fee}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <Separator className="my-4" />

        <div className="space-y-6">
          {/* Date Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevWeek}
              disabled={startDate <= startOfToday()}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous Week
            </Button>
            <div className="font-medium">
              {format(dates[0], "MMM d")} - {format(dates[6], "MMM d, yyyy")}
            </div>
            <Button variant="outline" size="sm" onClick={handleNextWeek}>
              Next Week
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-7 gap-4">
            {dates.map(date => (
              <Button
                key={date.toISOString()}
                variant={selectedDate.toDateString() === date.toDateString() ? "default" : "outline"}
                className={cn(
                  "flex flex-col h-auto py-2",
                  selectedDate.toDateString() === date.toDateString() && "border-2 border-primary"
                )}
                onClick={() => handleDateSelect(date)}
                disabled={date < startOfToday()}
              >
                <span className="text-sm font-normal">
                  {format(date, "EEE")}
                </span>
                <span className="text-lg font-semibold">
                  {format(date, "d")}
                </span>
              </Button>
            ))}
          </div>

          <Separator />

          {/* Available Slots */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Available slots for {format(selectedDate, "EEEE, MMMM d")}</span>
            </div>
            
            <div className="space-y-8">
              {(['morning', 'afternoon', 'evening'] as const).map(session => renderSession(session))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}