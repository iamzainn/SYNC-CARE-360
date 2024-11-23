import { format, isBefore, isToday, set } from "date-fns"
import { DoctorWithDetails } from "@/lib/actions/doctor2"
import { Button } from "@/components/ui/button"

interface DaySlotsProps {
  date: Date
  doctor: DoctorWithDetails
  onSlotSelect: (date: Date, time: string) => void
  isToday: boolean
}

const SESSIONS = {
  morning: { start: 9, end: 12, label: "Morning" },
  afternoon: { start: 12, end: 17, label: "Afternoon" },
  evening: { start: 17, end: 21, label: "Evening" }
} as const

export function DaySlots({ date, doctor, onSlotSelect, isToday }: DaySlotsProps) {
  const now = new Date()
  
  const generateTimeSlots = (sessionStart: number, sessionEnd: number) => {
    const slots: { time: string; isDisabled: boolean }[] = []
    for (let hour = sessionStart; hour < sessionEnd; hour++) {
      for (let minute = 0; minute < 60; minute += 20) {
        const slotTime = set(date, { hours: hour, minutes: minute })
        const timeString = format(slotTime, "HH:mm")
        
        // Check if slot is in past or reserved
        const isDisabled :any =
          (isToday && isBefore(slotTime, now)) ||
          doctor.onlineService?.slots.some(
            slot => slot.startTime === timeString && slot.isReserved
          )

        slots.push({
          time: timeString,
          isDisabled
        })
      }
    }
    return slots
  }

  return (
    <div className="space-y-6">
      {Object.entries(SESSIONS).map(([session, { start, end, label }]) => {
        const slots = generateTimeSlots(start, end)
        if (!slots.length) return null

        return (
          <div key={session} className="space-y-3">
            <h4 className="font-medium text-muted-foreground">{label}</h4>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {slots.map(({ time, isDisabled }) => (
                <Button
                  key={time}
                  variant="outline"
                  size="sm"
                  disabled={isDisabled}
                  onClick={() => onSlotSelect(date, time)}
                  className={isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                >
                  {format(
                    set(date, {
                      hours: parseInt(time.split(":")[0]),
                      minutes: parseInt(time.split(":")[1])
                    }),
                    "h:mm a"
                  )}
                </Button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}