// components/labs/lab-header.tsx

import { Badge } from "@/components/ui/badge"
import { Lab } from "@/lib/types/lab-test"
import { Phone } from "lucide-react"

interface LabHeaderProps {
  lab: Lab
}

export function LabHeader({ lab }: LabHeaderProps) {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
          {lab.logo ? (
            <img 
              src={lab.logo} 
              alt={lab.name} 
              className="w-20 h-20 object-contain"
            />
          ) : (
            <span className="text-2xl font-bold text-gray-500">
              {lab.name[0]}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{lab.name}</h1>
          <p className="text-gray-600 mt-1">{lab.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">{lab.phone}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {lab.services.map((service, index) => (
              <Badge key={index} variant="secondary">
                {service}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}