'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { DayOfWeek } from "@prisma/client"
import { SpecializedServiceSlot, ServiceOffering } from "@/store/useSpecializedServiceStore"

// Define types
export type ApiResponse<T = any> = { 
  success?: boolean;
  data?: T;
  error?: string;
}

export type SpecializedServiceData = {
  id: string;
  nurseId: string;
  isActive: boolean;
  slots: {
    id: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    isReserved: boolean;
  }[];
  serviceOfferings: {
    id: string;
    serviceName: string;
    price: number;
    isActive: boolean;
    description: string | null;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export type SpecializedServicePayload = {
  isActive: boolean;
  fee: number;
  slots: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }[];
}

// Validation schemas
const slotSchema = z.object({
  dayOfWeek: z.string(),
  startTime: z.string(),
  endTime: z.string()
})

const specializedServiceSchema = z.object({
  isActive: z.boolean(),
  slots: z.array(slotSchema)
})

// Get specialized service details including the nurse's verification data
export async function getSpecializedService(): Promise<ApiResponse<{ specializedService: SpecializedServiceData | null, verifiedServices: string[] }>> {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "NURSE") {
      return { error: "Unauthorized" }
    }

    const nurseId = session.user.id
    
    // Get the specialized service along with slots and service offerings
    const specializedService = await db.specializedService.findUnique({
      where: { nurseId },
      include: { 
        slots: true,
        serviceOfferings: true
      }
    })

    // Get the nurse's verification to get the list of services they're verified for
    const nurseVerification = await db.nurseVerification.findUnique({
      where: { nurseId },
      select: { services: true, status: true }
    })

    // Get list of verified services
    const verifiedServices = nurseVerification?.status === "APPROVED" 
      ? nurseVerification.services 
      : []

    return { 
      data: { 
        specializedService: specializedService as SpecializedServiceData | null,
        verifiedServices
      } 
    }
  } catch (error) {
    console.error("[GET_SPECIALIZED_SERVICE_ERROR]", error)
    return { error: "Failed to fetch specialized service" }
  }
}

// Toggle specialized service active status
export async function toggleSpecializedService(isActive: boolean): Promise<ApiResponse<void>> {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "NURSE") {
      return { error: "Unauthorized" }
    }

    const nurseId = session.user.id
    
    // Find or create specialized service
    let specializedService = await db.specializedService.findUnique({
      where: { nurseId }
    })
    
    if (specializedService) {
      // Update existing service
      await db.specializedService.update({
        where: { id: specializedService.id },
        data: { isActive }
      })
    } else {
      // Create new service if it doesn't exist
      await db.specializedService.create({
        data: {
          nurse: { connect: { id: nurseId } },
          isActive
        }
      })
    }
    
    revalidatePath("/nurse/dashboard")
    return { success: true }
  } catch (error) {
    console.error("[TOGGLE_SPECIALIZED_SERVICE_ERROR]", error)
    return { error: "Failed to toggle specialized service" }
  }
}

// Update specialized service with slots and service offerings
export async function updateSpecializedService({
  isActive,
  slots,
  serviceOfferings
}: {
  isActive: boolean,
  slots: SpecializedServiceSlot[],
  serviceOfferings: ServiceOffering[]
}): Promise<ApiResponse<void>> {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "NURSE") {
      return { error: "Unauthorized" }
    }

    const nurseId = session.user.id
    
    // First, find the service or create it if it doesn't exist
    let specializedService = await db.specializedService.findUnique({
      where: { nurseId }
    })
    
    if (!specializedService) {
      // Create new service if it doesn't exist
      specializedService = await db.specializedService.create({
        data: {
          nurse: { connect: { id: nurseId } },
          isActive
        }
      })
    }

    // Then update the specialized service with new data
    // This approach avoids potential Prisma validation issues
    const specializedServiceId = specializedService.id;
    
    // 1. Delete existing slots
    await db.specializedServiceSlot.deleteMany({
      where: { specializedServiceId }
    })
    
    // 2. Delete existing service offerings
    await db.nurseServiceOffering.deleteMany({
      where: { specializedServiceId }
    })
    
    // 3. Update the service status
    await db.specializedService.update({
      where: { id: specializedServiceId },
      data: { isActive }
    })
    
    // 4. Create new slots
    if (slots.length > 0) {
      await db.specializedServiceSlot.createMany({
        data: slots.map(slot => ({
          specializedServiceId,
          dayOfWeek: slot.dayOfWeek as DayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isReserved: false
        }))
      })
    }
    
    // 5. Create new service offerings
    if (serviceOfferings.length > 0) {
      await db.nurseServiceOffering.createMany({
        data: serviceOfferings.map(offering => ({
          specializedServiceId,
          serviceName: offering.serviceName,
          price: offering.price,
          isActive: offering.isActive,
          description: offering.description || null
        }))
      })
    }
    
    revalidatePath("/nurse/dashboard")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_SPECIALIZED_SERVICE_ERROR]", error)
    return { error: "Failed to update specialized service: " + (error instanceof Error ? error.message : String(error)) }
  }
}

// // Update slot reservation status
// export async function updateSlotReservation(
//   slotId: string, 
//   isReserved: boolean
// ): Promise<ApiResponse<void>> {
//   try {
//     await db.specializedServiceSlot.update({
//       where: { id: slotId },
//       data: { isReserved }
//     })
//     return { success: true }
//   } catch (error) {
//     return { error: "Failed to update slot reservation" }
//   }
// }
