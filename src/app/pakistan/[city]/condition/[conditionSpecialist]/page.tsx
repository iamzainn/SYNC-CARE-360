
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { DoctorsList } from "@/components/doctors/DoctorsList"
import { DoctorsFilters } from "@/components/doctors/DoctorsFilters"
import { getDoctors } from "@/lib/actions/doctor2"
import { Suspense } from "react"
import { DoctorCardsGridSkeleton } from "@/components/doctors/DoctorCardSkeleton"

interface PageProps {
  params: {
    city: string
    conditionSpecialist: string
  }
  searchParams: { [key: string]: string | undefined }
}
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const city = params.city.charAt(0).toUpperCase() + params.city.slice(1)
  const conditionSpecialist=params.conditionSpecialist
  

  return {
    title: `Best ${conditionSpecialist} Doctors in ${city} | Book Appointment`,
    description: `Find and book the best ${conditionSpecialist.toLowerCase()} doctors in ${city}. View doctor profiles, read patient reviews, check consultation fees and book appointments online.`
  }
}

export default async function DoctorsPage({ params, searchParams }: PageProps) {
  const { city, conditionSpecialist} = params



  try {
    const initialDoctors = await getDoctors({
      city,
      conditionSpecialist:conditionSpecialist,
      gender: searchParams.gender,
      maxFee: searchParams.fee === 'asc' ? 2000 : undefined,
      minExperience: searchParams.experience ? parseInt(searchParams.experience) : undefined,
      take: 10,
      isByCondition:true
    })

    // const specialization = urlToSpecialization(specialist)
    const cityName = city.charAt(0).toUpperCase() + city.slice(1)

   

    return (
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                Best {conditionSpecialist} Doctors in {cityName}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Book appointments with top {conditionSpecialist.toLowerCase()} specialists
              </p>
            </div>

            {/* Filters Section */}
            <div className="w-full">
              <DoctorsFilters />
            </div>

           
             <Suspense fallback={<DoctorCardsGridSkeleton />}>
              <DoctorsList
                city={city}
                specialist={""}
                
                initialDoctors={initialDoctors}
                searchParams={searchParams}
                isByCondition={true}
              />
            </Suspense>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error loading doctors page:', error)
    notFound()
  }
}