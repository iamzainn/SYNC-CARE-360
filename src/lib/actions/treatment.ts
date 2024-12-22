
// app/actions/treatment.ts
"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"


interface CreateTreatmentRequestParams {
  doctorId: string
  prescriptionUrl?: string
  treatmentDetails?: string
}

export async function createTreatmentRequest(data: CreateTreatmentRequestParams) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required",
        requiresAuth: true
      }
    }

    const treatment = await db.specializedTreatment.create({
      data: {
        patientId: session.user.id,
        doctorId: data.doctorId,
        prescriptionUrl: data.prescriptionUrl,
        treatmentDetails: data.treatmentDetails,
        status: "PENDING"
      }
    })

    return {
      success: true,
      data: treatment
    }
  } catch (error) {
    console.error("Failed to create treatment request:", error)
    return {
      success: false,
      error: "Failed to create treatment request"
    }
  }
}

export async function getVerifiedDoctors() {
  try {
    const doctors = await db.doctor.findMany({
      where: {
        isVerifiedDoctor: true
      },
      select: {
        id: true,
        title: true,
        name: true,
        specialization: true,
        city: true,
        verification: {
          select: {
            experienceYears: true
          }
        }
      }
    })

    return {
      success: true,
      data: doctors
    }
  } catch (error) {
    console.error("Failed to fetch doctors:", error)
    return {
      success: false,
      error: "Failed to fetch doctors"
    }
  }
}
