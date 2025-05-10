import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch nurses with their specializations and service offerings
    const nurses = await db.nurse.findMany({
      where: {
        // Only fetch verified nurses
        isVerifiedNurse: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        gender: true,
        verification: {
          select: {
            services: true
          }
        },
        specializedService: {
          select: {
            id: true,
            isActive: true,
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
        }
      }
    })

    // Transform the data to include only what's needed for the frontend
    const enhancedNurses = nurses.map(nurse => {
      // Check if nurse has specialized service
      const hasSpecializedService = !!nurse.specializedService;
      const isActive = nurse.specializedService?.isActive || false;
      
      // Get the available days
      const daysAvailable = nurse.specializedService?.slots.map(slot => slot.dayOfWeek) || [];
      
      // Determine if the nurse is available (has active service with slots)
      const hasSlots = daysAvailable.length > 0;
      const isAvailable = isActive && hasSlots;
      
      // Extract verified expertise and skills
      const expertise = nurse.verification?.services || [];
      
      // Get active service offerings
      const serviceOfferings = nurse.specializedService?.serviceOfferings.filter(offering => offering.isActive) || [];
      const hasServiceOfferings = serviceOfferings.length > 0;

      return {
        id: nurse.id,
        name: nurse.name,
        email: nurse.email,
        phone: nurse.phone,
        city: nurse.city,
        gender: nurse.gender,
        isAvailable,
        hasSpecializedService,
        hasServiceOfferings,
        isActive,
        expertise,
        serviceOfferings,
        slots: nurse.specializedService?.slots || []
      }
    });

    // Filter nurses to only include those with:
    // 1. Has a specialized service
    // 2. Has at least one active service offering
    const availableNurses = enhancedNurses.filter(nurse => 
      nurse.hasSpecializedService && 
      nurse.isActive && 
      nurse.hasServiceOfferings
    );

    // Log count of nurses before and after filtering (for debugging)
    console.log(`Found ${nurses.length} nurses, ${availableNurses.length} with active service offerings`);

    return NextResponse.json({
      success: true,
      nurses: availableNurses
    })
  } catch (error) {
    console.error("Error fetching nurses:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch nurses"
    }, { status: 500 })
  }
} 