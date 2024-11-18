import { DAYS } from "@/components/doctor/dashboard/sections/home-service/SlotsForm";
import { z } from "zod";

export const slotSchema = z.object({
    dayOfWeek: z.enum(DAYS),
    startTime: z.string(),
    endTime: z.string(),
  }).refine((data) => {
    const [startHour, startMinute] = data.startTime.split(':').map(Number)
    const [endHour, endMinute] = data.endTime.split(':').map(Number)
    const startMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute
    return endMinutes > startMinutes
  }, "End time must be after start time");