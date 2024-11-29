
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Check, Calendar, ArrowLeft } from "lucide-react"
import { DoctorWithServices } from '@/types'
import { DayOfWeek, SpecializationType } from '@prisma/client'
import { useToast } from '@/hooks/use-toast'
import { useAuthPatient } from '@/hooks/use-auth-patient'
import { getScheduledDate } from '@/utils/date'
import { createBooking, updateBookingPaymentStatus } from '@/lib/actions/booking'

import { useRouter } from 'next/navigation'
import { TimeSlotsGrid } from '@/components/slots/TimeSlotsGrid'
import { format, addDays, startOfToday } from 'date-fns'
import { StripePaymentForm } from '@/app/components/payments/stripe-payment-form'
import { TimeSlot } from '../slots/type'

interface HomeServiceDialogProps {
  doctor: DoctorWithServices
  isOpen: boolean
  onClose: () => void
}

interface SelectedService {
  type: SpecializationType
  price: number
}

export function HomeServiceDialog({ doctor, isOpen, onClose }: HomeServiceDialogProps) {
  // State for services
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
  
  // State for dates and slots
  const [startDate, setStartDate] = useState(startOfToday())
  const [selectedDate, setSelectedDate] = useState(startOfToday())
  const [selectedSlot, setSelectedSlot] = useState<{
    id: string,
    dayOfWeek: DayOfWeek | string,
    startTime: string,
    endTime: string
  } | null>(null)

  // State for payment
  const [paymentStep, setPaymentStep] = useState<'selection' | 'payment'>('selection')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card')
  const [clientSecret, setClientSecret] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingId, setBookingId] = useState<string>('')

  const { user, isAuthenticated } = useAuthPatient()
  const { toast } = useToast()
  const router = useRouter()

  // Generate dates for the week
  const dates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))

  const handleServiceToggle = (service: SelectedService) => {
    setSelectedServices(prev => {
      const exists = prev.some(s => s.type === service.type)
      if (exists) {
        return prev.filter(s => s.type !== service.type)
      }
      return [...prev, service]
    })
  }

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

  const handleProceedToPayment = async () => {
    if (!selectedSlot || selectedServices.length === 0) {
      toast({
        title: "Incomplete Selection",
        description: "Please select services and time slot. Login required.",
        variant: "destructive"
      })
      return
    }
    if(!user) {
      toast({
        title: "Login Required",
        description: "Please login to continue",
        variant: "destructive"
      })
      router.push(`/patient/auth/?callbackUrl=${encodeURIComponent(window.location.href)}`)

      return
    }

    setIsProcessing(true)
    try {
      const bookingData = {
        patientId: user.id,
        doctorId: doctor.id,
        homeServiceId: doctor.Services?.homeService?.id!,
        selectedServices: selectedServices.map(service => ({
          type: service.type,
          price: service.price
        })),
        slot: {
          id: selectedSlot.id,
          dayOfWeek: selectedSlot.dayOfWeek,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          date: getScheduledDate(selectedSlot.dayOfWeek)
        },
        paymentMethod,
        patientDetails: {
          name: user.name || "",
          address: user.address || "",
          phone: user.phone || ""
        }
      }

      const bookingResponse = await createBooking(bookingData)
      setBookingId(bookingResponse.booking.id)

      if (paymentMethod === 'cash') {
        toast({
          title: "Booking Confirmed",
          description: "Your appointment has been booked successfully. Payment will be collected during service."
        })
        router.push('/')
        onClose()
      } else {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount: totalAmount,
            bookingId: bookingResponse.booking.id 
          })
        })
        
        if (!response.ok) throw new Error('Failed to create payment intent')
        
        const { clientSecret } = await response.json()
        setClientSecret(clientSecret)
        setPaymentStep('payment')
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentSuccess = async () => {
    try {
      if (!bookingId || !clientSecret) {
        throw new Error("Missing booking information")
      }
  
      const stripePaymentId = clientSecret.split('_secret')[0]
      
      const result = await updateBookingPaymentStatus({
        bookingId,
        stripePaymentId,
        paymentMethod
      })
  
      if (!result.success) {
        throw new Error("Failed to update booking status")
      }
  
      toast({
        title: "Booking Confirmed",
        description: "Your appointment has been booked and payment processed successfully."
      })
      router.push('/')
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Payment status update failed"
      })
    }
  }

  const totalAmount = selectedServices.reduce((sum, service) => sum + service.price, 0)
  const homeService = doctor.Services?.homeService

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col">
        {paymentStep === 'selection' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Book Home Service with {doctor.title} {doctor.name}
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
              {/* Services Selection */}
              <div>
                <h3 className="font-semibold mb-3">Select Services</h3>
                <ScrollArea className="rounded-md border p-4">
                  <div className="space-y-2">
                    {homeService?.specializations.map((service) => (
                      <div
                        key={service.type}
                        onClick={() => handleServiceToggle(service)}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                          selectedServices.some(s => s.type === service.type)
                            ? "bg-blue-50 border-blue-200 border-2"
                            : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {selectedServices.some(s => s.type === service.type) && (
                            <Check className="h-4 w-4 text-blue-500" />
                          )}
                          <span>{service.type}</span>
                        </div>
                        <Badge variant="secondary">Rs. {service.price}</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <Separator />

              {/* Date Selection */}
              <div className="space-y-4">
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
                <ScrollArea className="h-[300px]">
                  <TimeSlotsGrid
                    slots={homeService?.slots || []}
                    selectedDate={selectedDate}
                    selectedSlot={selectedSlot as TimeSlot}
                    onSlotSelect={setSelectedSlot}
                  />
                </ScrollArea>
              </div>
            </div>

            {/* Booking Summary and Payment Selection */}
            <div className="border-t pt-4 mt-4 space-y-4">
              <div className="space-y-2">
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

              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount:</span>
                <span className="text-lg font-bold">Rs. {totalAmount}</span>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  className="flex-1" 
                  variant="outline"
                  onClick={onClose}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  disabled={selectedServices.length === 0 || !selectedSlot || isProcessing}
                  onClick={handleProceedToPayment}
                >
                  {isProcessing ? "Processing..." : "Proceed to Book"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Complete Payment</DialogTitle>
              <p className="text-muted-foreground">
                Total Amount: Rs. {totalAmount}
              </p>
            </DialogHeader>

            <StripePaymentForm
              clientSecret={clientSecret}
              amount={totalAmount}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setPaymentStep('selection')}
              orderDetails={{
                name: user?.name || "",
                address: user?.address || "",
                phone: user?.phone || ""
              }}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}