export interface Specialty {
    id: string
    name: string
    icon: string
  }
  
  export interface SearchParams {
    location: string
    specialty?: string
  }

 export  interface DoctorProfile {
    id: string
    name: string
    email: string
    phone: string
    currentCity: string
    profilePhoto: string | null
    specialization: string[]
    experienceYears: number
    expertise: string[]
  }