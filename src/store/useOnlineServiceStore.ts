import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppointmentType, DayOfWeek } from "@prisma/client"

export interface OnlineServiceSlot {
  id?: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
}

interface OnlineServiceState {
  isActive: boolean
  fee: number
  slots: OnlineServiceSlot[]
  setIsActive: (status: boolean) => void
  setFee: (fee: number) => void
  addSlot: (slot: OnlineServiceSlot) => void
  removeSlot: (dayOfWeek: DayOfWeek, startTime: string) => void
  setSlots: (slots: OnlineServiceSlot[]) => void
  resetStore: () => void
}

const initialState = {
  isActive: false,
  fee: 0,
  slots: []
}

export const useOnlineServiceStore = create<OnlineServiceState>()(
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
      name: 'online-service-storage'
    }
  )
)