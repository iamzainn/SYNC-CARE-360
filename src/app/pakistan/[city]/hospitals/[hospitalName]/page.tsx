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
 if (!hospital) notFound()

 const initialDoctors = await getDoctorsByCity({
   city: params.city,
   take: 10
 })




    return (
        <>
        
           <main className="min-h-screen bg-background">
         <HospitalHero hospital={hospital} />
        
     <div className="space-y-12">
           <div className="container py-12">
             <HospitalSpecialties specialties={hospital.specialties} />
           </div>
  
           <HospitalFacilities facilities={hospital.facilities} />
  
           <div className="container">
             <section>
               <div className="mb-6">
                 <h2 className="text-2xl font-bold">
                   Our Doctors in {hospital.name}
                 </h2>
                 <p className="text-muted-foreground">
                   Book appointments with our experienced specialists
                 </p>
               </div>
  
               <DoctorsFilters />
               <DoctorsCityList 
               initialDoctors={initialDoctors}
               city={params.city}
               searchParams={params.searchParams}
              
               />
               
             </section>
           </div>
  
           <HospitalLocation location={hospital.location} />
     </div>
     
     
       </main>
        </>

    )
  }