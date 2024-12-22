'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { TelemedicineDialog } from '../search/TelemedicineSearchDialogue'
import { useLocationStore } from '@/store/useLocationStore'
import { EmergencyDialog } from '../services/emergency-dialog'

const services = [
  {
    id: 1,
    title: "Telemedicines",
    description: "Remote healthcare consultations via video calls or messaging",
    badge: "26 Doctors Online Now",
    imagePath: "/Services/tm.png",
    action: "dialog" // special handling for telemedicine
  },
  {
    id: 2,
    title: "Medication Management & Delivery",
    description: "Ordering, managing, & delivering prescribed medications.",
    imagePath: "/Services/mmd.png",
    path: "/Services/Medicines" // direct route
  },
  {
    id: 3,
    title: "Emergency Assistance",
    description: "Providing medical help in urgent situations.",
    imagePath: "/Services/ea.png",
    path: "/Services/Emergency"
  },
  {
    id: 4,
    title: "Healthcare Data Management",
    description: "Secure management of patient health data and records",
    imagePath: "/Services/hcd.png",
    path: "/Services/DataManagement"
  },
  {
    id: 5,
    title: "Home Visits",
    description: "In-home medical check-ups by healthcare professionals",
    imagePath: "/Services/hv.png",
    path: "/Services/home-visits/lahore"
  },
  {
    id: 6,
    title: "Specialized Medical Treatment",
    description: "Tailored treatments requiring certified medical personnel",
    imagePath: "/Services/smt.png",
    path: "/Services/Specialized-Treatment"
  }
]

export const ServiceSection = () => {
  const router = useRouter()
  const [isTelemedicineOpen, setIsTelemedicineOpen] = useState(false)
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false)
  const { location } = useLocationStore()

  

  const handleCardClick = (service: typeof services[0]) => {
    if (service.action === "dialog") {
      setIsTelemedicineOpen(true)
    } else if (service.title === "Emergency Assistance") {
      setIsEmergencyOpen(true)
    } else if (service.title === "Home Visits") {
      router.push(`/Services/home-visits/${location || 'lahore'}`)
    } else if (service.path) {
      router.push(service.path)
    }
  }

  return (
    <section className="w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="space-y-6">
       
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {services.map((service) => (
            <Card 
              key={service.id}
              onClick={() => handleCardClick(service)}
              className="group transition-all duration-300 hover:shadow-lg rounded-2xl bg-white overflow-hidden cursor-pointer"
            >
              <div className="flex flex-col h-full">
               
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  <div className="absolute inset-0">
                    {/* Image placeholder - replace with actual image */}
                    <img
                      src={service.imagePath}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Online Badge */}
                  {service.badge && (
                    <div className="absolute bottom-3 left-3">
                      <div className="flex items-center gap-1.5 bg-[#3b82f6] text-white text-xs font-medium px-3 py-1 rounded-full">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        {service.badge}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Container */}
                <div className="flex flex-col p-3">
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>


      <EmergencyDialog 
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      
      <TelemedicineDialog 
        isOpen={isTelemedicineOpen}
        onClose={() => setIsTelemedicineOpen(false)}
      />
    </section>
  )
}