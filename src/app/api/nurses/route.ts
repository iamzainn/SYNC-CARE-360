import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const nurses = await db.nurse.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        gender: true,
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
        }
      }
    })

    // Transform the data to include only what's needed for the frontend
    const enhancedNurses = nurses.map(nurse => {
      // Check if nurse has active specialized service
      const isActive = nurse.specializedService?.isActive || false;
      
      // Get the available days
      const daysAvailable = nurse.specializedService?.slots.map(slot => slot.dayOfWeek) || [];
      
      // Determine if the nurse is available (has active service with slots)
      const isAvailable = isActive && daysAvailable.length > 0;
      
      // Get the fee from the specialized service or use a default
      const fee = nurse.specializedService?.fee;

      


      return {
        id: nurse.id,
        name: nurse.name,
        email: nurse.email,
        phone: nurse.phone,
        city: nurse.city,
        gender: nurse.gender,
        
        
        isAvailable,
        fee,
        
        slots: nurse.specializedService?.slots || []
      }
    });

    // Filter to only show nurses with active specialized services
   

    return NextResponse.json({
      success: true,
      nurses: enhancedNurses
    })
  } catch (error) {
    console.error("Error fetching nurses:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch nurses"
    }, { status: 500 })
  }
} 