// components/payments/stripe-payment-form.tsx
"use client"

import { useState } from "react"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripePaymentFormProps {
  clientSecret: string
  amount: number
  onSuccess: () => void
  onCancel: () => void
  orderDetails: {
    name: string
    address: string
    phone: string
  }
}

function PaymentForm({ amount, onSuccess, onCancel, orderDetails }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: orderDetails.name,
              phone: orderDetails.phone,
              address: {
                line1: orderDetails.address,
                country: 'PK',
              },
            },
          },
        },
        redirect: "if_required"
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === "succeeded") {
        onSuccess(); // Call the success handler directly
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Payment failed"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <PaymentElement 
        options={{
          layout: "tabs",
        }}
      />
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isProcessing || !stripe}
          className="flex-1"
        >
          {isProcessing ? "Processing..." : `Pay PKR ${amount}`}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export function StripePaymentForm({
  clientSecret,
  amount,
  onSuccess,
  onCancel,
  orderDetails
}: StripePaymentFormProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#2563eb',
      },
    },
  }

  return (
    <Elements stripe={stripePromise} options={options as any}>
      <PaymentForm 
        clientSecret={clientSecret}
        amount={amount}
        onSuccess={onSuccess}
        onCancel={onCancel}
        orderDetails={orderDetails}
      />
    </Elements>
  )
}