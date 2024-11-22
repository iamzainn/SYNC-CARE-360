'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { format } from 'date-fns'
import { Check, Clock } from "lucide-react"
import { DoctorWithServices } from '@/types'
import { DayOfWeek, SpecializationType } from '@prisma/client'
import { useToast } from '@/hooks/use-toast'
import { useAuthPatient } from '@/hooks/use-auth-patient'
import { getScheduledDate } from '@/utils/date'
import { createBooking, updateBookingPaymentStatus } from '@/lib/actions/booking'
import { StripePaymentForm } from '@/app/components/payments/stripe-payment-form'
import { useRouter } from 'next/navigation'


interface BookingDialogProps {
  doctor: DoctorWithServices
  isOpen: boolean
  onClose: () => void
}

interface SelectedService {
  type: SpecializationType
  price: number
}

export function BookingDialog({ doctor, isOpen, onClose }: BookingDialogProps) {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
  const [selectedSlot, setSelectedSlot] = useState<{
    id: string,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string
  } | null>(null)
  const { user, isAuthenticated, isLoading } = useAuthPatient();
  const { toast } = useToast();
  const router = useRouter();


  function SlotButton({ slot, currentDay, isSelected, onSelect }: {
    slot: any;
    currentDay: DayOfWeek;
    isSelected: boolean;
    onSelect: (slot: any) => void;
  }) {
    const [hours, minutes] = slot.startTime.split(':').map(Number);
    const currentHour = new Date().getHours();
    const currentMinutes = new Date().getMinutes();
    const todayDay = format(new Date(), 'EEEE').toUpperCase();
    
   
    const isPassed = todayDay === slot.dayOfWeek && 
      (hours < currentHour || (hours === currentHour && minutes <= currentMinutes));
  
    const tooltip = isPassed ? "This time slot has passed" : "Available for booking";
  
    return (
      <div className="relative group">
        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          disabled={isPassed}
          onClick={() => onSelect(slot)}
          className={cn(
            "gap-2",
            isPassed && "opacity-50 bg-gray-100",
            isSelected && "bg-blue-600 text-white hover:bg-blue-700"
          )}
        >
          <Clock className="h-3 w-3" />
          {slot.startTime} - {slot.endTime}
        </Button>
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {tooltip}
        </span>
      </div>
    );
  }
  
  const ALL_DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;

  const [paymentStep, setPaymentStep] = useState<'selection' | 'payment'>('selection')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card')
  const [clientSecret, setClientSecret] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingId, setbookingId] = useState<string>('')


  const handleProceedToPayment = async () => {
    if (!selectedSlot || selectedServices.length === 0 || !user) {
      toast({
        title: "Error in booking home service slot",
        description: "Please select services and time slot or need patient login",
        variant: "destructive"
      });
      return;
    }
  
    setIsProcessing(true);
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
        paymentMethod: paymentMethod,
        patientDetails: {
          name: user.name || "",
          address: user.address || "",
          phone: user.phone || ""
        }
      };
  
      console.log('Booking Data:', bookingData); // Add this for debugging
  
      const bookingResponse = await createBooking(bookingData);

      // console.log("booking response : ",bookingResponse.booking.id)
      setbookingId(bookingResponse.booking.id)
  

      if (paymentMethod === 'cash') {
        toast({
          title: "Booking Confirmed",
          description: "Your appointment has been booked successfully. Payment will be collected at the time of service."
        });
        router.push(`/`);
        onClose();
      } else {
        // For card payment, get client secret
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount: totalAmount,
            bookingId: bookingResponse.booking.id 
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

       
         
        
        
        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
        setPaymentStep('payment');
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      if (!bookingId || !clientSecret) {
        throw new Error("Missing booking information");
      }
  
      const stripePaymentId = clientSecret.split('_secret')[0];
      
      const result = await updateBookingPaymentStatus({
        bookingId,
        stripePaymentId,
        paymentMethod: paymentMethod
      });

      console.log("result : ",result)
  
      if (!result.success) {
        throw new Error("Failed to update booking status");
      }
  
      toast({
        title: "Booking Confirmed",
        description: "Your appointment has been booked and payment processed successfully."
      });
      router.push('/');
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Payment status update failed"
      });
      console.error(error);
    }
  };


  const isSlotSelected = (day: DayOfWeek, startTime: string, endTime: string) => {
    return selectedSlot?.dayOfWeek === day && 
           selectedSlot?.startTime === startTime && 
           selectedSlot?.endTime === endTime
  }

  const homeService = doctor.Services?.homeService
  const currentHour = new Date().getHours()
  const currentMinutes = new Date().getMinutes()
  const currentDay = format(new Date(), 'EEEE').toUpperCase() as DayOfWeek

 

  const handleServiceToggle = (service: SelectedService) => {
    setSelectedServices(prev => {
      const exists = prev.some(s => s.type === service.type)
      if (exists) {
        return prev.filter(s => s.type !== service.type)
      }
      return [...prev, service]
    })
  }

  const totalAmount = selectedServices.reduce((sum, service) => sum + service.price, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        {paymentStep === 'selection' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Book Appointment with {doctor.title} {doctor.name}
              </DialogTitle>
              {/* <p className="text-muted-foreground">{doctor.specialization}</p> */}
            </DialogHeader>

            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* Services Selection */}
          <div>
            <h3 className="font-semibold mb-3">Select Services</h3>
            <ScrollArea className="h-[200px] rounded-md border p-4">
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

          {/* Time Slots Selection */}
          <div>
            <h3 className="font-semibold mb-3">Select Time Slot</h3>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
              {ALL_DAYS.map((day) => {
  const daySlots = homeService?.slots.filter(slot => {
   
    return slot.dayOfWeek === day;
  }) || [];
  
  // console.log(`${day} slots:`, daySlots);

  return (
    <div key={day} className="space-y-2">
      <h4 className="text-sm font-medium">
        {day.charAt(0) + day.slice(1).toLowerCase()}
      </h4>
      <div className="flex">
        {daySlots.map((slot) => (
          <SlotButton
            key={`${slot.dayOfWeek}-${slot.startTime}`}
            slot={slot}
            currentDay={currentDay}
            isSelected={isSlotSelected(slot.dayOfWeek, slot.startTime, slot.endTime)}
            onSelect={setSelectedSlot}
          />
        ))}
      </div>
    </div>
  );
})}
              </div>
            </ScrollArea>
          </div>
        </div>

            {/* Updated Booking Summary with Payment Method */}
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
