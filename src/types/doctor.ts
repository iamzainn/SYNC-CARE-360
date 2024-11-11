export interface Specialty {
    id: string
    name: string
    icon: string
  }
  
  export interface SearchParams {
    location: string
    specialty?: string
  }