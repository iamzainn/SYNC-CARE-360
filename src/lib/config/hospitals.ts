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
    address: "152-G/1, Canal Bank, Johar Town, Lahore",
    mainImage: "/images/hospitals/doctors-hospital.jpg",
    contactNumber: "042-111-123-123",
    location: { lat: 31.4697, lng: 74.2728 },
    openingHours: { regular: "24/7", emergency: "24/7" },
    about: "Doctors Hospital is one of the leading healthcare institutions in Lahore, providing comprehensive medical services with state-of-the-art facilities and experienced specialists.",
    specialties: [
      {
        name: "Obstetrics & Gynecology",
        icon: "/icons/specialties/obgyn.svg",
        href: "/pakistan/lahore/obgyn"
      },
      {
        name: "Cardiology",
        icon: "/icons/specialties/cardiology.svg", 
        href: "/pakistan/lahore/cardiology"
      },
      {
        name: "Orthopedics",
        icon: "/icons/specialties/orthopedics.svg",
        href: "/pakistan/lahore/orthopedics"
      },
      {
        name: "Pediatrics",
        icon: "/icons/specialties/pediatrics.svg",
        href: "/pakistan/lahore/pediatrics"
      }
    ],
    facilities: [
      "24/7 Emergency",
      "ICU & CCU",
      "Operation Theaters",
      "Diagnostic Center",
      "Pharmacy",
      "Laboratory",
      "Radiology"
    ]
  },
  "hameed-latif": {
    id: "hameed-latif",
    name: "Hameed Latif Hospital",
    city: "lahore",
    address: "14 Abul Hassan Isfahani Road, Lahore",
    mainImage: "/images/hospitals/hameed-latif.jpg", 
    contactNumber: "042-111-000-889",
    location: { lat: 31.5126, lng: 74.3284 },
    openingHours: { regular: "24/7", emergency: "24/7" },
    about: "Hameed Latif Hospital provides quality healthcare services with modern medical facilities and expert medical professionals.",
    specialties: [
      {
        name: "Internal Medicine",
        icon: "/icons/specialties/internal-med.svg",
        href: "/pakistan/lahore/internal-medicine"
      },
      {
        name: "General Surgery",
        icon: "/icons/specialties/surgery.svg",
        href: "/pakistan/lahore/general-surgery"
      },
      {
        name: "Neurology",
        icon: "/icons/specialties/neurology.svg",
        href: "/pakistan/lahore/neurology"
      }
    ],
    facilities: [
      "24/7 Emergency",
      "ICU",
      "Operation Theaters",
      "Laboratory",
      "Pharmacy",
      "Diagnostic Imaging"
    ]
  },
  "shifa-hospital": {
    id: "shifa-hospital",
    name: "Shifa International Hospital",
    city: "islamabad",
    address: "Pitras Bukhari Road, H-8/4, Islamabad",
    mainImage: "/images/hospitals/shifa.jpg",
    contactNumber: "051-111-444-446",
    location: { lat: 33.6941, lng: 73.0551 },
    openingHours: { regular: "24/7", emergency: "24/7" },
    about: "Shifa International Hospital is a leading tertiary care hospital providing comprehensive healthcare services.",
    specialties: [
      {
        name: "Cardiology",
        icon: "/icons/specialties/cardiology.svg",
        href: "/pakistan/islamabad/cardiology"
      },
      {
        name: "Oncology",
        icon: "/icons/specialties/oncology.svg",
        href: "/pakistan/islamabad/oncology"
      },
      {
        name: "Neurosurgery",
        icon: "/icons/specialties/neurosurgery.svg",
        href: "/pakistan/islamabad/neurosurgery"
      }
    ],
    facilities: [
      "Emergency Care",
      "ICU & CCU",
      "Operation Theaters",
      "Cancer Center",
      "Diagnostic Services",
      "Pharmacy"
    ]
  },
  "patel-hospital": {
    id: "patel-hospital",
    name: "Patel Hospital",
    city: "karachi",
    address: "ST-18, Block 4, Gulshan-e-Iqbal, Karachi",
    mainImage: "/images/hospitals/patel.jpg",
    contactNumber: "021-111-174-174",
    location: { lat: 24.9204, lng: 67.0300 },
    openingHours: { regular: "24/7", emergency: "24/7" },
    about: "Patel Hospital is committed to providing quality healthcare services with modern facilities and experienced medical professionals.",
    specialties: [
      {
        name: "General Medicine",
        icon: "/icons/specialties/medicine.svg",
        href: "/pakistan/karachi/general-medicine"
      },
      {
        name: "Pediatrics",
        icon: "/icons/specialties/pediatrics.svg",
        href: "/pakistan/karachi/pediatrics"
      },
      {
        name: "Gynecology",
        icon: "/icons/specialties/gynecology.svg",
        href: "/pakistan/karachi/patel/gynecology"
      }
    ],
    facilities: [
      "Emergency Department",
      "ICU",
      "Operation Theaters",
      "Laboratory",
      "Radiology",
      "Pharmacy"
    ]
  }
 }