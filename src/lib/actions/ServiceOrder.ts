"use server"

import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { revalidatePath } from "next/cache"
import { type MedicineOrderForm } from "@/lib/validations/medicine-order"
import {medicines, medicines as medicinesData } from "../data/medicines"

interface Medicine {
  id: string;
  name: string;
  price: number;
}

interface CreateOrderParams extends MedicineOrderForm {
  amount?: number;
  stripePaymentId?: string;
  selectedMedicines?: Medicine[];
  totalAmount?: number;
}

export async function createOrder(data: CreateOrderParams) {
  try {
    console.log("Received data:", JSON.stringify(data, null, 2))
    
    // Get medicine details from the medicine IDs in data.medicines
    const medicineDetails = data.medicines?.map(medicineId => {
      const medicine = medicines.find(m => m.id === medicineId)
      return medicine ? `${medicine.name} - Rs. ${medicine.price}` : null
    }).filter(Boolean) || [];

    console.log("Medicine details:", medicineDetails)

    const orderAmount = data.totalAmount || data.amount || 0;
    
    const order = await db.medicineOrder.create({
      data: {
        medicines: medicineDetails as string[], // Now storing full medicine names
        prescriptionUrl: data.prescriptionUrl,
        address: data.address,
        email: data.email,
        phoneNumber: data.phoneNumber,
        patientName: data.patientName,
        pharmacyName: data.pharmacyName,
        paymentMethod: data.paymentMethod,
        amount: orderAmount,
        serviceCharge: 200,
        totalAmount: orderAmount,
        ...(data.paymentMethod === "CARD" && {
          transaction: {
            create: {
              
              amount: orderAmount,
              stripePaymentId: data.stripePaymentId,
              status: "COMPLETED",
            }
          },
          paymentStatus: "COMPLETED"
        }),
        ...(data.paymentMethod === "CASH_ON_DELIVERY" && {
          paymentStatus: "PENDING"
        })
      }
    })

    revalidatePath("/admin/orders")
    
    return { 
      success: true, 
      order,
      message: "Order created successfully" 
    }
  } catch (error) {
    console.error("Failed to create order:", error)
    return { 
      success: false, 
      error: "Failed to create order. Please try again." 
    }
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