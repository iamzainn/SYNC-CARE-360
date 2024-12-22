// lib/actions/specialized-treatment.ts
'use server'

import { db } from "@/lib/db"
import { SpecializedTreatmentStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getSpecializedTreatments(doctorId: string) {
  try {
    const treatments = await db.specializedTreatment.findMany({
      where: {
        doctorId,
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return treatments
  } catch (error) {
    console.error("Error fetching specialized treatments:", error)
    throw new Error("Failed to fetch specialized treatments")
  }
}

export async function updateTreatmentStatus(
  treatmentId: string,
  status: SpecializedTreatmentStatus
) {
  try {
    const treatment = await db.specializedTreatment.update({
      where: { id: treatmentId },
      data: { status },
    })

    revalidatePath("/doctor-dashboard")
    return { success: true, treatment }
  } catch (error) {
    console.error("Error updating treatment status:", error)
    throw new Error("Failed to update treatment status")
  }
}