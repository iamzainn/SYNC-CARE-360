
import { SpecializationType } from "@prisma/client"

interface Specialization {
  id: SpecializationType
  label: string
  basePrice: number
}
export const HOME_SPECIALIZATIONS = [
    { id: "general_checkup", label: "General Checkup", basePrice: 2000 },
    { id: "wound_dressing", label: "Wound Dressing", basePrice: 1500 },
    { id: "physical_therapy", label: "Physical Therapy", basePrice: 3000 },
    { id: "elderly_care", label: "Elderly Care", basePrice: 2500 },
    { id: "post_surgery", label: "Post-Surgery Care", basePrice: 4000 },
    { id: "emergency", label: "Emergency Care", basePrice: 5000 }
  ] as const;


  export const DAYS = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY"
  ] as const;