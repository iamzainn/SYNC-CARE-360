import { Building2 } from "lucide-react";

export function HospitalFacilities({ facilities }: { facilities: string[] }) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <h2 className="text-2xl font-bold mb-6">Our Facilities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {facilities.map((facility) => (
            <div 
              key={facility}
              className="p-4 rounded-lg bg-white border flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">{facility}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}