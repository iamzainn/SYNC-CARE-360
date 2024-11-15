
"use server"

import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { revalidatePath } from "next/cache"
import { type MedicineOrderForm } from "@/lib/validations/medicine-order"

interface CreateOrderParams extends MedicineOrderForm {
  amount?: number
  stripePaymentId?: string
}

export async function createOrder(data: CreateOrderParams) {
  try {
    const order = await db.medicineOrder.create({
      data: {
        medicines: data.medicines,
        prescriptionUrl: data.prescriptionUrl,
        address: data.address,
        phoneNumber: data.phoneNumber,
        patientName: data.patientName,
        pharmacyName: data.pharmacyName,
        paymentMethod: data.paymentMethod,
        amount: data.amount,
        ...(data.paymentMethod === "CARD" && {
          transaction: {
            create: {
              amount: data.amount!,
              stripePaymentId: data.stripePaymentId,
              status: "COMPLETED",
            }
          },
          paymentStatus: "COMPLETED"
        })
      }
    })

    revalidatePath("/admin/orders")
    return { success: true, order }
  } catch (error) {
    console.error("Failed to create order:", error)
    return { success: false, error: "Failed to create order" }
  }
}

export async function createPaymentIntent(amount: number) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "pkr",
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return { success: true, clientSecret: paymentIntent.client_secret }
  } catch (error) {
    console.error("Failed to create payment intent:", error)
    return { success: false, error: "Failed to create payment intent" }
  }
}