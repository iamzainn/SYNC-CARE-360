'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { DayOfWeek } from "@prisma/client"
import { ApiResponse, OnlineServiceData, OnlineServicePayload } from "@/types"

const slotSchema = z.object({
  dayOfWeek: z.string(),
  startTime: z.string(),
  endTime: z.string()
})

const onlineServiceSchema = z.object({
  isActive: z.boolean(),
  fee: z.number().min(100),
  slots: z.array(slotSchema)
})

export async function getOnlineService(): Promise<ApiResponse<{ onlineService: OnlineServiceData | null }>> {
  try {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const doctor = await db.doctor.findUnique({
      where: { id: session.user.id },
      include: {
        onlineService: {
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
        onlineService: doctor?.onlineService ? {
          id: doctor.onlineService.id,
          isActive: doctor.onlineService.isActive,
          fee: doctor.onlineService.fee,
          slots: doctor.onlineService.slots,
          createdAt: doctor.onlineService.createdAt,
          updatedAt: doctor.onlineService.updatedAt
        } : null
      }
    }
  } catch (error) {
    return { error: "Failed to fetch online service" }
  }
}

export async function updateOnlineService(data: OnlineServicePayload): Promise<ApiResponse<void>> {
  try {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const validatedData = onlineServiceSchema.parse({
      isActive: data.isActive,
      fee: data.fee,
      slots: data.slots.map(slot => ({
        ...slot,
        dayOfWeek: slot.dayOfWeek.toUpperCase() as DayOfWeek
      }))
    })

    await db.$transaction(async (tx) => {
      // Create or update OnlineService
      const onlineService = await tx.onlineService.upsert({
        where: { doctorId: session.user.id },
        create: {
          doctorId: session.user.id,
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
        await tx.onlineServiceSlot.deleteMany({
          where: { onlineServiceId: onlineService.id }
        })

        // Create new slots
        await tx.onlineServiceSlot.createMany({
          data: validatedData.slots.map(slot => ({
            onlineServiceId: onlineService.id,
            dayOfWeek: slot.dayOfWeek as DayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isReserved: false
          }))
        })
      }
    })

    revalidatePath("/doctor/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to update online service:", error)
    return { error: error instanceof Error ? error.message : "Failed to update online service" }
  }
}

export async function toggleOnlineService(isActive: boolean): Promise<ApiResponse<void>> {
  try {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    await db.onlineService.upsert({
      where: { doctorId: session.user.id },
      create: {
        doctorId: session.user.id,
        isActive,
        fee: 0
      },
      update: {
        isActive
      }
    })

    revalidatePath("/doctor/dashboard")
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to toggle online service" }
  }
}

export async function updateSlotReservation(
  slotId: string, 
  isReserved: boolean
): Promise<ApiResponse<void>> {
  try {
    await db.onlineServiceSlot.update({
      where: { id: slotId },
      data: { isReserved }
    })
    return { success: true }
  } catch (error) {
    return { error: "Failed to update slot reservation" }
  }
}