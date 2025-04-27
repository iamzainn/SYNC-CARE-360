'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { DayOfWeek } from "@prisma/client"

// Define types
export type ApiResponse<T = any> = { 
  success?: boolean;
  data?: T;
  error?: string;
}

export type SpecializedServiceData = {
  id: string;
  isActive: boolean;
  fee: number;
  slots: {
    id: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    isReserved: boolean;
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
  fee: z.number().min(100),
  slots: z.array(slotSchema)
})

export async function getSpecializedService(): Promise<ApiResponse<{ specializedService: SpecializedServiceData | null }>> {
  try {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const nurse = await db.nurse.findUnique({
      where: { id: session.user.id },
      include: {
        specializedService: {
          include: {
            slots: {
              select: {
                id: true,
                dayOfWeek: true,
                startTime: true,
                endTime: true,
                isReserved: true
              }
            }
          }
        }
      }
    })

    return { 
      data: { 
        specializedService: nurse?.specializedService ? {
          id: nurse.specializedService.id,
          isActive: nurse.specializedService.isActive,
          fee: nurse.specializedService.fee,
          slots: nurse.specializedService.slots,
          createdAt: nurse.specializedService.createdAt,
          updatedAt: nurse.specializedService.updatedAt
        } : null
      }
    }
  } catch (error) {
    return { error: "Failed to fetch specialized service" }
  }
}

export async function updateSpecializedService(data: SpecializedServicePayload): Promise<ApiResponse<void>> {
  try {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const validatedData = specializedServiceSchema.parse({
      isActive: data.isActive,
      fee: data.fee,
      slots: data.slots.map(slot => ({
        ...slot,
        dayOfWeek: slot.dayOfWeek.toUpperCase() as DayOfWeek
      }))
    })

    await db.$transaction(async (tx) => {
      // Create or update SpecializedService
      const specializedService = await tx.specializedService.upsert({
        where: { nurseId: session.user.id },
        create: {
          nurseId: session.user.id,
          isActive: validatedData.isActive,
          fee: validatedData.fee
        },
        update: {
          isActive: validatedData.isActive,
          fee: validatedData.fee
        }
      })

      // Update slots if provided
      if (validatedData.slots.length > 0) {
        // Delete existing slots
        await tx.specializedServiceSlot.deleteMany({
          where: { specializedServiceId: specializedService.id }
        })

        // Create new slots
        await tx.specializedServiceSlot.createMany({
          data: validatedData.slots.map(slot => ({
            specializedServiceId: specializedService.id,
            dayOfWeek: slot.dayOfWeek as DayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isReserved: false
          }))
        })
      }
    })

    revalidatePath("/nurse/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to update specialized service:", error)
    return { error: error instanceof Error ? error.message : "Failed to update specialized service" }
  }
}

export async function toggleSpecializedService(isActive: boolean): Promise<ApiResponse<void>> {
  try {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    await db.specializedService.upsert({
      where: { nurseId: session.user.id },
      create: {
        nurseId: session.user.id,
        isActive,
        fee: 0
      },
      update: {
        isActive
      }
    })

    revalidatePath("/nurse/dashboard")
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to toggle specialized service" }
  }
}

export async function updateSlotReservation(
  slotId: string, 
  isReserved: boolean
): Promise<ApiResponse<void>> {
  try {
    await db.specializedServiceSlot.update({
      where: { id: slotId },
      data: { isReserved }
    })
    return { success: true }
  } catch (error) {
    return { error: "Failed to update slot reservation" }
  }
}
