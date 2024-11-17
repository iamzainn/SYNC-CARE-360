// lib/actions/medical-record.ts
"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { BloodType } from "@prisma/client"

const medicalRecordSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string().or(z.date()),
  gender: z.enum(["MALE", "FEMALE"]),
  email: z.string().email(),
  phoneNumber: z.string(),
  medicalConditions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
  height: z.number().optional().nullable(),
  weight: z.number().optional().nullable(),
  bloodType: z.string().optional().nullable(),
  bloodPressure: z.object({
    systolic: z.number().optional().nullable(),
    diastolic: z.number().optional().nullable(),
  }).optional().nullable(),
  heartRate: z.number().optional().nullable(),
  medicalReportUrl: z.string().optional().nullable(),
  emergencyContactName: z.string(),
  emergencyContactPhone: z.string(),
  consentToStore: z.boolean(),
})

export async function createMedicalRecord(data: z.infer<typeof medicalRecordSchema>) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "PATIENT") {
      return {
        error: "Unauthorized. Please login as a patient."
      }
    }

    // Validate input data
    const validatedData = medicalRecordSchema.parse(data)

    const medicalRecord = await db.patientMedicalRecord.create({
      data: {
        patientId: session.user.id,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        gender: validatedData.gender,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber,
        medicalConditions: validatedData.medicalConditions || [],
        allergies: validatedData.allergies || [],
        currentMedications: validatedData.currentMedications || [],
        height: validatedData.height,
        weight: validatedData.weight,
        bloodType: validatedData.bloodType as BloodType,
        bloodPressure: validatedData.bloodPressure as any,
        heartRate: validatedData.heartRate,
        medicalReportUrl: validatedData.medicalReportUrl,
        emergencyContactName: validatedData.emergencyContactName,
        emergencyContactPhone: validatedData.emergencyContactPhone,
        consentToStore: validatedData.consentToStore,
      }
    })

    revalidatePath("/")
    return { success: true, data: medicalRecord }
  } catch (error) {
    console.error('Failed to create medical record:', error)
    if (error instanceof z.ZodError) {
      return {
        error: "Invalid data provided",
        details: error.errors
      }
    }
    return {
      error: "Failed to save medical record"
    }
  }
}