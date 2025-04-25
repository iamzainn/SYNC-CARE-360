// components/services/treatment-request-form.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { createTreatmentRequest, CreateTreatmentRequestParams, updateTreatmentPaymentStatus } from "@/lib/actions/treatment"
import { DoctorList } from "./doctor-list"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TimeSlotsGrid } from "@/components/slots/TimeSlotsGrid"
import { format, addDays, startOfToday } from "date-fns"

import { ArrowLeft } from "lucide-react"
import { StripePaymentForm } from "@/app/components/payments/stripe-payment-form"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { DayOfWeek } from "@prisma/client"
import { useAuthPatient } from "@/hooks/use-auth-patient"
import { getDoctorById } from "@/lib/actions/doctorFortreatment"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"



export function TreatmentRequestForm() {
  const [step, setStep] = useState(1)
  const [selectedDoctor, setSelectedDoctor] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
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

  // Add new state for medical records
  const [hasMedicalRecord, setHasMedicalRecord] = useState(false)
  const [medicalRecordId, setMedicalRecordId] = useState<string | null>(null)
  const [medicalRecords, setMedicalRecords] = useState<any[]>([])

  // Add a new state for loading medical records
  const [isCheckingRecords, setIsCheckingRecords] = useState(true)

  const { toast } = useToast()
  const router = useRouter()
  const { user, isAuthenticated } = useAuthPatient()

  // Generate dates for the week
  const dates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))

  // Check for medical records when component mounts
  useEffect(() => {
    async function checkMedicalRecords() {
      if (!user?.id) {
        setIsCheckingRecords(false)
        return
      }
      
      setIsCheckingRecords(true)
      try {
        const response = await fetch(`/api/patient/medical-records?patientId=${user.id}`)
        const data = await response.json()
        
        if (data.success && data.records?.length > 0) {
          setHasMedicalRecord(true)
          setMedicalRecords(data.records) // Store all records
          setMedicalRecordId(null) // Reset selection
        } else {
          setHasMedicalRecord(false)
          setMedicalRecordId(null)
          setMedicalRecords([])
        }
      } catch (error) {
        console.error("Error checking medical records:", error)
        setHasMedicalRecord(false)
      } finally {
        setIsCheckingRecords(false)
      }
    }
    
    checkMedicalRecords()
  }, [user])

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
      
      if (!medicalRecordId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a medical record to share with the doctor"
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
        patientMedicalRecordId: medicalRecordId,
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

      const result = await createTreatmentRequest(treatmentData as CreateTreatmentRequestParams)

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

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="p-6">
        <div className="space-y-8">
          {/* Step 1: Medical Records Check */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Step 1: Medical Records</h3>
              
              {/* Medical Records Section */}
              <div className="p-6 border rounded-md bg-gray-50">
                <h4 className="font-medium mb-3 text-xl">Your Medical Records</h4>
                <p className="text-muted-foreground mb-6">
                  Your medical records will be sent to the doctor with your specialized treatment request.
                  This helps doctors better understand your medical history and provide appropriate care.
                </p>
                
                {isCheckingRecords ? (
                  <div className="flex flex-col items-center justify-center p-8">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
                    <p className="text-muted-foreground">Loading your medical records...</p>
                  </div>
                ) : hasMedicalRecord ? (
                  <div className="p-5 bg-white rounded-md border border-green-100">
                    <div>
                      <p className="text-green-700 font-medium text-lg mb-4">Select a medical record to share</p>
                      
                      <RadioGroup 
                        value={medicalRecordId || ''} 
                        onValueChange={setMedicalRecordId}
                        className="space-y-4"
                      >
                        {medicalRecords.map((record) => (
                          <div key={record.id} className="flex items-start space-x-3 p-3 border rounded-md hover:bg-gray-50">
                            <RadioGroupItem value={record.id} id={record.id} />
                            <div className="grid gap-1">
                              <Label htmlFor={record.id} className="font-medium">
                                {record.firstName} {record.lastName}
                              </Label>
                              <div className="text-sm text-muted-foreground">
                                <p>Created: {new Date(record.createdAt).toLocaleDateString()}</p>
                                <p className="mt-1">
                                  Conditions: {record.medicalConditions?.join(', ') || 'None'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                      
                      <div className="flex gap-3 mt-6 justify-end">
                        <Button 
                          variant="outline" 
                          onClick={() => router.push('/Services/DataManagement')}
                        >
                          Create New Record
                        </Button>
                        <Button 
                          onClick={() => setStep(2)}
                          disabled={!medicalRecordId}
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 border border-amber-100 rounded-md bg-amber-50">
                    <p className="mb-3 text-amber-800 font-medium">
                      You need to complete your medical records before requesting specialized treatment.
                    </p>
                    <Button 
                      onClick={() => router.push('/Services/DataManagement')}
                      className="mt-2"
                    >
                      Complete Medical Records
                    </Button>
                  </div>
                )}
              </div>
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

