"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { SpecializedTreatmentCard } from "./SpecializedTreatmentCard"
import { getSpecializedTreatmentsForPatient } from "@/lib/actions/specialized-treatment"

interface SpecializedTreatmentsSectionProps {
  patientId: string
}

export function SpecializedTreatmentsSection({ patientId }: SpecializedTreatmentsSectionProps) {
  const [treatments, setTreatments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTreatments() {
      try {
        const data = await getSpecializedTreatmentsForPatient(patientId)
        setTreatments(data)
      } catch (error) {
        console.error("Error fetching treatments:", error)
        setError(error instanceof Error ? error.message : 'Failed to fetch treatments')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTreatments()
  }, [patientId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        {error}
      </div>
    )
  }

  const handleStatusUpdate = (treatment: any) => {
    // Just a placeholder function since we're only showing status
    console.log("Treatment status updated:", treatment.id)
  }

  return (
    <div className="space-y-4">
      {treatments.map((treatment) => (
        <SpecializedTreatmentCard
          key={treatment.id}
          treatment={treatment}
          onStatusUpdate={handleStatusUpdate}
        />
      ))}
      {treatments.length === 0 && (
        <div className="text-center p-8 text-muted-foreground">
          No specialized treatment requests found
        </div>
      )}
    </div>
  )
} 