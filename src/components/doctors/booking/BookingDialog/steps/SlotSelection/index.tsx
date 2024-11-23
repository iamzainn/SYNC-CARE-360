"use client"

import { useState } from "react"
import { addDays, format, startOfToday } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DoctorWithDetails } from "@/lib/actions/doctor2"
import { DaySlots } from "./DaySlots"

interface SlotSelectionProps {
  doctor: DoctorWithDetails
  onSlotSelect: (date: Date, time: string) => void
}

export function SlotSelection({ doctor, onSlotSelect }: SlotSelectionProps) {
  const [startDate, setStartDate] = useState(startOfToday())

  const dates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))

  const handlePrevWeek = () => {
    setStartDate(prev => addDays(prev, -7))
  }

  const handleNextWeek = () => {
    setStartDate(prev => addDays(prev, 7))
  }

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-6">
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

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-4">
        {dates.map(date => (
          <div
            key={date.toISOString()}
            className="text-center"
          >
            <div className="font-medium mb-1">
              {format(date, "EEE")}
            </div>
            <div className="text-sm text-muted-foreground">
              {format(date, "MMM d")}
            </div>
          </div>
        ))}
      </div>

      {/* Time Slots */}
      <div className="space-y-6">
        <DaySlots
          date={dates[0]}
          doctor={doctor}
          onSlotSelect={onSlotSelect}
          isToday={true}
        />
      </div>
    </div>
  )
}