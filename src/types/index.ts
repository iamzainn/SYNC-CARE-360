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