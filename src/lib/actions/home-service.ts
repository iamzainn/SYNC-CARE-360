'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { DayOfWeek, SpecializationType } from "@prisma/client"




// Validation schemas
const specializationSchema = z.object({
  type: z.string(),
  price: z.number().min(100)
})

const slotSchema = z.object({
  dayOfWeek: z.string(),
  startTime: z.string(),
  endTime: z.string()
})

const homeServiceSchema = z.object({
  isActive: z.boolean(),
  specializations: z.array(specializationSchema),
  slots: z.array(slotSchema)
})

type HomeServicePayload = z.infer<typeof homeServiceSchema>

export async function getHomeService() {
  try {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const service = await db.services.findUnique({
      where: {
        doctorId: session.user.id
      },
      include: {
        homeService: {
          include: {
            specializations: true,
            slots: true
          }
        }
      }
    })

    return { data: service }
  } catch (error) {
    return { error: "Failed to fetch home service" }
  }
}

export async function updateHomeService(data: HomeServicePayload) {
  try {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    // Validate the payload
    // Validate and transform the data
    const validatedData = homeServiceSchema.parse({
      isActive: data.isActive,
      specializations: data.specializations.map(spec => ({
        ...spec,
        type: spec.type.toUpperCase() as SpecializationType  // Ensure correct enum value
      })),
      slots: data.slots.map(slot => ({
        ...slot,
        dayOfWeek: slot.dayOfWeek.toUpperCase() as DayOfWeek  // Ensure correct enum value
      }))
    })

    // Using a transaction to ensure data consistency
    await db.$transaction(async (tx) => {
      // First, ensure Services record exists
      let service = await tx.services.findUnique({
        where: { doctorId: session.user.id }
      })

      if (!service) {
        service = await tx.services.create({
          data: {
            doctorId: session.user.id,
            homeService: {
              create: {
                isActive: validatedData.isActive
              }
            }
          }
        })
      }

      // Update or create HomeService
      const homeService = await tx.homeService.upsert({
        where: {
          serviceId: service.id
        },
        create: {
          serviceId: service.id,
          isActive: validatedData.isActive,
          specializations: {
            createMany: {
              data:validatedData.specializations as any
            }
          },
          slots: {
            createMany: {
              data: validatedData.slots as any
            }
          }
        },
        update: {
          isActive: validatedData.isActive,
        }
      })

      // Update specializations
      if (validatedData.specializations.length > 0) {
        // Delete existing specializations
        await tx.homeServiceSpecialization.deleteMany({
          where: { homeServiceId: homeService.id }
        })

        // Create new specializations
        await tx.homeServiceSpecialization.createMany({
          data: validatedData.specializations.map(spec => ({
            homeServiceId: homeService.id,
            type: spec.type as any,
            price: spec.price 
          }))
        })
      }

      // Update slots
      if (validatedData.slots.length > 0) {
        // Delete existing slots
        await tx.homeServiceSlot.deleteMany({
          where: { homeServiceId: homeService.id }
        })

        // Create new slots
        await tx.homeServiceSlot.createMany({
          data: validatedData.slots.map(slot => ({
            homeServiceId: homeService.id,
            dayOfWeek: slot.dayOfWeek as any,
            startTime: slot.startTime,
            endTime: slot.endTime
          }))
        })
      }
    })

    revalidatePath("/doctor/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to update home service:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to update home service"
    }
  }
}


export async function updateSlotStatus(slotId: string, isReserved: boolean) {
  return await db.homeServiceSlot.update({
    where: { id: slotId },
    data: { isReserved }
  });
}

export async function toggleHomeService(isActive: boolean) {
  try {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    await db.$transaction(async (tx) => {
      const service = await tx.services.findUnique({
        where: { doctorId: session.user.id },
        include: { homeService: true }
      })

      if (service?.homeService) {
        await tx.homeService.update({
          where: { id: service.homeService.id },
          data: { isActive }
        })
      } else {
        await tx.services.create({
          data: {
            doctorId: session.user.id,
            homeService: {
              create: { isActive }
            }
          }
        })
      }
    })

    revalidatePath("/doctor/dashboard")
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to toggle home service"
    }
  }
}