
// components/slots/TimeSlotsGrid.tsx
import { useMemo } from "react"
import { format, isToday, parse } from "date-fns"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DayOfWeek } from "@prisma/client"

interface TimeSlot {
  id: string
  dayOfWeek: string | DayOfWeek
  startTime: string
  endTime: string
  isReserved: boolean
}

interface TimeSlotsGridProps {
  slots: TimeSlot[]
  selectedDate: Date
  selectedSlot: TimeSlot | null
  onSlotSelect: (slot: TimeSlot) => void
}

export function TimeSlotsGrid({
  slots,
  selectedDate,
  selectedSlot,
  onSlotSelect
}: TimeSlotsGridProps) {
  // Get slots for the selected date's day
  const daySlots = useMemo(() => {
    const selectedDay = format(selectedDate, 'EEEE').toUpperCase() as DayOfWeek
    const now = new Date()
    const isSelectedDateToday = isToday(selectedDate)

    return slots
      .filter(slot => slot.dayOfWeek === selectedDay)
      .map(slot => {
        // Check if slot is in the past for today
        let isPast = false
        if (isSelectedDateToday) {
          const slotTime = parse(slot.startTime, 'HH:mm', new Date())
          isPast = slotTime < now
        }

        return {
          ...slot,
          isPast
        }
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }, [slots, selectedDate])

  // Group slots by session
  const groupedSlots = useMemo(() => {
    return daySlots.reduce((acc, slot) => {
      const hour = parseInt(slot.startTime.split(':')[0])
      let session: 'morning' | 'afternoon' | 'evening'

      if (hour < 12) session = 'morning'
      else if (hour < 17) session = 'afternoon'
      else session = 'evening'

      if (!acc[session]) acc[session] = []
      acc[session].push(slot)
      return acc
    }, {} as Record<'morning' | 'afternoon' | 'evening', typeof daySlots>)
  }, [daySlots])

  const sessionIcons = {
    morning: "🌅 Morning",
    afternoon: "🌤️ Afternoon",
    evening: "🌙 Evening"
  }

  if (daySlots.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No appointments available for {format(selectedDate, 'EEEE, MMMM d')}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {(Object.entries(groupedSlots) as [keyof typeof sessionIcons, typeof daySlots][])
        .map(([session, sessionSlots]) => {
          if (!sessionSlots?.length) return null

          return (
            <div key={session} className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                {sessionIcons[session]}
              </h4>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {sessionSlots.map((slot) => {
                  const isDisabled = slot.isReserved || slot.isPast

                  return (
                    <Button
                      key={slot.id}
                      variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                      size="sm"
                      disabled={isDisabled}
                      onClick={() => onSlotSelect(slot)}
                      className={cn(
                        "relative group",
                        isDisabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
                        slot.isPast && "bg-gray-100"
                      )}
                    >
                      <Clock className="h-3 w-3 mr-2" />
                      {format(parse(slot.startTime, 'HH:mm', new Date()), 'h:mm a')}
                      
                      {/* Tooltip */}
                      {isDisabled && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 
                          bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap 
                          opacity-0 group-hover:opacity-100 transition-opacity">
                          {slot.isReserved ? "Already booked" : "Time has passed"}
                        </span>
                      )}
                    </Button>
                  )
                })}
              </div>
            </div>
          )
        })}
    </div>
  )
}
