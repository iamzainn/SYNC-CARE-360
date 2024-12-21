"use client"

import { useEffect, useState } from "react"
import { DoctorCard } from "./DoctorCard"
import { DoctorCardsGridSkeleton } from "./DoctorCardSkeleton"
import { getDoctors } from "@/lib/actions/doctor2"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface DoctorsListProps {
  city: string
  specialist?: string
  isByCondition:boolean
  conditionSpecialist?:string
  initialDoctors: Awaited<ReturnType<typeof getDoctors>>
  searchParams: { [key: string]: string | undefined }
}

export function DoctorsList({ 
  city, 
  specialist, 
  initialDoctors,
  isByCondition,
  conditionSpecialist,
  searchParams
}: DoctorsListProps) {
  const [doctors, setDoctors] = useState(initialDoctors.doctors)
  const [hasMore, setHasMore] = useState(initialDoctors.hasMore)
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterLoading, setIsFilterLoading] = useState(false)


  const loadMore = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const result = await getDoctors({
        city,
        specialist,
        isByCondition,
        conditionSpecialist,
        skip: doctors.length,
        take: 10,
        gender: searchParams.gender,
        maxFee: searchParams.fee === 'asc' ? 2000 : undefined,
        minExperience: searchParams.experience ? parseInt(searchParams.experience) : undefined
      })

      setDoctors(prev => [...prev, ...result.doctors])
      setHasMore(result.hasMore)
    } catch (error) {
      console.error('Error loading more doctors:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Update loading state when filters change
  useEffect(() => {
    setIsFilterLoading(true)
    const fetchDoctors = async () => {
      try {
        const result = await getDoctors({
          city,
          specialist,
          isByCondition,
          conditionSpecialist,
          gender: searchParams.gender,
          maxFee: searchParams.fee === 'asc' ? 2000 : undefined,
          minExperience: searchParams.experience ? parseInt(searchParams.experience) : undefined,
          take: 10
        })
        setDoctors(result.doctors)
        setHasMore(result.hasMore)
      } catch (error) {
        console.error('Error fetching doctors:', error)
      } finally {
        setIsFilterLoading(false)
      }
    }
    fetchDoctors()
  }, [searchParams])

  if (isFilterLoading) {
    return (
      <div className="w-full max-w-[1000px] mx-auto px-4 space-y-6">
        <DoctorCardsGridSkeleton />
      </div>
    )
  }

  if (!doctors.length) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="text-center space-y-3">
        <h3 className="text-xl font-semibold">No Doctors Found</h3>
        <p className="text-muted-foreground">
          We could not find any doctors matching your criteria. Try adjusting your filters.
        </p>
      </div>
    </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 space-y-6">
      <div className="space-y-6">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-6">
          <Button
            variant="outline"
            size="lg"
            onClick={loadMore}
            disabled={isLoading}
            className="w-full max-w-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Doctors"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}