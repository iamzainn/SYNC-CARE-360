import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { SpecializationType, DayOfWeek } from "@prisma/client"


export interface ServiceSpecialization {
  id?: string
  type: SpecializationType
  price: number
}

export interface ServiceSlot {
  id?: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
}
interface HomeServiceState {
  isActive: boolean
  specializations: ServiceSpecialization[]
  slots: ServiceSlot[]
  setIsActive: (status: boolean) => void
  addSpecialization: (spec: ServiceSpecialization) => void
  removeSpecialization: (type: SpecializationType) => void
  setSpecializations: (specs: ServiceSpecialization[]) => void
  addSlot: (slot: ServiceSlot) => void
  removeSlot: (dayOfWeek: DayOfWeek, startTime: string) => void
  setSlots: (slots: ServiceSlot[]) => void
  resetStore: () => void
}

const initialState = {
  isActive: false,
  specializations: [],
  slots: []
}

export const useHomeServiceStore = create<HomeServiceState>()(
  persist(
    (set) => ({
      // Initial state
      ...initialState,

      // Actions
      setIsActive: (status) => set({ isActive: status }),
  addSpecialization: (spec) => set((state) => ({
    specializations: [...state.specializations, spec]
  })),
  removeSpecialization: (type) => set((state) => ({
    specializations: state.specializations.filter(s => s.type !== type)
  })),
  setSpecializations: (specs) => set({ specializations: specs }),
      
      addSlot: (slot) =>
        set((state) => ({
          slots: [...state.slots, slot]
        })),
      
      removeSlot: (dayOfWeek, startTime) =>
        set((state) => ({
          slots: state.slots.filter(
            s => !(s.dayOfWeek === dayOfWeek && s.startTime === startTime)
          )
        })),

      setSlots: (slots) => 
        set({ slots }),
      
      resetStore: () => set(initialState)
    }),
    {
      name: 'home-service-storage'
    }
  )
)



  