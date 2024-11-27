import { HospitalSpecialty } from "@/lib/config/hospitals";
import Link from "next/link";
import Image from "next/image";

export function HospitalSpecialties({ specialties }: { specialties: HospitalSpecialty[] }) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Find Doctor by Speciality</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {specialties.map((specialty) => (
          <Link 
            key={specialty.name}
            href={specialty.href}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Image 
                src={specialty.icon} 
                alt={specialty.name}
                width={24}
                height={24}
              />
            </div>
            <span className="text-sm font-medium text-center">{specialty.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}