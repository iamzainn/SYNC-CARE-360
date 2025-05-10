// components/services/treatment-request-form.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { createTreatmentRequest, CreateTreatmentRequestParams } from "@/lib/actions/treatment"
import { NurseList } from "./nurse-list"
import { TimeSlotsGrid } from "@/components/slots/TimeSlotsGrid"
import { format, addDays, startOfToday } from "date-fns"

import { ArrowLeft, X, Info } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { DayOfWeek } from "@prisma/client"
import { useAuthPatient } from "@/hooks/use-auth-patient"
import { getNurseById } from "@/lib/actions/nurseForTreatment"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form, FormDescription } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { NURSING_SERVICES } from "@/lib/constants/nursing-services"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define the form schema for patient details
const patientDetailsSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  contactNumber: z.string().min(10, { message: "Valid contact number is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  issueDetails: z.string().min(5, { message: "Please describe when the issue started" }),
  medicalCondition: z.string().min(5, { message: "Brief medical condition details are required" }),
  numberOfDays: z.coerce.number().min(1, { message: "At least 1 day is required" }).max(30, { message: "Maximum 30 days allowed" }),
  requiredServices: z.array(z.string()).min(1, { message: "Please select at least one service" }),
})

type PatientDetailsFormValues = z.infer<typeof patientDetailsSchema>

