import { DayOfWeek, SpecializationType } from "@prisma/client";

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