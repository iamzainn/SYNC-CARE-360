"use client"

import { useEffect, useState } from "react"
import { DoctorCard } from "./DoctorCard"
import { DoctorCardsGridSkeleton } from "./DoctorCardSkeleton"
import { getDoctors } from "@/lib/actions/doctor2"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { getDoctorsByCity } from "@/lib/actions/doctor3"
import { useDebounce } from "@/hooks/use-debounce"
import router from "next/router"
import { usePathname } from "next/navigation"

interface DoctorsListProps {
  city: string
 
  initialDoctors: Awaited<ReturnType<typeof getDoctors>>
  searchParams: { [key: string]: string | undefined }
}

export function DoctorsCityList({ 
  city, 
  initialDoctors,
  searchParams 
 }: DoctorsListProps) {
  const [doctors, setDoctors] = useState(initialDoctors.doctors)
  const [hasMore, setHasMore] = useState(initialDoctors.hasMore)
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterLoading, setIsFilterLoading] = useState(false)
  const pathname = usePathname()
  
  // Debounce filter changes
  const debouncedSearchParams = useDebounce(searchParams, 500)

  const loadMore = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const result = await getDoctorsByCity({
        city,
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
 
  const resetFilters = () => {
    router.push(pathname)
  }

  useEffect(() => {
    const doctorsSection = document.getElementById('doctors-section')
    if (doctorsSection) {
      doctorsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, [searchParams])
 
  useEffect(() => {
    setIsFilterLoading(true)
    const fetchDoctors = async () => {
      try {
        const result = await getDoctorsByCity({
          city,
          gender: debouncedSearchParams.gender,
          maxFee: debouncedSearchParams.fee === 'asc' ? 2000 : undefined,
          minExperience: debouncedSearchParams.experience ? 
            parseInt(debouncedSearchParams.experience) : undefined,
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
  }, [debouncedSearchParams])
 
  return (
    <div className="w-full max-w-4xl mx-auto px-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Available Doctors</h2>
        <Button variant="ghost" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
 
      {isFilterLoading ? (
        <DoctorCardsGridSkeleton />
      ) : !doctors.length ? (
        <div className="text-center py-12 space-y-3">
          <h3 className="text-xl font-semibold">No Doctors Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search criteria
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
 
          {hasMore && (
            <div className="py-8 flex justify-center">
              <Button
                variant="outline" 
                size="lg"
                onClick={loadMore}
                disabled={isLoading}
                className="min-w-[200px]"
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
      )}
    </div>
  )
 }