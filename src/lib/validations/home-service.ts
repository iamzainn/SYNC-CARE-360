
import { z } from "zod";


export const SpecializationType = z.enum([
  "GENERAL_CHECKUP",
  "WOUND_DRESSING",
  "PHYSICAL_THERAPY",
  "ELDERLY_CARE",
  "POST_SURGERY",
  "EMERGENCY_CARE"
])

export const DayOfWeek = z.enum([
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY"
])

export const specializationSchema = z.object({
  type: SpecializationType,  // Using the enum
  price: z.number().min(100)
})

export const slotSchema = z.object({
  dayOfWeek: DayOfWeek,     // Using the enum
  startTime: z.string(),
  endTime: z.string()
})


