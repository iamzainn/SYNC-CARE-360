'use client'

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useLocationStore } from "@/store/useLocationStore"

const SPECIALTIES = [
  {
    id: "gynecologist",
    name: "Gynecologist",
    icon: "👩‍⚕️",
  },
  {
    id: "skin",
    name: "Skin Specialist",
    icon: "🔬",
  },
  {
    id: "child",
    name: "Child Specialist",
    icon: "👶",
  },
  {
    id: "orthopedic",
    name: "Orthopedic Surgeon",
    icon: "🦴",
  },
  {
    id: "ent",
    name: "ENT Specialist",
    icon: "👂",
  },
  {
    id: "diabetes",
    name: "Diabetes Specialist",
    icon: "💉",
  },
  {
    id: "eye",
    name: "Eye Specialist",
    icon: "👁️",
  },
] as const

export const SpecialtiesSection = () => {
  const { location } = useLocationStore()

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Consult best doctors online
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {SPECIALTIES.map((specialty) => (
            <Link
              key={specialty.id}
              href={`/${location?.toLowerCase()}/${specialty.id}`}
              className="block"
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                  <span className="text-3xl mb-2">{specialty.icon}</span>
                  <span className="text-sm font-medium">{specialty.name}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}