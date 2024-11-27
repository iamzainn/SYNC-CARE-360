'use server'
import { db } from "@/lib/db"
import { specializationToUrl, urlToSpecialization } from "@/lib/helpers/specialization-mapping"
import { Doctor, Gender, VerificationStatus } from "@prisma/client"

export interface DoctorWithDetails extends Doctor {
  verification: {
    experienceYears: number
    pmcNumber: string
    profilePhoto: string
    specialization: string[]
  } | null
  onlineService: {
    id: string
    fee: number
    isActive: boolean
    slots: {
      id:string
      dayOfWeek: string
      startTime: string
      endTime: string
      isReserved: boolean
    }[]
  } | null
}

export interface GetDoctorsParams {
  city: string
  specialist: string
  gender?: string
  maxFee?: number
  minExperience?: number
  skip?: number
  take?: number
}

export interface GetDoctorsResponse {
  doctors: DoctorWithDetails[]
  total: number
  hasMore: boolean
}

export async function getDoctors({
  city,
  specialist,
  gender,
  maxFee,
  minExperience,
  skip = 0,
  take = 10
}: GetDoctorsParams): Promise<GetDoctorsResponse> {
  try {
    
    const specialization = urlToSpecialization(specialist)
    console.log("spec",specialization)

    const doctors = await db.doctor.findMany({
      where: {
        isVerifiedDoctor: true,
        city: {
          equals: city,
          mode: 'insensitive'
        },
        verification: {
          status: 'APPROVED',
          experienceYears: minExperience ? {
            gte: minExperience
          } : undefined,
          // Use array contains for specialization
          specialization: {
            has: specialization
          }
        },
        gender: gender as Gender | undefined,
        onlineService: {
          isActive: true,
          fee: maxFee ? {
            lte: maxFee
          } : undefined,
        }
      },
      include: {
        onlineService: {
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
        verification: {
          select: {
            experienceYears: true,
            pmcNumber: true,
            profilePhoto: true,
            specialization: true
          }
        }
      },
      skip,
      take,
      orderBy: [
        {
          onlineService: {
            fee: 'asc'
          }
        },
        {
          verification: {
            experienceYears: 'desc'
          }
        }
      ]
    })

    const total = await db.doctor.count({
      where: {
        isVerifiedDoctor: true,
        city: {
          equals: city,
          mode: 'insensitive'
        },
        verification: {
          status: 'APPROVED',
          specialization: {
            has: specialization
          }
        }
      }
    })

    return {
      doctors: doctors as DoctorWithDetails[],
      total,
      hasMore: skip + take < total
    }
  } catch (error) {
    console.error('Error fetching doctors:', error)
    throw new Error('Failed to fetch doctors')
  }
}