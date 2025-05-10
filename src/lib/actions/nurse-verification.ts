"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

interface NurseVerificationData {
  services: string[]
}

export async function submitNurseVerification(data: NurseVerificationData) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "NURSE") {
      return {
        error: "Unauthorized. Please login as a nurse."
      }
    }

    // Check if verification already exists
    const existingVerification = await db.nurseVerification.findUnique({
      where: { nurseId: session.user.id }
    })

    // If verification exists, update it
    if (existingVerification) {
      await db.nurseVerification.update({
        where: { id: existingVerification.id },
        data: {
          services: data.services,
          status: "PENDING", // Reset to pending if resubmitting
          updatedAt: new Date()
        }
      })
    } else {
      // Create new verification
      await db.nurseVerification.create({
        data: {
          services: data.services,
          nurseId: session.user.id
        }
      })
    }

    revalidatePath("/nurse/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error submitting nurse verification:", error)
    return { error: error instanceof Error ? error.message : "Failed to submit verification" }
  }
}

