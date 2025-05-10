import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Represents a time slot when the nurse is available
export interface SpecializedServiceSlot {
  id?: string
  dayOfWeek: string
  startTime: string
  endTime: string
  isReserved?: boolean
}

// Represents a service offering with individual price
export interface ServiceOffering {
  
  serviceName: string
  price: number
  isActive: boolean
  description?: string
}

interface SpecializedServiceState {
  // Master activation state for the entire service
  isActive: boolean
  
  // Available time slots
  slots: SpecializedServiceSlot[]

  // Individual service offerings with prices
  serviceOfferings: ServiceOffering[]

  // Actions
  setIsActive: (isActive: boolean) => void
  setSlots: (slots: SpecializedServiceSlot[]) => void
  addSlot: (slot: SpecializedServiceSlot) => void
  removeSlot: (dayOfWeek: string, startTime: string) => void
  
  // Service offering actions
  setServiceOfferings: (offerings: ServiceOffering[]) => void
  addServiceOffering: (offering: ServiceOffering) => void
  updateServiceOffering: (serviceName: string, updates: Partial<ServiceOffering>) => void
  removeServiceOffering: (serviceName: string) => void
  
  // Reset
  resetStore: () => void
}

export const useSpecializedServiceStore = create<SpecializedServiceState>()(
  devtools(
    (set) => ({
      isActive: false,
      slots: [],
      serviceOfferings: [],

      setIsActive: (isActive) => set({ isActive }),
      
      setSlots: (slots) => set({ slots }),
      
      addSlot: (slot) => set((state) => ({
        slots: [...state.slots, slot]
      })),
      
      removeSlot: (dayOfWeek, startTime) => set((state) => ({
        slots: state.slots.filter(
          (slot) => !(slot.dayOfWeek === dayOfWeek && slot.startTime === startTime)
        )
      })),

      setServiceOfferings: (serviceOfferings) => set({ serviceOfferings }),
      
      addServiceOffering: (offering) => set((state) => ({
        serviceOfferings: [...state.serviceOfferings, offering]
      })),
      
      updateServiceOffering: (serviceName, updates) => set((state) => ({
        serviceOfferings: state.serviceOfferings.map(offering => 
          offering.serviceName === serviceName 
            ? { ...offering, ...updates } 
            : offering
        )
      })),
      
      removeServiceOffering: (serviceName) => set((state) => ({
        serviceOfferings: state.serviceOfferings.filter(
          (offering) => offering.serviceName !== serviceName
        )
      })),
      
      resetStore: () => set({
        isActive: false,
        slots: [],
        serviceOfferings: []
      })
    })
  )
)
