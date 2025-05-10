"use client"

import { useState, useEffect } from "react"
import { Loader2, RefreshCw } from "lucide-react"
import { SpecializedTreatmentCard } from "./SpecializedTreatmentCard"
import { getSpecializedTreatmentsForPatient } from "@/lib/actions/specialized-treatment"
import { Button } from "@/components/ui/button"

interface SpecializedTreatmentsSectionProps {
  patientId: string
}

export function SpecializedTreatmentsSection({ patientId }: SpecializedTreatmentsSectionProps) {
  const [treatments, setTreatments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTreatments = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }
      
      const data = await getSpecializedTreatmentsForPatient(patientId)
      setTreatments(data)
      setError(null)
    } catch (error) {
      console.error("Error fetching treatments:", error)
      setError(error instanceof Error ? error.message : 'Failed to fetch treatments')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchTreatments()
  }, [patientId])

  const handleRefresh = () => {
    fetchTreatments(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Treatment Requests</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          {isRefreshing ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3" />
              <span>Refresh</span>
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="text-center p-4 mb-4 border border-red-200 rounded-md bg-red-50 text-red-600">
          {error}
          <Button 
            variant="link" 
            className="ml-2 text-red-700 underline p-0" 
            onClick={() => fetchTreatments()}
          >
            Try again
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {treatments.map((treatment) => (
          <SpecializedTreatmentCard
            key={treatment.id}
            treatment={treatment}
            onStatusUpdate={() => fetchTreatments(true)}
          />
        ))}
        
        {treatments.length === 0 && !isLoading && !error && (
          <div className="text-center p-8 border rounded-md bg-slate-50">
            <p className="text-muted-foreground mb-2">No specialized treatment requests found</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/Services/specialized-treatment"}
            >
              Request New Treatment
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 