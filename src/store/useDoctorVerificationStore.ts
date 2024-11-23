import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DoctorVerification {
  // Basic Information
  fullName: string
  email: string
  phoneNumber: string
  cnic: string
  
  
 
  pmcNumber: string
  graduationYear: number
  medicalSchool: string
  specialization: string[]
  expertise: string[]
  experienceYears: number
  profilePhoto: string | null
  degreeImage: string | null
  pmcImage: string | null
  cnicImage: string | null
}
interface DoctorVerificationState extends DoctorVerification {
  currentStep: number
  isStepValid: (step: number) => boolean
  updateField: <K extends keyof DoctorVerification>(
    field: K,
    value: DoctorVerification[K]
  ) => void
  nextStep: () => void
  previousStep: () => void
  resetForm: () => void
}
const initialState: DoctorVerification = {
  fullName: '',
  email: '',
  phoneNumber: '',
  cnic: '',
  
  pmcNumber: '',
  graduationYear: 0,
  medicalSchool: '',
  specialization: [],
  expertise: [],
  experienceYears: 0,
  profilePhoto: null,
  degreeImage: null,
  pmcImage: null,
  cnicImage: null,
}

export const useDoctorVerificationStore = create<DoctorVerificationState>()(
  persist(
    (set, get) => ({
      ...initialState,
      currentStep: 1,

      isStepValid: (step: number) => {
        const state = get()
        switch (step) {
          case 1: // Basic Information
            return !!(
              state.fullName &&
              state.email &&
              state.phoneNumber.length === 11 &&
              state.cnic 
              
            )
          case 2: // Professional Information
            return !!(
              state.pmcNumber &&
              state.graduationYear &&
              state.medicalSchool &&
              state.specialization.length > 0 &&
              state.experienceYears
            )
          case 3: // Document Upload
            return !!(
              state.profilePhoto &&
              state.degreeImage &&
              state.pmcImage &&
              state.cnicImage
            
            )
          case 4:
            return true
          default:
            return false
        }
      },

      updateField: (field, value) => {
        set((state) => ({
          ...state,
          [field]: value
        }))
      },

      nextStep: () => {
        const currentStep = get().currentStep
        if (currentStep < 4 && get().isStepValid(currentStep)) {
          set((state) => ({ currentStep: state.currentStep + 1 }))
        }
      },

      previousStep: () => {
        set((state) => ({
          currentStep: Math.max(1, state.currentStep - 1)
        }))
      },

      resetForm: () => {
        set({ ...initialState, currentStep: 1 })
      }
    }),
    {
      name: 'doctor-verification-storage'
    }
  )
)
