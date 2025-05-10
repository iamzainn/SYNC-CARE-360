import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function GET(
  req: Request,
  { params }: { params: { nurseId: string } }
) {
  try {
    const session = await auth()
    
    // Check if user is authenticated and authorized
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Only allow the nurse to view their own profile
    if (session.user.role !== 'NURSE' || session.user.id !== params.nurseId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    
    // Fetch nurse data with verification details
    const nurse = await db.nurse.findUnique({
      where: { id: params.nurseId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        gender: true,
        isVerifiedNurse: true,
        verification: {
          select: {
            id: true,
            services: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      }
    })
    
    if (!nurse) {
      return NextResponse.json({ error: "Nurse not found" }, { status: 404 })
    }
    
    return NextResponse.json(nurse)
  } catch (error) {
    console.error("[NURSE_PROFILE_ERROR]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 