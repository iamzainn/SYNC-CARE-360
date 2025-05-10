import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NurseVerification {
  services: string[]
}

interface NurseVerificationState extends NurseVerification {
  currentStep: number
  isValid: () => boolean
  updateServices: (services: string[]) => void
  nextStep: () => void
  previousStep: () => void
  resetForm: () => void
}

const initialState: NurseVerification = {
  services: [],
}

export const useNurseVerificationStore = create<NurseVerificationState>()(
  persist(
    (set, get) => ({
      ...initialState,
      currentStep: 1,

      isValid: () => {
        const { services } = get()
        return services.length > 0
      },

      updateServices: (services: string[]) => {
        set({ services })
      },

      nextStep: () => {
        if (get().isValid()) {
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
      name: 'nurse-verification-storage'
    }
  )
) 