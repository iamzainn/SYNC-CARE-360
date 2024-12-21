// app/actions/test-booking.ts
"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

import { revalidatePath } from "next/cache"

interface CreateTestBookingParams {
  address: string
  phoneNumber: string
  paymentMethod: "CARD" | "CASH_ON_DELIVERY"
  bookedTests: {
    testId: string
    testName: string
    labId: string
    labName: string
    price: number
    discountedPrice?: number
  }[]
  amount: number
  serviceCharge: number
  totalAmount: number
}

export async function createTestBooking(data: CreateTestBookingParams) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required",
        requiresAuth: true
      }
    }

    const booking = await db.testBooking.create({
      data: {
        patientId: session.user.id,
        address: data.address,
        phoneNumber: data.phoneNumber,
        paymentMethod: data.paymentMethod,
        bookedTests: data.bookedTests,
        amount: data.amount,
        serviceCharge: data.serviceCharge,
        totalAmount: data.totalAmount,
        status: "PENDING",
        paymentStatus: data.paymentMethod === "CARD" ? "PENDING" : "COMPLETED",
      }
    })

    revalidatePath("/dashboard/test-bookings")
    
    return {
      success: true,
      data: booking
    }
  } catch (error) {
    console.error("Failed to create test booking:", error)
    return {
      success: false,
      error: "Failed to create test booking"
    }
  }
}

export async function createTestPaymentIntent(amount: number) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required",
        requiresAuth: true
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "pkr",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        type: "test_booking",
        userId: session.user.id
      }
    })
    console.log("payment intend successfull")

    return {
      success: true,
      clientSecret: paymentIntent.client_secret
    }
  } catch (error) {
    console.error("Failed to create payment intent:", error)
    return {
      success: false,
      error: "Failed to create payment intent"
    }
  }
}

export async function updateTestBookingPayment(
  bookingId: string,
  stripePaymentId: string
) {


  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required"
      }
    }

    console.log("here i am in updating booking payment status")

    await db.testBooking.update({
      where: {
        id: bookingId,
        patientId: session.user.id
      },
      data: {
        paymentStatus: "COMPLETED",
        stripePaymentId,
        paymentDate: new Date()
      }
    })

    console.log("update successfully with data")

    revalidatePath("/dashboard/test-bookings")
    
    return { success: true }
  } catch (error) {
    console.error("Failed to update payment status:", error)
    return {
      success: false,
      error: "Failed to update payment status"
    }
  }
}