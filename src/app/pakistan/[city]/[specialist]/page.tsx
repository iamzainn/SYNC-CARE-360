// app/pakistan/[city]/[specialist]/page.tsx
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { DoctorsList } from "@/components/doctors/DoctorsList"
import { DoctorsFilters } from "@/components/doctors/DoctorsFilters"
import { getDoctors } from "@/lib/actions/doctor2"
import { urlToSpecialization } from "@/lib/helpers/specialization-mapping"
import { Suspense } from "react"
import { DoctorCardsGridSkeleton } from "@/components/doctors/DoctorCardSkeleton"

interface PageProps {
  params: {
    city: string
    specialist: string
  }
  searchParams: { [key: string]: string | undefined }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const city = params.city.charAt(0).toUpperCase() + params.city.slice(1)
  const specialization = urlToSpecialization(params.specialist)
  

  return {
    title: `Best ${specialization} Doctors in ${city} | Book Appointment`,
    description: `Find and book the best ${specialization.toLowerCase()} doctors in ${city}. View doctor profiles, read patient reviews, check consultation fees and book appointments online.`
  }
}

export default async function DoctorsPage({ params, searchParams }: PageProps) {
  const { city, specialist } = params



  try {
    const initialDoctors = await getDoctors({
      city,
      specialist,
      gender: searchParams.gender,
      maxFee: searchParams.fee === 'asc' ? 2000 : undefined,
      minExperience: searchParams.experience ? parseInt(searchParams.experience) : undefined,
      take: 10
    })

    const specialization = urlToSpecialization(specialist)
    const cityName = city.charAt(0).toUpperCase() + city.slice(1)

    return (
      <main className="min-h-screen max-w-full bg-gray-50/50">
        <div className="container py-6">
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              Best {specialization} Doctors in {cityName}
            </h1>
            <p className="text-muted-foreground">
              Book appointments with the best {specialization.toLowerCase()} specialists
            </p>
          </div>

          
          <DoctorsFilters />

          <Suspense fallback={<DoctorCardsGridSkeleton />}>
            <DoctorsList
              city={city}
              specialist={specialist}
              initialDoctors={initialDoctors}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error loading doctors page:', error)
    notFound()
  }
}