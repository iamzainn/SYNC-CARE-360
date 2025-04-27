import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DayOfWeek } from "@prisma/client"

export interface SpecializedServiceSlot {
  id?: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
  isReserved?: boolean
}

interface SpecializedServiceState {
  isActive: boolean
  fee: number
  slots: SpecializedServiceSlot[]
  setIsActive: (status: boolean) => void
  setFee: (fee: number) => void
  addSlot: (slot: SpecializedServiceSlot) => void
  removeSlot: (dayOfWeek: DayOfWeek, startTime: string) => void
  setSlots: (slots: SpecializedServiceSlot[]) => void
  resetStore: () => void
}

const initialState = {
  isActive: false,
  fee: 0,
  slots: []
}

export const useSpecializedServiceStore = create<SpecializedServiceState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setIsActive: (status) => set({ isActive: status }),
      setFee: (fee) => set({ fee }),
      
      addSlot: (slot) => set((state) => ({
        slots: [...state.slots, slot]
      })),
      
      removeSlot: (dayOfWeek, startTime) => set((state) => ({
        slots: state.slots.filter(
          s => !(s.dayOfWeek === dayOfWeek && s.startTime === startTime)
        )
      })),

      setSlots: (slots) => set({ slots }),
      
      resetStore: () => set(initialState)
    }),
    {
      name: 'specialized-service-storage'
    }
  )
)
