import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { hospitals } from "@/lib/config/hospitals"
import { HospitalHero } from "@/components/hospitals/hospital-hero"
import { DoctorsFilters } from "@/components/doctors/DoctorsFilters"
import { getDoctorsByCity } from "@/lib/actions/doctor3"
import { HospitalSpecialties } from "@/components/hospitals/hospital-specialties"
import { HospitalFacilities } from "@/components/hospitals/hospital-facilities"
import { HospitalLocation } from "@/components/hospitals/hospital-location"
import { DoctorsCityList } from "@/components/doctors/DoctorCityList"
import { DoctorCardsGridSkeleton } from "@/components/doctors/DoctorCardSkeleton"

interface PageProps {
  params: {
    city: string
    hospitalName: string
  }
  searchParams: { [key: string]: string | undefined }
}

export async function generateMetadata({
  params,
}: Pick<PageProps, 'params'>): Promise<Metadata> {
  const hospital = hospitals[params.hospitalName]
  if (!hospital) return {}

  return {
    title: `${hospital.name} - Best Hospital in ${hospital.city} | Book Appointment`,
    description: `Book appointments with the best doctors at ${hospital.name}, ${hospital.city}. View doctor profiles, specialties, and facilities available.`
  }
}

export default async function HospitalPage({ 
  params, 
  searchParams 
}: PageProps) {
  const hospital = hospitals[params.hospitalName]
  if (!hospital) {
    notFound()
  }

  const initialDoctors = await getDoctorsByCity({
    city: params.city,
    maxFee: searchParams?.fee === 'asc' ? 2000 : undefined,
    minExperience: searchParams?.experience ? parseInt(searchParams.experience) : undefined,
    take: 10
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <HospitalHero hospital={hospital} />
      
      <div className="space-y-16">
        {/* Specialties Section */}
        <section className="py-12 bg-white">
          <div className="container max-w-7xl mx-auto px-4">
            <HospitalSpecialties specialties={hospital.specialties} />
          </div>
        </section>
 
        {/* Facilities Section */}
        <section className="py-12 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-4">
            <HospitalFacilities facilities={hospital.facilities} />
          </div>
        </section>
 
        {/* Doctors Section */}
        <section 
          id="doctors-section" 
          className="py-12 bg-white"
        >
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Our Doctors at {hospital.name}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Book appointments with our experienced specialists across various departments
              </p>
            </div>
 
            <div className="max-w-4xl mx-auto space-y-8">
              <DoctorsFilters />
              
              <Suspense 
                key={JSON.stringify(searchParams)} 
                fallback={<DoctorCardsGridSkeleton />}
              >
                <DoctorsCityList 
                  initialDoctors={initialDoctors}
                  city={params.city} 
                  searchParams={searchParams}
                />
              </Suspense>
            </div>
          </div>
        </section>
 
        <HospitalLocation location={hospital.location} />
      </div>
    </main>
  )
}