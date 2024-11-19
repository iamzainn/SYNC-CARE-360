// store/useMedicalRecordStore.ts
import { BloodType } from '@prisma/client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const BLOOD_TYPES = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
] as const

interface MedicalRecord {
  // Required Information
  firstName: string
  lastName: string
  dateOfBirth: Date | null
  gender: 'MALE' | 'FEMALE'  | null
  email: string
  phoneNumber: string

  // Medical Information
  medicalConditions: string[]
  allergies: string[]
  currentMedications: string[]

  // Health Metrics
  height: number | null
  weight: number | null
  bloodType: BloodType | null
  bloodPressure: {
    systolic: number | null | undefined
    diastolic: number | null | undefined
  }
  heartRate: number | null

  // Medical Reports
  medicalReportUrl: string | null

  // Emergency Contact
  emergencyContactName: string
  emergencyContactPhone: string

  // Consent
  consentToStore: boolean
}

interface MedicalRecordState extends MedicalRecord {
  currentStep: number
  isStepValid: (step: number) => boolean
  updateField: <K extends keyof MedicalRecord>(
    field: K,
    value: MedicalRecord[K]
  ) => void
  nextStep: () => void
  previousStep: () => void
  resetForm: () => void
  
}

const initialState: MedicalRecord = {
  firstName: '',
  lastName: '',
  dateOfBirth: null,
  gender: null,
  email: '',
  phoneNumber: '',
  medicalConditions: [],
  allergies: [],
  currentMedications: [],
  height: null,
  weight: null,
  bloodType: BLOOD_TYPES[0],
  bloodPressure: {
    systolic: null,
    diastolic: null
  },
  heartRate: null,
  medicalReportUrl: null,
  emergencyContactName: '',
  emergencyContactPhone: '',
  consentToStore: false
}

export const useMedicalRecordStore = create<MedicalRecordState>()(
  persist(
    (set, get) => ({
      ...initialState,
      currentStep: 1,

      isStepValid: (step: number) => {
        const state = get()
        switch (step) {
          case 1:
            return !!(
              state.firstName &&
              state.lastName &&
              state.dateOfBirth &&
              state.gender &&
              state.email &&
              state.phoneNumber.length === 11
            )
          case 2:
            return true // Optional fields
          case 3:
            return true // Optional fields
          case 4:
            return true // Optional file upload
          case 5:
            return !!(
              state.emergencyContactName &&
              state.emergencyContactPhone.length === 11 &&
              state.consentToStore
            )
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
        if (currentStep < 5 && get().isStepValid(currentStep)) {
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
      name: 'medical-record-storage'
    }
  )
)