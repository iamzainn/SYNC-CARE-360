"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { DoctorVerification } from "@prisma/client"

export async function submitDoctorVerification(
  data: Omit<DoctorVerification, "id" | "createdAt" | "updatedAt" | "status" | "doctorId">
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "DOCTOR") {
      return {
        error: "Unauthorized. Please login as a doctor."
      }
    }


    // Check if doctor already has a verification request
    const existingVerification = await db.doctorVerification.findFirst({
      where: {
        doctorId: session.user.id,
      },
    })

    if (existingVerification) {
      return { error: "Verification request already exists" }
    }

    // Create new verification request
    const verification = await db.doctorVerification.create({
      data: {
        ...data,
        status: "PENDING",
        doctorId: session.user.id,
      },
    })

    return { success: true, data: verification }
  } catch (error) {
    console.error("Error submitting doctor verification:", error)
    return { error: "Failed to submit verification request" }
  }
}