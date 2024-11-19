
import { SpecializationType } from "@prisma/client"



interface Specialization {
 id: SpecializationType
 label: string
}

export const HOME_SPECIALIZATIONS: Specialization[] = [
 { id: "GENERAL_CHECKUP", label: "General Checkup" },
 { id: "WOUND_DRESSING", label: "Wound Dressing" },
 { id: "PHYSICAL_THERAPY", label: "Physical Therapy" },
 { id: "ELDERLY_CARE", label: "Elderly Care" },
 { id: "POST_SURGERY", label: "Post-Surgery Care" },
 { id: "EMERGENCY_CARE", label: "Emergency Care" }
];

  export const DAYS = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY"
  ] as const;