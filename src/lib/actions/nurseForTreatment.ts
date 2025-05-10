"use server"

import { db } from "@/lib/db"

// Define the API Result type to fix the import error
export type GetApiResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getNurseById(nurseId: string): Promise<GetApiResult<any>> {
  try {
    const nurse = await db.nurse.findUnique({
      where: { id: nurseId },
      include: {
        specializedService: {
          include: {
            slots: {
              select: {
                id: true,
                dayOfWeek: true,
                startTime: true,
                endTime: true,
                isReserved: true
              }
            },
            serviceOfferings: {
              select: {
                id: true,
                serviceName: true,
                price: true,
                isActive: true,
                description: true
              }
            }
          }
        },
        verification: {
          select: {
            services: true
          }
        },
        SpecializedTreatment: {
          select: {
            id: true,
            status: true,
            slots: true
          }
        }
      }
    })

    if (!nurse) {
      return {
        success: false,
        error: "Nurse not found"
      }
    }

    // Use actual slots from the specializedService
    const slots = nurse.specializedService?.slots || [];
    
    // Get service offerings
    const serviceOfferings = nurse.specializedService?.serviceOfferings.filter(
      offering => offering.isActive
    ) || [];
    
    // Only return active nurses with available slots and services
    if (!nurse.specializedService?.isActive || slots.length === 0 || serviceOfferings.length === 0) {
      return {
        success: true,
        data: {
          ...nurse,
          slots: [],
          serviceOfferings: []
        }
      }
    }

    return {
      success: true,
      data: { 
        ...nurse,
        slots: slots,
        serviceOfferings: serviceOfferings,
        expertise: nurse.verification?.services || []
      }
    }
  } catch (error) {
    console.error("Error in getNurseById:", error)
    return {
      success: false,
      error: "Failed to fetch nurse details"
    }
  }
} 