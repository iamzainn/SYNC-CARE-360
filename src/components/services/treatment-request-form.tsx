// components/services/treatment-request-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadDropzone } from "@/utils/uploadthing"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { createTreatmentRequest, updateTreatmentPaymentStatus } from "@/lib/actions/treatment"
import { DoctorList } from "./doctor-list"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TimeSlotsGrid } from "@/components/slots/TimeSlotsGrid"
import { format, addDays, startOfToday } from "date-fns"

import { ArrowLeft, Check } from "lucide-react"
import { StripePaymentForm } from "@/app/components/payments/stripe-payment-form"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { DayOfWeek } from "@prisma/client"
import { useAuthPatient } from "@/hooks/use-auth-patient"
import { getDoctorById } from "@/lib/actions/doctorFortreatment"



export function TreatmentRequestForm() {
  const [step, setStep] = useState(1)
  const [prescriptionUrl, setPrescriptionUrl] = useState("")
  const [treatmentDetails, setTreatmentDetails] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)
  const [selectedSlots, setSelectedSlots] = useState<any[]>([])
  
  // Add new states for slot booking
  const [startDate, setStartDate] = useState(startOfToday())
  const [selectedDate, setSelectedDate] = useState(startOfToday())
  const [selectedSlot, setSelectedSlot] = useState<{
    id: string,
    dayOfWeek: DayOfWeek | string,
    startTime: string,
    endTime: string,
    isReserved: boolean
  } | null>(null)
  
  // Add states for payment
  const [paymentStep, setPaymentStep] = useState<'selection' | 'payment'>('selection')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card')
  const [clientSecret, setClientSecret] = useState<string>('')
  const [treatmentAmount, setTreatmentAmount] = useState(1500) // Default amount
  const [treatmentId, setTreatmentId] = useState<string>('')

  const { toast } = useToast()
  const router = useRouter()
  const { user, isAuthenticated } = useAuthPatient()

  // Generate dates for the week
  const dates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedSlot(null) 
  }

  const handlePrevWeek = () => {
    setStartDate(prev => addDays(prev, -7))
  }

  const handleNextWeek = () => {
    setStartDate(prev => addDays(prev, 7))
  }

  // Modified to include slot and payment handling
  const handleSubmitRequest = async () => {
    try {
      setIsLoading(true)
      
      if (!prescriptionUrl && !treatmentDetails) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please either upload a prescription or describe your treatment needs"
        })
        return
      }

      if (!selectedDoctor) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a doctor"
        })
        return
      }

      if (!selectedSlot) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select an appointment slot"
        })
        return
      }

      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login to continue",
          variant: "destructive"
        })
        router.push(`/patient/auth/?callbackUrl=${encodeURIComponent(window.location.href)}`)
        return
      }

      const treatmentData = {
        doctorId: selectedDoctor,
        prescriptionUrl,
        treatmentDetails,
        slot: {
          id: selectedSlot.id,
          dayOfWeek: selectedSlot.dayOfWeek,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          date: getScheduledDate(selectedSlot.dayOfWeek)
        },
        paymentMethod,
        amount: treatmentAmount,
        serviceCharge: 500, // Fixed service charge
        totalAmount: treatmentAmount + 500
      }

      const result = await createTreatmentRequest(treatmentData)

      if (result.requiresAuth) {
        const returnUrl = encodeURIComponent(window.location.pathname)
        router.push(`/patient/auth?callbackUrl=${returnUrl}`)
        return
      }

      if (!result.success) {
        throw new Error(result.error)
      }

      setTreatmentId(result.data?.id || '')

      if (paymentMethod === 'cash') {
        toast({
          title: "Request Submitted",
          description: "Your treatment request has been sent to the doctor. Payment will be collected during treatment."
        })
        router.push('/')
      } else {
        // Get payment intent for card payment
        const response = await fetch('/api/specialized/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount: treatmentAmount + 500,
            treatmentId: result.data?.id || '' 
          })
        })
        
        if (!response.ok) throw new Error('Failed to create payment intent')
        
        const { clientSecret } = await response.json()
        setClientSecret(clientSecret)
        setPaymentStep('payment')
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit request"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Function to get scheduled date based on day of week
  const getScheduledDate = (dayOfWeek: string | DayOfWeek) => {
    // Implementation similar to your home service booking
    const today = new Date()
    const daysMap: Record<string, number> = {
      'MONDAY': 1, 'TUESDAY': 2, 'WEDNESDAY': 3, 
      'THURSDAY': 4, 'FRIDAY': 5, 'SATURDAY': 6, 'SUNDAY': 0
    }
    
    const targetDay = daysMap[dayOfWeek as string]
    const currentDay = today.getDay()
    const daysToAdd = (targetDay + 7 - currentDay) % 7
    
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + daysToAdd
    )
  }

  const handlePaymentSuccess = async () => {
    try {
      if (!treatmentId || !clientSecret) {
        throw new Error("Missing treatment information")
      }
  
      const stripePaymentId = clientSecret.split('_secret')[0]
      
      // Update payment status
      const result = await updateTreatmentPaymentStatus({
        treatmentId,
        stripePaymentId,
        paymentMethod
      })
  
      if (!result.success) {
        throw new Error("Failed to update treatment status")
      }
  
      toast({
        title: "Request Confirmed",
        description: "Your treatment request has been submitted and payment processed successfully."
      })
      router.push('/')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Payment status update failed"
      })
    }
  }

  // Ensure slots are initialized properly and defaulted to an empty array
  const [doctorSlots, setDoctorSlots] = useState<any[]>([])

  // When selecting a doctor
  const handleDoctorSelect = async (doctorId: string) => {
    setSelectedDoctor(doctorId)
    
    try {
      const response = await getDoctorById(doctorId)
      
      if (response.success && response.data) {
        console.log("Doctor slots:", response.data.homeSlots) // Debugging
        setDoctorSlots(response.data.homeSlots || []) // Ensure we default to empty array
      } else {
        setDoctorSlots([])
      }
    } catch (error) {
      console.error("Error fetching doctor slots:", error)
      setDoctorSlots([])
    }
  }

  // In your treatment form, when handling payment with card:
  // const handlePayWithCard = async (treatmentData) => {
  //   try {
  //     // First create the treatment request
  //     const result = await createTreatmentRequest(treatmentData);
      
  //     if (!result.success) {
  //       throw new Error(result.error);
  //     }
      
  //     setTreatmentId(result.data?.id || '');
      
  //     // Then create payment intent
  //     const response = await fetch('/api/specialized/create-payment-intent', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ 
  //         amount: treatmentData.totalAmount,
  //         treatmentId: result.data.id 
  //       })
  //     });
      
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(`Failed to create payment intent: ${errorText}`);
  //     }
      
  //     const { clientSecret } = await response.json();
  //     setClientSecret(clientSecret);
  //     setPaymentStep('payment');
  //   } catch (error) {
  //     console.error("Payment error:", error);
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description: error instanceof Error ? error.message : "Failed to process payment"
  //     });
  //   }
  // }

  // Simplified version showing main changes
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="p-6">
        <div className="space-y-8">
          {/* Step 1: Treatment Details - Keep this part of the code */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Step 1: Treatment Details</h3>
              <Tabs defaultValue="upload">
                <TabsList>
                  <TabsTrigger value="upload">Upload Prescription</TabsTrigger>
                  <TabsTrigger value="describe">Describe Treatment</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                  <div className="mt-4">
                    {isUploaded ? (
                      // Show this when file is uploaded
                      <div className="p-4 border border-green-200 bg-green-50 rounded-md">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-700 font-medium">Prescription uploaded successfully!</p>
                            <p className="text-sm text-green-600">Your file has been uploaded and is ready for submission.</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setPrescriptionUrl("")
                              setIsUploaded(false)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]) {
                            setPrescriptionUrl(res[0].url)
                            setIsUploaded(true)
                            toast({
                              title: "Prescription Uploaded",
                              description: "Your prescription has been uploaded successfully"
                            })
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast({
                            variant: "destructive",
                            title: "Error",
                            description: error.message || "Failed to upload prescription"
                          })
                        }}
                      />
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="describe">
                  <div className="mt-4 space-y-2">
                    <Textarea
                      placeholder="Please describe the treatment you need..."
                      value={treatmentDetails}
                      onChange={(e) => setTreatmentDetails(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>
                </TabsContent>
              </Tabs>
              <Button
                onClick={() => setStep(2)}
                disabled={!prescriptionUrl && !treatmentDetails}
              >
                Next: Select Doctor
              </Button>
            </div>
          )}

          {/* Step 2: Doctor Selection, Slot Selection & Payment */}
          {step === 2 && (
            <div className="space-y-6">
              {paymentStep === 'selection' ? (
                <>
                  <h3 className="text-lg font-medium">Step 2: Select Doctor & Appointment</h3>
                  
                  <ScrollArea className="h-[250px] rounded-md border p-4">
                    <div className="space-y-4">
                      <DoctorList
                        selectedDoctor={selectedDoctor}
                        onSelect={handleDoctorSelect}
                      />
                    </div>
                  </ScrollArea>
                  
                  {selectedDoctor && (
                    <>
                      <Separator />
                      
                      {/* Date Selection - Similar to HomeServiceDialog */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Select Appointment Date</h3>
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrevWeek}
                            disabled={startDate <= startOfToday()}
                          >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Previous Week
                          </Button>
                          <div className="font-medium">
                            {format(dates[0], "MMM d")} - {format(dates[6], "MMM d, yyyy")}
                          </div>
                          <Button variant="outline" size="sm" onClick={handleNextWeek}>
                            Next Week
                            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                          {dates.map(date => (
                            <Button
                              key={date.toISOString()}
                              variant={selectedDate.toDateString() === date.toDateString() ? "default" : "outline"}
                              className={cn(
                                "flex flex-col h-auto py-2",
                                selectedDate.toDateString() === date.toDateString() && "border-2 border-primary"
                              )}
                              onClick={() => handleDateSelect(date)}
                              disabled={date < startOfToday()}
                            >
                              <span className="text-sm font-normal">{format(date, "EEE")}</span>
                              <span className="text-lg font-semibold">{format(date, "d")}</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Time Slots - Will need to fetch doctor's available slots */}
                      <div>
                        <h3 className="font-semibold mb-3">Select Time Slot</h3>
                        <ScrollArea className="h-auto">
                          <TimeSlotsGrid
                            slots={doctorSlots || []}
                            selectedDate={selectedDate}
                            selectedSlot={selectedSlot}
                            onSlotSelect={setSelectedSlot}
                          />
                        </ScrollArea>
                      </div>
                      
                      {/* Payment Selection */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Select Payment Method</h3>
                        <div className="flex gap-4">
                          <Button 
                            variant={paymentMethod === 'card' ? 'default' : 'outline'}
                            onClick={() => setPaymentMethod('card')}
                          >
                            Pay with Card
                          </Button>
                          <Button
                            variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                            onClick={() => setPaymentMethod('cash')}
                          >
                            Pay in Cash
                          </Button>
                        </div>
                      </div>

                      {/* Price Summary */}
                      <div className="space-y-2 border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span>Treatment Fee:</span>
                          <span>Rs. {treatmentAmount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Service Charge:</span>
                          <span>Rs. 500</span>
                        </div>
                        <div className="flex justify-between items-center font-bold">
                          <span>Total Amount:</span>
                          <span>Rs. {treatmentAmount + 500}</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmitRequest}
                      disabled={!selectedDoctor || !selectedSlot || isLoading}
                    >
                      {isLoading ? "Submitting..." : "Submit Request"}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Dialog>
                  <DialogHeader>
                    <DialogTitle>Complete Payment</DialogTitle>
                    <p className="text-muted-foreground">
                      Total Amount: Rs. {treatmentAmount + 500}
                    </p>
                  </DialogHeader>

                  <StripePaymentForm
                    clientSecret={clientSecret}
                    amount={treatmentAmount + 500}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setPaymentStep('selection')}
                    orderDetails={{
                      name: user?.name || "",
                      address: user?.address || "",
                      phone: user?.phone || ""
                    }}
                  />
                </Dialog>
                </>
              )}
            </div>
          )}
        </div>
      </Card>
    </section>
  )
}

// Doctor list component

