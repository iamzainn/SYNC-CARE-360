import { Building2, Phone, MapPin, Clock, Stethoscope } from "lucide-react"

export interface HospitalSpecialty {
  name: string
  icon: string
  href: string
}

export interface HospitalDetails {
  id: string
  name: string
  city: string
  address: string
  mainImage: string
  contactNumber: string
  location: {
    lat: number
    lng: number
  }
  openingHours: {
    regular: string
    emergency: string
  }
  about: string
  specialties: HospitalSpecialty[]
  facilities: string[]
}

export const hospitals: Record<string, HospitalDetails> = {
    "doctors-hospital": {
      id: "doctors-hospital",
      name: "Doctors Hospital",
      city: "lahore",
      address: "152 A-G / 1, Canal Bank, Johar Town, Lahore",
      mainImage: "/images/hospitals/doctors-hospital.jpg",
      contactNumber: "042-111-123-123",
      location: { lat: 31.4697, lng: 74.2728 },
      openingHours: { regular: "24/7", emergency: "24/7" },
      about: "Doctors Hospital is a leading healthcare institution in Lahore...",
      specialties: [
        { 
          name: "Obstetrician",
          icon: "/icons/obstetrics.svg",
          href: "/pakistan/lahore/hospitals/doctors-hospital/obstetrics"
        },
        // Add all specialties from your image
      ],
      facilities: [
        "24/7 Emergency",
        "ICU",
        "Operation Theaters",
        "Diagnostic Center",
        "Pharmacy"
      ]
    },
    "hameed-latif": {
      id: "hameed-latif",
      name: "Hameed Latif",
      city: "lahore",
      address: "152 A-G / 1, Canal Bank, Johar Town, Lahore",
      mainImage: "/images/hospitals/hameed-latif.jpg",
      contactNumber: "042-111-123-123",
      location: { lat: 31.4697, lng: 74.2728 },
      openingHours: { regular: "24/7", emergency: "24/7" },
      about: "Hameed Latif is a leading healthcare institution in Lahore...",
      specialties: [
        { 
          name: "Obstetrician",
          icon: "/icons/obstetrics.svg",
          href: "/pakistan/lahore/hospitals/hameed-latif/obstetrics"
        },
        // Add all specialties from your image
      ],
      facilities: [
        "24/7 Emergency",
        "ICU",
      ]
    }
  }