"use client"

import { Badge } from "@/components/ui/badge"


import { OnlineServiceData } from "@/types"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getOnlineService } from "@/lib/actions/online-service"
import { DAYS } from "@/lib/constants/home-services"

export function OnlineServiceDetails() {
  const [data, setData] = useState<OnlineServiceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getOnlineService()
      if (response.data?.onlineService) {
        setData(response.data.onlineService)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No online service details available
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Consultation Fee Section */}
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Consultation Fee</h3>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            Rs. {data.fee}
          </Badge>
        </div>
      </Card>

      {/* Time Slots Section */}
      <Card className="p-4">
        <h3 className="font-medium mb-4">Available Time Slots</h3>
        <div className="grid gap-4">
          {DAYS.map(day => {
            const daySlots = data.slots.filter(slot => slot.dayOfWeek === day)
            if (daySlots.length === 0) return null

            return (
              <div key={day} className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {day.charAt(0) + day.slice(1).toLowerCase()}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {daySlots
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((slot, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className={cn(
                          "bg-blue-50/50 px-3 py-1.5",
                          slot.isReserved && "bg-gray-100 text-muted-foreground"
                        )}
                      >
                        {slot.startTime} - {slot.endTime}
                        {slot.isReserved && (
                          <span className="ml-2 text-xs">(Reserved)</span>
                        )}
                      </Badge>
                    ))}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Additional Info Section */}
      <Card className="p-4 text-sm text-muted-foreground">
        <ul className="space-y-1 list-disc list-inside">
          <li>Appointments are scheduled in 20-minute intervals</li>
          <li>Available hours: 9:00 AM - 6:00 PM</li>
          <li>Please arrive 5 minutes before your scheduled time</li>
        </ul>
      </Card>
    </div>
  )
}