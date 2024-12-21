'use server'
import { db } from "@/lib/db"
import {  urlToExpertise, urlToSpecialization } from "@/lib/helpers/specialization-mapping"
import { Doctor, Gender } from "@prisma/client"

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
  specialist?: string
  conditionSpecialist?:string
  gender?: string
  maxFee?: number
  minExperience?: number
  skip?: number
  take?: number
  isByCondition:boolean
}

export interface GetDoctorsResponse {
  doctors: DoctorWithDetails[]
  total: number
  hasMore: boolean
}

export async function getDoctors({
  city,
  specialist,
  conditionSpecialist,
  gender,
  maxFee,
  minExperience,
  skip = 0,
  take = 10,
  isByCondition = false,
}: GetDoctorsParams): Promise<GetDoctorsResponse> {
  try {
    
    const baseWhereClause = {
      isVerifiedDoctor: true,
      city: {
        equals: city,
        mode: 'insensitive'
      },
      verification: {
        status: 'APPROVED',
        ...(minExperience && {
          experienceYears: {
            gte: minExperience
          }
        }),
        // Conditionally add either specialization or expertise
        ...(isByCondition ? {
          expertise: {
            has: conditionSpecialist ? urlToExpertise(conditionSpecialist) : undefined
          }
        } : {
          specialization: {
            has: specialist ? urlToSpecialization(specialist) : undefined
          }
        })

      },
      ...(gender && { gender: gender as Gender }),
      onlineService: {
        isActive: true,
        ...(maxFee && {
          fee: {
            lte: maxFee
          }
        })
      }
    }

    // Clean up the where clause by removing undefined values
    const cleanWhereClause = JSON.parse(JSON.stringify(baseWhereClause))

    const [doctors, total] = await Promise.all([
      db.doctor.findMany({
        where: cleanWhereClause,
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
        ],
      }),
      db.doctor.count({
        where: cleanWhereClause
      })
    ])

    console.log("doctors : ",JSON.stringify(doctors,null,2))

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