"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { SpecializedTreatmentCard } from "./SpecializedTreatmentCard"

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
        setIsLoading(true)
        const res = await fetch(`/api/patient/treatments/specialized?patientId=${patientId}`)
        if (!res.ok) throw new Error('Failed to fetch treatments')
        const data = await res.json()
        setTreatments(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch treatments')
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

  return (
    <div className="space-y-4">
      {treatments.map((treatment) => (
        <SpecializedTreatmentCard
          key={treatment.id}
          treatment={treatment}
          onStatusUpdate={(updatedTreatment) => {
            setTreatments(prevTreatments => 
              prevTreatments.map(t => 
                t.id === updatedTreatment.id ? updatedTreatment : t
              )
            )
          }}
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