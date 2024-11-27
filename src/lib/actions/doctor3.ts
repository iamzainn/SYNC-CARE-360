'use server'


import { Gender } from "@prisma/client"
import { db } from "../db"
import { DoctorWithDetails, GetDoctorsResponse } from "./doctor2"


export interface GetDoctorsParams {
    city: string
    gender?: string
    maxFee?: number
    minExperience?: number
    skip?: number
    take?: number
  }
  
  export async function getDoctorsByCity({
    city,
    gender,
    maxFee,
    minExperience,
    skip = 0,
    take = 10
  }: GetDoctorsParams): Promise<GetDoctorsResponse> {
    try {
      
      
  
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