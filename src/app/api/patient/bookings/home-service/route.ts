import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get("patientId")

    if (!patientId) {
      return new NextResponse("Patient ID is required", { status: 400 })
    }

    const bookings = await db.homeServiceBooking.findMany({
      where: {
        patientId: patientId
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            specialization: true,
            isVerifiedDoctor: true
          }
        },
        homeService: {
          include: {
            specializations: true
          }
        }
      },
      orderBy: {
        scheduledDate: 'desc'
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("[PATIENT_BOOKINGS_GET_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}