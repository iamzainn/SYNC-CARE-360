import { DayOfWeek } from "@prisma/client"

export type SessionType = 'morning' | 'afternoon' | 'evening'

export interface TimeSlot {
  id: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
  isReserved: boolean
  isPast?: boolean
}