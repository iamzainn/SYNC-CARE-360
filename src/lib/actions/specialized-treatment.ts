// lib/actions/specialized-treatment.ts
'use server'

import { db } from "@/lib/db"
import { SpecializedTreatmentStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

// Function to get treatments for a nurse
export async function getSpecializedTreatmentsForNurse(nurseId: string) {
  try {
    const treatments = await db.specializedTreatment.findMany({
      where: {
        nurseId: nurseId
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            city: true,
          }
        },
        slots: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Parse patientDetails for each treatment to extract required services
    return treatments.map(treatment => {
      // Safely parse the patientDetails JSON if it exists
      const patientDetails = treatment.patientDetails ? 
        (typeof treatment.patientDetails === 'string' ? 
          JSON.parse(treatment.patientDetails as string) : 
          treatment.patientDetails) : 
        {};
      
      // Safely parse the servicePrices JSON if it exists
      const servicePrices = treatment.patientDetails && (patientDetails.servicePrices || treatment.totalAmount) ?
        (typeof treatment.totalAmount === 'string' ? 
          JSON.parse(treatment.totalAmount as string) : 
          treatment.totalAmount) : 
        {};
      
      // Get requested services array
      const requiredServices = patientDetails.requiredServices || [];
      
      return {
        ...treatment,
        patientDetails,
        requiredServices,
        servicePrices
      };
    });
  } catch (error) {
    console.error("Error fetching specialized treatments:", error)
    throw new Error("Failed to fetch treatments")
  }
}

// Function to get treatments for a patient
export async function getSpecializedTreatmentsForPatient(patientId: string) {
  try {
    const treatments = await db.specializedTreatment.findMany({
      where: {
        patientId: patientId
      },
      include: {
        nurse: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        },
        slots: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Parse patientDetails for each treatment
    return treatments.map(treatment => {
      // Safely parse the patientDetails JSON if it exists
      const patientDetails = treatment.patientDetails ? 
        (typeof treatment.patientDetails === 'string' ? 
          JSON.parse(treatment.patientDetails as string) : 
          treatment.patientDetails) : 
        {};
      
      // Safely parse the servicePrices JSON if it exists
      const servicePrices = treatment.patientDetails && (patientDetails.servicePrices || treatment.totalAmount) ?
        (typeof treatment.totalAmount === 'string' ? 
          JSON.parse(treatment.totalAmount as string) : 
          treatment.totalAmount) : 
        {};
      
      // Get requested services array
      const requiredServices = patientDetails.requiredServices || [];
      
      return {
        ...treatment,
        patientDetails,
        requiredServices,
        servicePrices
      };
    });
  } catch (error) {
    console.error("Error fetching specialized treatments for patient:", error)
    throw new Error("Failed to fetch treatments")
  }
}

// Function to update treatment status (accept/reject)
export async function updateTreatmentStatus(
  treatmentId: string, 
  status: 'ACCEPTED' | 'REJECTED'
) {
  try {
    await db.specializedTreatment.update({
      where: { id: treatmentId },
      data: { 
        status: status as SpecializedTreatmentStatus
      }
    })
    
    revalidatePath('/nurse/dashboard')
    return { success: true }
  } catch (error) {
    console.error("Error updating treatment status:", error)
    throw new Error("Failed to update treatment status")
  }
}