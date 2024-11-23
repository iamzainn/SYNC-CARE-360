import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    const { amount, appointmentId } = await req.json()

    // Create PaymentIntent with metadata for online consultation
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "pkr",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        appointmentId,
        type: 'online_consultation'
      }
    })

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret 
    })
  } catch (error) {
    console.error('Online payment intent error:', error)
    return NextResponse.json(
      { error: "Error creating payment intent for online consultation" },
      { status: 500 }
    )
  }
}
