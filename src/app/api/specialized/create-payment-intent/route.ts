// app/api/specialized/create-payment-intent/route.ts
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import Stripe from "stripe"

// Make sure you have the STRIPE_SECRET_KEY in your .env file
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { amount, treatmentId } = body

    console.log("Payment intent request:", { amount, treatmentId }); // Debug

    if (!amount || !treatmentId) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Convert amount from PKR to the smallest currency unit (paisa/cents)
    const amountInSmallestUnit = Math.round(amount * 100)

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: "pkr", // Make sure your Stripe account supports PKR
      metadata: {
        treatmentId,
        userId: session.user.id
      }
    })

    console.log("Payment intent created:", paymentIntent.id);

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error("[PAYMENT_INTENT_ERROR]", error)
    return new NextResponse("Internal Error: " + (error instanceof Error ? error.message : String(error)), { status: 500 })
  }
}