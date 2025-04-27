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
  recordId: z.string().optional(),
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
    
    // Check if we're updating an existing record
    if (validatedData.recordId) {
      // First verify the record belongs to this patient
      const existingRecord = await db.patientMedicalRecord.findUnique({
        where: {
          id: validatedData.recordId,
          patientId: session.user.id
        }
      })
      
      if (!existingRecord) {
        return {
          error: "Medical record not found or not authorized to update"
        }
      }
      
      // Update the existing record
      const updatedRecord = await db.patientMedicalRecord.update({
        where: {
          id: validatedData.recordId
        },
        data: {
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
      return { success: true, data: updatedRecord, isUpdate: true }
    }
    
    // Create a new record if no recordId is provided
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
    return { success: true, data: medicalRecord, isNew: true }
  } catch (error) {
    console.error('Failed to create/update medical record:', error)
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

/**
 * Delete a medical record by ID
 */
export async function deleteMedicalRecord(recordId: string) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "PATIENT") {
      return {
        success: false,
        error: "Unauthorized. Please login as a patient."
      }
    }

    // Verify the record belongs to this patient
    const existingRecord = await db.patientMedicalRecord.findUnique({
      where: {
        id: recordId,
        patientId: session.user.id
      }
    })
    
    if (!existingRecord) {
      return {
        success: false,
        error: "Medical record not found or not authorized to delete"
      }
    }
    
    

    // Delete the record
    await db.patientMedicalRecord.delete({
      where: {
        id: recordId
      }
    })
    
    revalidatePath("/")
    return { 
      success: true,
      message: "Medical record deleted successfully" 
    }
  } catch (error) {
    console.error('Failed to delete medical record:', error)
    return {
      success: false,
      error: "Failed to delete medical record"
    }
  }
}