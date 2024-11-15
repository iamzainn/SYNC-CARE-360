// components/services/medicine-order-form.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { medicineOrderSchema, type MedicineOrderForm } from "@/lib/validations/medicine-order"
import { UploadDropzone } from "@/utils/uploadthing"
import { X, Image as ImageIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { StripePaymentForm } from "../payments/stripe-payment-form"
import { Dialog, DialogContent, DialogHeader,  DialogTitle } from "@/components/ui/dialog"
import { createOrder, createPaymentIntent } from "@/lib/actions/ServiceOrder"

interface UploadedFile {
  url: string;
  name: string;
}

export function MedicineOrderForm() {
  const [isPending, setIsPending] = useState(false)
  const [isPaymentPending, setIsPaymentPending] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const { toast } = useToast()
  const [paymentIntent, setPaymentIntent] = useState<string>("")
  const [amount, setAmount] = useState<number>(0)
  const [showPayment, setShowPayment] = useState(false)

  const form = useForm<MedicineOrderForm>({
    resolver: zodResolver(medicineOrderSchema),
    defaultValues: {
      medicines: "",
      prescriptionUrl: "",
      address: "",
      phoneNumber: "",
      patientName: "",
      pharmacyName: "",
      paymentMethod: "CASH_ON_DELIVERY",
    },
  })

  async function handlePayment(orderData: MedicineOrderForm) {
    setIsPaymentPending(true)
    try {
      const orderAmount = 1000 // Example amount
      const paymentResult = await createPaymentIntent(orderAmount)

      if (!paymentResult.success) {
        throw new Error(paymentResult.error)
      }

      setAmount(orderAmount)
      setPaymentIntent(paymentResult.clientSecret ?? "")
      setShowPayment(true)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize payment"
      })
    } finally {
      setIsPaymentPending(false)
    }
  }

  async function handleCashOnDelivery(data: MedicineOrderForm) {
    setIsPending(true)
    try {
      const result = await createOrder({
        ...data,
        paymentMethod: "CASH_ON_DELIVERY"
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: "Order Placed!",
        description: "We'll contact you shortly to confirm your order."
      })

      form.reset()
      setUploadedFile(null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to place order. Please try again."
      })
    } finally {
      setIsPending(false)
    }
  }

  const handlePaymentSuccess = async () => {
    setIsPending(true)
    try {
      const formData = form.getValues()
      const result = await createOrder({
        ...formData,
        paymentMethod: "CARD",
        amount: amount,
        stripePaymentId: paymentIntent
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: "Order Confirmed!",
        description: "Your payment was successful and order has been placed."
      })

      setShowPayment(false)
      form.reset()
      setUploadedFile(null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to confirm order. Please contact support."
      })
    } finally {
      setIsPending(false)
    }
  }

  async function onSubmit(data: MedicineOrderForm) {
    if (data.paymentMethod === 'CARD') {
      await handlePayment(data)
    } else {
      await handleCashOnDelivery(data)
    }
  }

 

  const handlePaymentCancel = () => {
    setShowPayment(false)
    setPaymentIntent("")
  }

  const handleFileRemove = () => {
    setUploadedFile(null)
    form.setValue('prescriptionUrl', '')
  }

  return (
    <section 
      id="order-form"
      className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Order Medicine Online At Your Doorstep
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Fill out the following form please:
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="medicines"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Your Medicine</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List your medicines here..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-center text-gray-500 text-sm my-4">OR</div>

            {/* UploadThing Integration */}
            <FormField
              control={form.control}
              name="prescriptionUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attach your prescription form</FormLabel>
                  <FormControl>
                    <div className="flex flex-col space-y-4">
                      {!uploadedFile ? (
                        <UploadDropzone
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            if (res && res[0]) {
                              setUploadedFile({
                                url: res[0].url,
                                name: res[0].name
                              })
                              field.onChange(res[0].url)
                            }
                            toast({
                              title: "Upload Complete",
                              description: "Prescription uploaded successfully",
                            })
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: "destructive",
                              title: "Error",
                              description: error.message || "Failed to upload file",
                            })
                          }}
                          appearance={{
                            container: "p-6 border-2 border-dashed border-gray-300 rounded-lg",
                            allowedContent: "text-sm text-gray-500",
                            button: cn(
                              "bg-blue-600 hover:bg-blue-700 text-white",
                              "ut-uploading:bg-blue-500 ut-uploading:cursor-not-allowed"
                            )
                          }}
                        />
                      ) : (
                        <div className="relative flex items-center p-4 bg-gray-50 rounded-lg">
                          <ImageIcon className="h-8 w-8 text-blue-500 mr-3" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {uploadedFile.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Upload complete
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-2"
                            onClick={handleFileRemove}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Write your address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your complete delivery address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone and Patient Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="03XX XXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add Patient s Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Patient Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pharmacy Name */}
            <FormField
              control={form.control}
              name="pharmacyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Pharmacy Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Preferred pharmacy name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Method */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="CASH_ON_DELIVERY" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Cash on Delivery
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="CARD" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Pay with Card
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={isPending || isPaymentPending}
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </div>
        ) : isPaymentPending ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Initializing Payment...
          </div>
        ) : (
          "Place Order"
        )}
      </Button>
          </form>
        </Form>
        <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          {paymentIntent && (
            <StripePaymentForm
              clientSecret={paymentIntent}
              amount={amount}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
              orderDetails={{
                name: form.getValues('patientName'),
                address: form.getValues('address'),
                phone: form.getValues('phoneNumber'),
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      </div>
    </section>
  )
}