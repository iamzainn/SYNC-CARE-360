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
            }
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
    
    // Only return active nurses with available slots
    if (!nurse.specializedService?.isActive || slots.length === 0) {
      return {
        success: true,
        data: {
          ...nurse,
          slots: [],
          fee: nurse.specializedService?.fee || 1500
        }
      }
    }

    return {
      success: true,
      data: { 
        ...nurse,
        slots: slots,
        fee: nurse.specializedService?.fee || 1500 
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