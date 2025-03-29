// app/actions/treatment.ts
"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { PaymentMethod } from "@prisma/client"


interface CreateTreatmentRequestParams {
  doctorId: string
  prescriptionUrl?: string
  treatmentDetails?: string
  slot: {
    id: string
    dayOfWeek: string
    startTime: string
    endTime: string
    date: Date
  }
  paymentMethod: 'card' | 'cash'
  amount: number
  serviceCharge: number
  totalAmount: number
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

    console.log("Slot data received:", data.slot); // Debug the slot data

    // Use transaction to ensure slot reservation and treatment creation happen together
    const result = await db.$transaction(async (tx) => {
      // First, create the treatment request
      const treatment = await tx.specializedTreatment.create({
        data: {
          patientId: session.user.id,
          doctorId: data.doctorId,
          prescriptionUrl: data.prescriptionUrl,
          treatmentDetails: data.treatmentDetails,
          status: "PENDING",
          scheduledDate: data.slot.date,
          paymentMethod: data.paymentMethod === 'card' ? PaymentMethod.CARD : null,
          paymentStatus: data.paymentMethod === 'cash' ? 'PENDING' : 'PENDING',
          amount: data.amount,
          serviceCharge: data.serviceCharge,
          totalAmount: data.totalAmount
        }
      });

      // Instead of updating a specialized slot, we need to mark the home service slot as reserved
      // Since we're using home service slots for specialized treatments
      try {
        await tx.homeServiceSlot.update({
          where: { 
            id: data.slot.id 
          },
          data: { 
            isReserved: true 
          }
        });
      } catch (error) {
        console.error("Error updating slot:", error);
        // If updating the slot fails, we should still create the treatment
        // but log the error for administrators to handle
      }

      return treatment;
    });

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("Failed to create treatment request:", error);
    return {
      success: false,
      error: "Failed to create treatment request"
    };
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
            experienceYears: true,
            profilePhoto: true
          }
        },
        // Include home service slots to convert to specialized slots
        Services: {
          include: {
            homeService: {
              include: {
                slots: true
              }
            }
          }
        }
      }
    })

    // Process doctors to add specialized slots
    const doctorsWithSlots = await Promise.all(
      doctors.map(async (doctor) => {
        // Check if doctor already has specialized slots
        const existingSpecializedSlots = await db.specializedTreatmentSlot.findMany({
          where: {
            specializedTreatment: {
              doctorId: doctor.id
            }
          }
        })

        if (existingSpecializedSlots.length > 0) {
          return {
            ...doctor,
            specializedSlots: existingSpecializedSlots
          }
        }

        // If no specialized slots, but home service slots exist, create equivalent ones
        const homeSlots = doctor.Services?.homeService?.slots || []
        
        if (homeSlots.length > 0) {
          const newSpecializedSlots = await Promise.all(
            homeSlots.map(async (slot) => {
              return await db.specializedTreatmentSlot.create({
                data: {
                  dayOfWeek: slot.dayOfWeek,
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                  isReserved: false
                }
              })
            })
          )
          
          return {
            ...doctor,
            specializedSlots: newSpecializedSlots
          }
        }

        // No slots available
        return {
          ...doctor,
          specializedSlots: []
        }
      })
    )

    return {
      success: true,
      data: doctorsWithSlots
    }
  } catch (error) {
    console.error("Failed to fetch doctors:", error)
    return {
      success: false,
      error: "Failed to fetch doctors"
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
  paymentMethod: 'card' | 'cash'
}) {
  try {
    const updatedTreatment = await db.specializedTreatment.update({
      where: { id: treatmentId },
      data: {
        paymentStatus: paymentMethod === 'card' ? 'COMPLETED' : 'PENDING',
        stripePaymentId: stripePaymentId || null,
        updatedAt: new Date()
      }
    })

    return { success: true, treatment: updatedTreatment }
  } catch (error) {
    console.error('Payment status update error:', error)
    return { success: false, error: "Failed to update payment status" }
  }
}
