import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "PATIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const searchParams = request.nextUrl.searchParams
    const patientId = searchParams.get("patientId")
    
    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }
    
    // Verify the requester has access to this patient's data
    if (session.user.id !== patientId) {
      return NextResponse.json({ error: "Unauthorized to access this patient's data" }, { status: 403 })
    }
    
    const treatments = await db.specializedTreatment.findMany({
      where: {
        patientId,
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            email: true,
            phone: true,
          },
        },
        patientMedicalRecord: true,
        slots: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    
    return NextResponse.json(treatments)
  } catch (error) {
    console.error("Error fetching specialized treatments:", error)
    return NextResponse.json(
      { error: "Failed to fetch specialized treatments" },
      { status: 500 }
    )
  }
} 