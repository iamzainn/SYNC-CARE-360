import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    const patientId = request.nextUrl.searchParams.get('patientId')
    
    if (!patientId) {
      return NextResponse.json({ success: false, error: 'Patient ID required' }, { status: 400 })
    }
    
    // Check if authenticated user can access these records
    if (session.user.role !== 'PATIENT' && session.user.id !== patientId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }
    
    const records = await db.patientMedicalRecord.findMany({
      where: { patientId },
      orderBy: { updatedAt: 'desc' }
    })
    
    return NextResponse.json({ success: true, records })
  } catch (error) {
    console.error('Error fetching medical records:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch medical records' },
      { status: 500 }
    )
  }
}
