import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get the selected services from the URL query params
    const { searchParams } = new URL(request.url);
    const selectedServices = searchParams.get('services')?.split(',') || [];
    
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
    // 3. Offers ALL of the selected services (if any are selected)
    const availableNurses = enhancedNurses.filter(nurse => {
      // Basic availability checks
      const basicAvailability = nurse.hasSpecializedService && 
                                nurse.isActive && 
                                nurse.hasServiceOfferings;
      
      // If no services were selected, just return based on basic availability
      if (selectedServices.length === 0) {
        return basicAvailability;
      }
      
      // Check if nurse offers ALL selected services
      const nurseServiceNames = nurse.serviceOfferings.map(offering => offering.serviceName);
      const hasAllSelectedServices = selectedServices.every(
        service => nurseServiceNames.includes(service)
      );
      
      return basicAvailability && hasAllSelectedServices;
    });

    // Log count of nurses before and after filtering (for debugging)
    console.log(`Found ${nurses.length} nurses, ${availableNurses.length} with the requested services`);
    
    if (selectedServices.length > 0) {
      console.log(`Filtered for services: ${selectedServices.join(', ')}`);
    }

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