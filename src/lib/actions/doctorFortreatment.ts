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
  homeSlots?: any[]
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
        },
        Services: {
          homeService: {
            isActive: true,
            slots: {
              some: {}
            }
          }
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
        Services: {
          select: {
            homeService: {
              select: {
                slots: {
                  where: {
                    isReserved: false
                  },
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
        }
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

    const doctorsWithSlots = doctors.map(doctor => {
      const homeSlots = doctor.Services?.homeService?.slots || [];
      
      return {
        id: doctor.id,
        title: doctor.title,
        name: doctor.name,
        city: doctor.city,
        specialization: doctor.specialization,
        verification: doctor.verification,
        homeSlots: homeSlots
      };
    });

    return {
      success: true,
      data: doctorsWithSlots
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
        Services: {
          select: {
            homeService: {
              select: {
                slots: {
                  where: {
                    isReserved: false
                  },
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
        }
      }
    })

    if (!doctor) {
      return {
        success: false,
        error: "Doctor not found"
      }
    }

    const doctorWithSlots = {
      ...doctor,
      homeSlots: doctor.Services?.homeService?.slots || []
    };

    return {
      success: true,
      data: doctorWithSlots
    }
  } catch (error) {
    console.error("Failed to fetch doctor:", error)
    return {
      success: false,
      error: "Failed to fetch doctor details"
    }
  }
}
