// app/actions/treatment.ts
"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export interface CreateTreatmentRequestParams {
  nurseId: string
  patientDetails: {
    fullName: string
    contactNumber: string
    address: string
    issueDetails: string
    medicalCondition: string
  }
  numberOfDays: number
  slot: {
    id: string
    dayOfWeek: string
    startTime: string
    endTime: string
    date: Date
  }
  paymentMethod: "cash" | "card"
  amount: number
  serviceCharge: number
  totalAmount: number
}

export async function createTreatmentRequest(params: CreateTreatmentRequestParams) {
  try {
    // Log the received parameters for debugging
    console.log("Creating treatment request with params:", JSON.stringify(params, null, 2))
    
    const session = await auth()

    if (!session?.user) {
      return {
        success: false,
        requiresAuth: true,
        error: "Authentication required"
      }
    }

    // Get patient from session
    const patient = await db.patient.findUnique({
      where: { id: session.user.id }
    })

    if (!patient) {
      return {
        success: false,
        error: "Patient account required"
      }
    }

    // Create the specialized treatment with simplified payment handling
    const specializedTreatment = await db.specializedTreatment.create({
      data: {
        patientId: patient.id,
        nurseId: params.nurseId,
        scheduledDate: params.slot.date,
        amount: params.amount,
        serviceCharge: params.serviceCharge,
        totalAmount: params.totalAmount,
        paymentMethod: params.paymentMethod === "card" ? "CARD" : "CASH_ON_DELIVERY",
        // Always set payment status to COMPLETED for simplicity
        paymentStatus: "COMPLETED",
        numberOfDays: params.numberOfDays,
        // Store patient details in the JSON field
        patientDetails: params.patientDetails,
        // Create the slot for this treatment
        slots: {
          create: {
            dayOfWeek: params.slot.dayOfWeek as any,
            startTime: params.slot.startTime,
            endTime: params.slot.endTime,
          }
        }
      }
    })

    revalidatePath("/Services/specialized-treatment")
    
    return {
      success: true,
      data: specializedTreatment
    }
  } catch (error) {
    console.error("Error creating treatment request:", error)
    return {
      success: false,
      error: "Failed to create treatment request"
    }
  }
}



// Add new function to update payment status
export async function updateTreatmentPaymentStatus({
  treatmentId,
  stripePaymentId,
  paymentMethod
}: {
  treatmentId: string
  stripePaymentId?: string
  paymentMethod: "card" | "cash"
}) {
  try {
    const session = await auth()

    if (!session?.user) {
      return {
        success: false,
        requiresAuth: true,
        error: "Authentication required"
      }
    }

    const updateData: any = {
      paymentStatus: "COMPLETED"
    }
    
    // Only add stripePaymentId if it's provided (for card payments)
    if (stripePaymentId) {
      updateData.stripePaymentId = stripePaymentId
    }

    const updatedTreatment = await db.specializedTreatment.update({
      where: { id: treatmentId },
      data: updateData
    })

    revalidatePath("/Services/specialized-treatment")
    
    return {
      success: true,
      data: updatedTreatment
    }
  } catch (error) {
    console.error("Error updating treatment payment:", error)
    return {
      success: false,
      error: "Failed to update payment status"
    }
  }
}
