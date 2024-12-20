'use client'

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DoctorCard } from "./doctor-card"
import { DoctorCardSkeleton } from "./doctor-card-skeleton"
import { SpecializationType } from "@prisma/client"
import { Filter } from "lucide-react"
import { getDoctors } from "@/lib/actions/doctor"
import { DoctorWithServices } from "@/types"
import { useMediaQuery } from "@/hooks/use-media-query"
import { HOME_SPECIALIZATIONS } from "@/lib/constants/home-services"

interface DoctorsSectionProps {
  city: string
}
export function DoctorsSection({ city }: DoctorsSectionProps) {
  const [doctors, setDoctors] = useState<DoctorWithServices[]>([])
  const [specialization, setSpecialization] = useState<SpecializationType | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const fetchDoctors = useCallback(async (reset = false) => {
    try {
      setIsLoading(true)
      const currentPage = reset ? 1 : page
      const response = await getDoctors({
        page: currentPage,
        specialization,
        city
      })

      console.log(response)

      setDoctors(prev => 
        reset ? response.doctors : [...prev, ...response.doctors]
      )
      setHasMore(response.hasMore)
      setTotal(response.total)
      if (!reset) {
        setPage(prev => prev + 1)
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error)
    } finally {
      setIsLoading(false)
    }
  }, [page, specialization, city])

  useEffect(() => {
    fetchDoctors(true)
  }, [specialization])

  const handleSpecializationChange = (value: SpecializationType | undefined) => {
    setSpecialization(value)
    setPage(1)
    setDoctors([])
  }

  const FilterContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Specialization</label>
        <Select
        value={specialization || "ALL"} // Use "ALL" as default value instead of empty string
        onValueChange={(value) => {
          handleSpecializationChange(value === "ALL" ? undefined : value as SpecializationType)
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All Specializations" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Specializations</SelectItem>
          {HOME_SPECIALIZATIONS.map(spec => (
            <SelectItem key={spec.id} value={spec.id}>
              {spec.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      </div>
    </div>
  )

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl sm:text-3xl font-bold">
          Home Service Doctors in {city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()}
        </h2>
        <p className="text-muted-foreground">
          {total} verified doctors available for home visits in your area
        </p>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="w-[200px]">
            <FilterContent />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {doctors.map(doctor => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
        {isLoading && Array.from({ length: 4 }).map((_, i) => (
          <DoctorCardSkeleton key={i} />
        ))}
      </div>

      {hasMore && !isLoading && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => fetchDoctors()}
            className="min-w-[200px]"
          >
            Load More Doctors
          </Button>
        </div>
      )}
    </section>
  )
}