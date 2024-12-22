
// app/actions/doctors.ts
"use server"

import { db } from "@/lib/db"

export interface VerifiedDoctor {
  id: string
  title: string
  name: string
  city: string
  specialization: string
  verification: {
    experienceYears: number
    profilePhoto: string
    specialization: string[]
  } | null
}

export interface DoctorsResponse {
  success: boolean
  data?: VerifiedDoctor[]
  error?: string
}

export async function getVerifiedDoctors(): Promise<DoctorsResponse> {
  try {
    const doctors = await db.doctor.findMany({
      where: {
        isVerifiedDoctor: true,
        verification: {
          status: "APPROVED"
        }
      },
      select: {
        id: true,
        title: true,
        name: true,
        city: true,
        specialization: true,
        verification: {
          select: {
            experienceYears: true,
            profilePhoto: true,
            specialization: true,
          }
        },
      },
      orderBy: [
        {
          verification: {
            experienceYears: 'desc'
          }
        },
        {
          name: 'asc'
        }
      ]
    })

    return {
      success: true,
      data: doctors as VerifiedDoctor[]
    }
  } catch (error) {
    console.error("Failed to fetch doctors:", error)
    return {
      success: false,
      error: "Failed to fetch verified doctors"
    }
  }
}

export async function getDoctorById(id: string) {
  try {
    const doctor = await db.doctor.findUnique({
      where: {
        id,
        isVerifiedDoctor: true,
        verification: {
          status: "APPROVED"
        }
      },
      select: {
        id: true,
        title: true,
        name: true,
        city: true,
        specialization: true,
        verification: {
          select: {
            experienceYears: true,
            profilePhoto: true,
            specialization: true,
          }
        },
      }
    })

    if (!doctor) {
      return {
        success: false,
        error: "Doctor not found"
      }
    }

    return {
      success: true,
      data: doctor
    }
  } catch (error) {
    console.error("Failed to fetch doctor:", error)
    return {
      success: false,
      error: "Failed to fetch doctor details"
    }
  }
}
