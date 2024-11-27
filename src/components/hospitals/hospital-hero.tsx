import { HospitalDetails } from "@/lib/config/hospitals";
import { Clock, Phone } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export function HospitalHero({ hospital }: { hospital: HospitalDetails }) {
    return (
      <div className="relative bg-white border-b">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Hospital Image */}
            <div className="relative w-full md:w-1/3 aspect-video md:aspect-square rounded-lg overflow-hidden">
              <Image
                src={hospital.mainImage}
                alt={hospital.name}
                fill
                className="object-cover"
              />
            </div>
  
            {/* Hospital Details */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{hospital.name}</h1>
                <p className="text-muted-foreground">{hospital.address}</p>
              </div>
  
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>{hospital.contactNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Open 24/7</span>
                </div>
              </div>
  
              <div className="pt-4">
                <Button size="lg" className="w-full sm:w-auto">
                  Call Helpline
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }