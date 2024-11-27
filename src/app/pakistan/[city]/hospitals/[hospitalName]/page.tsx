import { Metadata } from "next"
import { notFound } from "next/navigation"
import { hospitals } from "@/lib/config/hospitals"
import { HospitalHero } from "@/components/hospitals/hospital-hero"
import { DoctorsFilters } from "@/components/doctors/DoctorsFilters"
import { getDoctorsByCity } from "@/lib/actions/doctor3"
import { HospitalSpecialties } from "@/components/hospitals/hospital-specialties"
import { HospitalFacilities } from "@/components/hospitals/hospital-facilities"
import { HospitalLocation } from "@/components/hospitals/hospital-location"
import { DoctorsCityList } from "@/components/doctors/DoctorCityList"

interface PageProps {
  params: {
    city: string
    hospitalName: string
    searchParams: { [key: string]: string | undefined }
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const hospital = hospitals[params.hospitalName]
 if (!hospital) return {}





  return {
    title: `${hospital.name} - Best Hospital in ${hospital.city} | Book Appointment`,
    description: `Book appointments with the best doctors at ${hospital.name}, ${hospital.city}. View doctor profiles, specialties, and facilities available.`
  }
}

export default async function HospitalPage({ params }: PageProps) {
  const hospital = hospitals[params.hospitalName]
  if(!hospital) {
    notFound()
  }

  const initialDoctors = await getDoctorsByCity({
    city: params.city,
    maxFee: params.searchParams?.fee === 'asc' ? 2000 : undefined,
    minExperience: params.searchParams?.experience ? parseInt(params.searchParams.experience) : undefined,
    take: 10
  })

  return (
    <main className="min-h-screen bg-background">
      <HospitalHero hospital={hospital} />
      
      <div className="space-y-16">
        <section className="py-12 bg-white">
          <div className="container">
            <HospitalSpecialties specialties={hospital.specialties} />
          </div>
        </section>
 
        <section className="py-12 bg-gray-50">
          <div className="container">
            <HospitalFacilities facilities={hospital.facilities} />
          </div>
        </section>
 
        <section className="py-12 bg-white">
          <div className="container max-w-7xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold">
                Our Doctors at {hospital.name}
              </h2>
              <p className="text-muted-foreground mt-2">
                Book appointments with our experienced specialists
              </p>
            </div>
 
            <DoctorsFilters />
            <DoctorsCityList 
              initialDoctors={initialDoctors}
              city={params.city} 
              searchParams={params.searchParams}
            />
          </div>
        </section>
 
        <HospitalLocation location={hospital.location} />
      </div>
    </main>
  )
 }