export function TreatmentRequestForm() {
  const [step, setStep] = useState(1)
  const [selectedNurse, setSelectedNurse] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [patientDetails, setPatientDetails] = useState<PatientDetailsFormValues | null>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  
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
  
  // Using only cash payment
  const [treatmentAmount, setTreatmentAmount] = useState(1500) // Default amount
  const [numberOfDays, setNumberOfDays] = useState(1) // Store number of days
  const [selectedServicePrices, setSelectedServicePrices] = useState<Record<string, number>>({})

  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuthPatient()

  // Form setup
  const form = useForm<PatientDetailsFormValues>({
    resolver: zodResolver(patientDetailsSchema),
    defaultValues: {
      fullName: user?.name || "",
      contactNumber: user?.phone || "",
      address: "",
      issueDetails: "",
      medicalCondition: "",
      numberOfDays: 1,
      requiredServices: [],
    },
  })

  // Generate dates for the week
  const dates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))

  // Update form when user data is available
  useEffect(() => {
    if (user) {
      form.setValue("fullName", user.name || "")
      form.setValue("contactNumber", user.phone || "")
    }
  }, [user, form])

  // Update selected services when form values change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'requiredServices') {
        setSelectedServices(value.requiredServices as string[] || [])
      }
    })
    
    return () => subscription.unsubscribe()
  }, [form.watch])

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

  const onSubmitPatientDetails = (data: PatientDetailsFormValues) => {
    setPatientDetails(data)
    setNumberOfDays(data.numberOfDays)
    setSelectedServices(data.requiredServices)
    setStep(2)
  }

  // Toggle a service selection
  const toggleService = (service: string) => {
    const currentServices = form.getValues("requiredServices")
    
    if (currentServices.includes(service)) {
      form.setValue(
        "requiredServices", 
        currentServices.filter(s => s !== service),
        { shouldValidate: true }
      )
    } else {
      form.setValue(
        "requiredServices", 
        [...currentServices, service],
        { shouldValidate: true }
      )
    }
  }

  // Calculate total treatment amount based on selected services and nurse prices
  const calculateTotalAmount = () => {
    let total = 0
    
    if (selectedNurse && selectedServices.length > 0) {
      // Sum the prices of all selected services for this nurse
      selectedServices.forEach(service => {
        total += selectedServicePrices[service] || 0
      })
    }
    
    // Multiply by number of days
    total = total * (patientDetails?.numberOfDays || 1)
    
    // Add service charge
    total += 500 // Fixed service charge
    
    return total
  }

  // Simplified treatment request submission
  const handleSubmitRequest = async () => {
    try {
      setIsLoading(true)
      
      if (!patientDetails) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please complete patient details first"
        })
        return
      }

      if (!selectedNurse) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a nurse"
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

      const totalAmount = calculateTotalAmount()

      // Update the treatment request with specialized services
      const treatmentData = {
        nurseId: selectedNurse,
        patientDetails: {
          ...patientDetails,
          requiredServices: selectedServices
        },
        slot: {
          id: selectedSlot.id,
          dayOfWeek: selectedSlot.dayOfWeek,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          date: getScheduledDate(selectedSlot.dayOfWeek)
        },
        paymentMethod: "cash", // Set to cash only
        amount: treatmentAmount,
        serviceCharge: 500, // Fixed service charge
        totalAmount,
        numberOfDays: patientDetails.numberOfDays,
        servicePrices: selectedServicePrices
      }

      console.log(treatmentData)

      const result = await createTreatmentRequest(treatmentData as CreateTreatmentRequestParams)

      if (result.requiresAuth) {
        const returnUrl = encodeURIComponent(window.location.pathname)
        router.push(`/patient/auth?callbackUrl=${returnUrl}`)
        return
      }

      if (!result.success) {
        throw new Error(result.error)
      }

      // Show success message and redirect to home
      toast({
        title: "Request Submitted",
        description: "Your treatment request has been submitted successfully."
      })
      router.push('/')
      
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

  // Initialize nurse slots
  const [nurseSlots, setNurseSlots] = useState<any[]>([])

  // When selecting a nurse
  const handleNurseSelect = async (nurseId: string, servicePrices: Record<string, number>) => {
    setSelectedNurse(nurseId)
    setSelectedServicePrices(servicePrices)
    
    // Filter out services that this nurse doesn't offer
    const availableServices = Object.keys(servicePrices)
    
    if (availableServices.length < selectedServices.length) {
      toast({
        title: "Notice",
        description: `This nurse offers ${availableServices.length} of your ${selectedServices.length} selected services.`,
        variant: "default"
      })
    }
    
    try {
      const response = await getNurseById(nurseId)
      
      if (response.success && response.data) {
        console.log("Nurse slots:", response.data.slots) // Debugging
        setNurseSlots(response.data.slots || []) // Ensure we default to empty array
      } else {
        setNurseSlots([])
      }
    } catch (error) {
      console.error("Error fetching nurse slots:", error)
      setNurseSlots([])
    }
  }

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="p-6">
        <div className="space-y-8">
          {/* Step 1: Patient Details Form */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Step 1: Patient Details</h3>
              
              <div className="p-6 border rounded-md bg-gray-50">
                <h4 className="font-medium mb-3 text-xl">Patient Information</h4>
                <p className="text-muted-foreground mb-6">
                  Please provide the necessary details for your specialized treatment request.
                  This information will help nurses provide appropriate care.
                </p>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitPatientDetails)} className="space-y-4">
                    {/* Required Nursing Services */}
                    <div className="space-y-3">
                      <Alert variant="default" className="bg-blue-50 border-blue-200">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Multiple Services</AlertTitle>
                        <AlertDescription>
                          You can select multiple specialized nursing services that you require.
                        </AlertDescription>
                      </Alert>
                      
                      <FormField
                        control={form.control}
                        name="requiredServices"
                        render={() => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Required Nursing Services*</FormLabel>
                            <FormDescription>
                              Select the specialized nursing services you need
                            </FormDescription>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                              {NURSING_SERVICES.map((service) => (
                                <div key={service} className="flex items-start space-x-2">
                                  <Checkbox
                                    id={`service-${service}`}
                                    checked={form.watch("requiredServices").includes(service)}
                                    onCheckedChange={() => toggleService(service)}
                                  />
                                  <label
                                    htmlFor={`service-${service}`}
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    {service}
                                  </label>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3">
                              <FormLabel className="text-sm font-medium">Selected Services:</FormLabel>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {form.watch("requiredServices").length > 0 ? (
                                  form.watch("requiredServices").map((service) => (
                                    <Badge key={service} variant="secondary" className="flex items-center gap-1">
                                      {service}
                                      <button 
                                        type="button" 
                                        onClick={() => toggleService(service)}
                                        className="text-muted-foreground hover:text-foreground"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-sm text-muted-foreground">No services selected</span>
                                )}
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name*</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    
                      <FormField
                        control={form.control}
                        name="contactNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Number*</FormLabel>
                            <FormControl>
                              <Input placeholder="Your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="numberOfDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Days*</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Number of days required" 
                              min="1" 
                              max="30" 
                              {...field} 
                            />
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
                          <FormLabel>Home Address*</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Your complete home address for the treatment" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="issueDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>When did the issue start?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Briefly describe when the issue started" 
                              className="resize-none" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="medicalCondition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brief Medical Condition*</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Briefly describe your medical condition and requirements" 
                              className="resize-none" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4 flex justify-end">
                      <Button type="submit">
                        Continue to Select Nurse
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          )}

          {/* Step 2: Nurse Selection & Slot Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Step 2: Select Nurse & Appointment</h3>
              
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4" />
                <AlertTitle>Selected Services</AlertTitle>
                <AlertDescription className="flex flex-wrap gap-1 mt-1">
                  {selectedServices.map((service) => (
                    <Badge key={service} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </AlertDescription>
              </Alert>
              
              <ScrollArea className="h-[350px] rounded-md border p-4">
                <div className="space-y-4">
                  <NurseList
                    selectedNurse={selectedNurse}
                    requiredServices={selectedServices}
                    onSelect={handleNurseSelect}
                  />
                </div>
              </ScrollArea>
              
              {selectedNurse && (
                <>
                  <Separator />
                  
                  {/* Date Selection */}
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

                  {/* Time Slots */}
                  <div>
                    <h3 className="font-semibold mb-3">Select Time Slot</h3>
                    <ScrollArea className="h-auto">
                      <TimeSlotsGrid
                        slots={nurseSlots || []}
                        selectedDate={selectedDate}
                        selectedSlot={selectedSlot}
                        onSlotSelect={setSelectedSlot}
                      />
                    </ScrollArea>
                  </div>
                  
                  {/* Payment Information */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Payment Information</h3>
                    <p className="text-muted-foreground">Payment will be collected in cash during treatment.</p>
                  </div>

                  {/* Price Summary */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Services Breakdown:</h4>
                      {selectedServices.map(service => (
                        <div key={service} className="flex justify-between items-center text-sm">
                          <span>{service}</span>
                          <span>Rs. {selectedServicePrices[service] || 0}</span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span>Number of Days:</span>
                      <span>{patientDetails?.numberOfDays}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Service Fee:</span>
                      <span>Rs. {Object.values(selectedServicePrices).reduce((sum, price) => sum + price, 0) * (patientDetails?.numberOfDays || 1)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Service Charge:</span>
                      <span>Rs. 500</span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                      <span>Total Amount:</span>
                      <span>Rs. {calculateTotalAmount()}</span>
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
                  disabled={!selectedNurse || !selectedSlot || isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </section>
  )
}



