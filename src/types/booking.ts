import { AppointmentType, VisitType } from "@prisma/client"

interface TimeSlot {
    time: string
    isReserved: boolean
    session: 'morning' | 'afternoon' | 'evening'
  }
  
  interface DaySlots {
    date: Date
    dayOfWeek: string
    slots: TimeSlot[]
  }

  export interface BookingSlot {
    date: Date
    time: string
  }
  
  export interface BookingDetails {
    doctorId: string
    patientId?: string  // If you have auth
    slot: BookingSlot
    appointmentType: AppointmentType
    visitType: VisitType
    amount: number
  }