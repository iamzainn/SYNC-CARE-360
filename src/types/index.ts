import { AppointmentStatus, AppointmentType, DayOfWeek, SpecializationType, VisitType } from "@prisma/client";

export interface SponsorCard {
    title: string;
    description: string;
    logo?: string;
    href: string;
  }
  
  export interface SpecialistCard {
    icon: string;
    title: string;
    urlPath: string;
  }
  
  export interface ConditionCard {
    icon: string;
    title: string;
    urlPath: string;
  }


  export interface HomeServiceData {
    id?: string
    isActive: boolean
    specializations: {
      type: string
      price: number
    }[]
    slots: {
      
      dayOfWeek: string
      startTime: string
      endTime: string
    }[]
  }


  export interface DoctorWithServices {
    id: string
    name: string
    title: string
    specialization: string
    city: string
    verification?: {
      profilePhoto: string | null
    } | null
    Services?: {
      
      homeService?: {
        id: string
        isActive: boolean
        specializations: {
          type: SpecializationType
          price: number
        }[]
        slots: {
          id: string
          dayOfWeek: DayOfWeek
          startTime: string
          endTime: string
          isReserved: boolean
        }[]
      } | null
    } | null
  }

  export interface GetDoctorsResponse {
    doctors: DoctorWithServices[]
    hasMore: boolean
    total: number
  }
  


  export interface SlotType {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}
 
export interface SelectedService {
  type: string;
  price: number;
}

export interface BookingDialogProps {
  doctor: DoctorWithServices;
  isOpen: boolean;
  onClose: () => void;
}


export interface OnlineServiceSlot {
  id?: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
  isReserved: boolean
}

export interface OnlineServiceData {
  id: string
  isActive: boolean
  fee: number
  slots: OnlineServiceSlot[]
  createdAt: Date
  updatedAt: Date
}

export interface OnlineAppointmentData {
  id: string
  appointmentDate: Date
  startTime: string
  endTime: string
  appointmentType: AppointmentType
  visitType: VisitType
  status: AppointmentStatus
  amount: number
  patientDetails: {
    name: string
    email: string
    phone: string
  }
  createdAt: Date
  updatedAt: Date
}

export type OnlineServicePayload = {
  isActive: boolean
  fee: number
  slots: Omit<OnlineServiceSlot, 'id' | 'isReserved'>[]
}

export type OnlineAppointmentPayload = {
  appointmentDate: Date
  startTime: string
  endTime: string
  appointmentType: AppointmentType
  visitType: VisitType
  patientId: string
  onlineServiceId: string
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  success?: boolean
}