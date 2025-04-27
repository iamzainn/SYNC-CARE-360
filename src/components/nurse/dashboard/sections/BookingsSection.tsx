"use client"

import { Card } from "@/components/ui/card"
import { SpecializedTreatmentList } from "./bookings/SpecializedTreatmentList"

interface BookingsSectionProps {
  nurseId: string
}

export function BookingsSection({ nurseId }: BookingsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Treatment Bookings</h2>
      </div>
      
      <Card className="p-6">
        <SpecializedTreatmentList nurseId={nurseId} />
      </Card>
    </div>
  )
} 