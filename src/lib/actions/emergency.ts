// app/actions/emergency.ts
"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"

import { revalidatePath } from "next/cache"

export async function addEmergencyContact(phoneNumber: string) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required",
        requiresAuth: true
      }
    }

    const contact = await db.emergencyPatientDetails.create({
      data: {
        phoneNumber,
        patientId: session.user.id
      }
    })

    revalidatePath("/services")
    
    return {
      success: true,
      data: contact
    }
  } catch (error) {
    console.error("Failed to add emergency contact:", error)
    return {
      success: false,
      error: "Failed to add emergency contact"
    }
  }
}

export async function getEmergencyContacts() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required"
      }
    }

    const contacts = await db.emergencyPatientDetails.findMany({
      where: {
        patientId: session.user.id
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return {
      success: true,
      data: contacts
    }
  } catch (error) {
    console.error("Failed to fetch emergency contacts:", error)
    return {
      success: false,
      error: "Failed to fetch emergency contacts"
    }
  }
}