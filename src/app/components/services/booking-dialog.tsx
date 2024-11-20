'use client'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from '@/hooks/use-toast'

import { createBooking, updateBookingPaymentStatus } from "@/lib/actions/booking"
import { StripePaymentForm } from "../payments/stripe-payment-form"
import { BookingDialogProps, SlotType,SelectedService } from '@/types'
import { getScheduledDate } from '@/utils/date'
import { useRouter } from 'next/router'
import { useAuthPatient } from '@/hooks/use-auth-patient'
import { Loader2 } from 'lucide-react'


export function BookingDialog({ doctor, isOpen, onClose }: BookingDialogProps) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuthPatient();
    
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
  const [selectedSlot, setSelectedSlot] = useState<SlotType | null>(null)
  const[bookingId,setBookingId]= useState("");
  const [paymentStep, setPaymentStep] = useState<'selection' | 'payment'>(
    'selection'
  )
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card')
  const [clientSecret, setClientSecret] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const totalAmount = selectedServices.reduce((sum, service) => sum + service.price, 0)


  useEffect(() => {
    if (!isLoading && isOpen && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book an appointment",
        variant: "destructive"
      });
      onClose();
      // Store the current URL to redirect back after login
      const returnUrl = encodeURIComponent(window.location.pathname);
      router.push(`/login?returnUrl=${returnUrl}`);
    }
  }, [isLoading, isOpen, isAuthenticated, router, onClose]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  const handlePaymentMethodSelect = (method: 'card' | 'cash') => {
    setPaymentMethod(method)
  }

  const handleProceedToPayment = async () => {
    if (!selectedSlot || selectedServices.length === 0 || !user) return;

    setIsProcessing(true);
    try {
      // Create booking first
      const bookingResponse = await createBooking({
        patientId: user.id,
        doctorId: doctor.id,
        homeServiceId: doctor.Services?.homeService?.id!,
        selectedServices,
        slot: {
          dayOfWeek: selectedSlot.dayOfWeek,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          date: getScheduledDate(selectedSlot.dayOfWeek)
        },
        paymentMethod,
        patientDetails: {
          name: user.name,
          address: user.address,
          phone: user.phone
        }
      });

      setBookingId(bookingResponse.booking.id);

      if (paymentMethod === 'card') {
        // Create payment intent after booking is created
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
        setPaymentStep('payment'); // Set payment step here
      } else {
        // For cash payment
        await updateBookingPaymentStatus({
          bookingId: bookingResponse.booking.id,
          paymentMethod: 'cash'
        });

        toast({
          title: "Booking Confirmed",
          description: "Your appointment has been booked successfully. Payment will be collected at the time of service."
        });
        router.push('/');
        onClose();
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
    console.log("Payment success handler called", bookingId);
    if (!bookingId) {
      console.error("No booking ID found");
      return;
    }

    try {
      await updateBookingPaymentStatus({
        bookingId,
        stripePaymentId: clientSecret?.split('_secret')[0],
        paymentMethod: 'card'
      });

      toast({
        title: "Booking Confirmed",
        description: "Your appointment has been booked and payment has been processed successfully."
      });
      router.push('/');
      onClose();
    } catch (error) {
      console.error("Payment status update error:", error);
      toast({
        title: "Error",
        description: "Payment was successful but failed to update booking status. Our team will verify manually.",
        variant: "destructive"
      });
    }
  };
  
  
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        {paymentStep === 'selection' ? (
          <>
            <DialogHeader>
              <DialogTitle>Book Appointment with {doctor.title} {doctor.name}</DialogTitle>  
            </DialogHeader>

            
            <div className="border-t pt-4 mt-4 space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Select Payment Method</h3>
                <div className="flex gap-4">
                  <Button 
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    onClick={() => handlePaymentMethodSelect('card')}
                  >
                    Pay with Card
                  </Button>
                  <Button
                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                    onClick={() => handlePaymentMethodSelect('cash')}
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
                name: user.name,
                address: user.address || "",
                phone: user.phone
              }}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
  }

