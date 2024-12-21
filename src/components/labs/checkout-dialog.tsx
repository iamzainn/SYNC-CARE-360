// components/labs/checkout-dialog.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCartStore } from "@/store/useCartStore"
import { useToast } from "@/hooks/use-toast"

import { 
  createTestBooking, 
  createTestPaymentIntent,
  updateTestBookingPayment 
} from "@/lib/actions/test-booking"
import { labs, tests } from "@/libdata/labs"
import { StripePaymentForm } from "@/app/components/payments/stripe-payment-form"


interface CheckoutForm {
  address: string
  phoneNumber: string
}

interface CheckoutDialogProps {
  open: boolean
  onClose: () => void
}

export function CheckoutDialog({ open, onClose }: CheckoutDialogProps) {
  const [isPending, setIsPending] = useState(false)
  const [bookingId, setBookingId] = useState<string>("")
  const [formData, setFormData] = useState<CheckoutForm>({
    address: "",
    phoneNumber: ""
  })
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'CASH_ON_DELIVERY'>('CASH_ON_DELIVERY')
  const [paymentIntent, setPaymentIntent] = useState<string>("")
  
  const { items, getTotal, clearCart } = useCartStore()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!open) {
      setFormData({ address: "", phoneNumber: "" })
      setPaymentIntent("")
      setBookingId("")
      setPaymentMethod('CASH_ON_DELIVERY')
    }
  }, [open])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    console.log("Starting checkout process...")
    setIsPending(true)

    try {
      // Validate form data
      if (!formData.address.trim() || !formData.phoneNumber.trim()) {
        throw new Error("Please fill in all required fields")
      }

      // Format booked tests
      const bookedTests = items.map(item => {
        const test = tests.find(t => t.id === item.testId)
        const lab = labs.find(l => l.id === item.labId)
        
        if (!test || !lab) {
          throw new Error("Invalid test or lab data")
        }

        return {
          testId: item.testId,
          testName: test.name,
          labId: item.labId,
          labName: lab.name,
          price: item.price,
          discountedPrice: item.discountedPrice
        }
      })

      const amount = getTotal()
      const serviceCharge = 100
      const totalAmount = amount + serviceCharge

      // Create booking
      const bookingResult = await createTestBooking({
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        paymentMethod,
        bookedTests,
        amount,
        serviceCharge,
        totalAmount
      })

      console.log("Booking result:", bookingResult)

      if (bookingResult.requiresAuth) {
        const returnUrl = encodeURIComponent(window.location.pathname)
        router.push(`/patient/auth?callbackUrl=${returnUrl}`)
        return
      }

      if (!bookingResult.success) {
        throw new Error(bookingResult.error)
      }

      // Store booking ID for payment update
      setBookingId(bookingResult?.data?.id as string);
      

      if (paymentMethod === 'CARD') {
        const paymentResult = await createTestPaymentIntent(totalAmount)
        
        if (!paymentResult.success) {
          throw new Error(paymentResult.error)
        }

        setPaymentIntent(paymentResult.clientSecret ?? "")
      } else {
        handleSuccess()
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process checkout"
      })
    } finally {
      setIsPending(false)
    }
  }

  const handleSuccess = async () => {
    try {
      if (bookingId && paymentMethod === 'CARD') {
        console.log("Updating payment status for booking:", bookingId)
        const result = await updateTestBookingPayment(bookingId, paymentIntent)
        
        if (!result.success) {
          throw new Error("Failed to update payment status")
        }
      }

      clearCart()
      onClose()
      toast({
        title: "Success",
        description: "Your test booking has been confirmed. We'll contact you shortly."
      })
    } catch (error) {
      console.error("Error in success handler:", error)
      toast({
        variant: "destructive",
        title: "Warning",
        description: "Booking created but status update failed. Please contact support."
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Your Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!paymentIntent ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Contact Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Sample Collection Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Enter complete address"
                    value={formData.address}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value: 'CARD' | 'CASH_ON_DELIVERY') => 
                      setPaymentMethod(value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CASH_ON_DELIVERY" id="cod" />
                      <Label htmlFor="cod">Cash on Sample Collection</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CARD" id="card" />
                      <Label htmlFor="card">Pay with Card</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isPending}
              >
                {isPending ? "Processing..." : "Confirm Booking"}
              </Button>
            </form>
          ) : (
            <StripePaymentForm
              clientSecret={paymentIntent}
              amount={getTotal() + 100}
              onSuccess={handleSuccess}
              onCancel={() => {
                setPaymentIntent("")
                setBookingId("")
              }}
              orderDetails={{
                name: "Test Booking",
                address: formData.address,
                phone: formData.phoneNumber,
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}