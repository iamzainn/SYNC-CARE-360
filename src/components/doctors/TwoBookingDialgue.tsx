"use client";

import { useState, useCallback } from "react";
import { format, addDays, startOfToday } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

import { TimeSlotsGrid } from "@/components/slots/TimeSlotsGrid";
import { useToast } from "@/hooks/use-toast";
import { useAuthPatient } from "@/hooks/use-auth-patient";
import { AppointmentType, VisitType } from "@prisma/client";
import {
  createOnlineBooking,
  updateOnlinePaymentStatus,
} from "@/lib/actions/online-booking";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { DoctorWithDetails } from "@/lib/actions/doctor2";
import { StripePaymentForm } from "@/app/components/payments/stripe-payment-form";

interface OnlineBookingDialogProps {
  doctor: DoctorWithDetails;
  isOpen: boolean;
  onClose: () => void;
}

type BookingStep =
  | "slot_selection"
  | "appointment_details"
  | "payment"
  | "confirmation";

export function OnlineBookingDialog({
  doctor,
  isOpen,
  onClose,
}: OnlineBookingDialogProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>("slot_selection");
  const [startDate, setStartDate] = useState(startOfToday());
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [appointmentType, setAppointmentType] = useState<AppointmentType>(
    AppointmentType.GENERAL_CHECKUP
  );
  const [visitType, setVisitType] = useState<VisitType>(VisitType.FIRST_TIME);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [appointmentId, setAppointmentId] = useState("");

  const { user } = useAuthPatient();
  const { toast } = useToast();
  const router = useRouter();

  const dates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const handlePrevWeek = () => setStartDate((prev) => addDays(prev, -7));
  const handleNextWeek = () => setStartDate((prev) => addDays(prev, 7));

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleContinueToDetails = () => {
    if (!selectedSlot) {
      toast({
        title: "Select Time Slot",
        description: "Please select an available time slot to continue",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep("appointment_details");
  };

  const handleProceedToPayment = async () => {
    if (!user || !selectedSlot) {
      toast({
        title: "Cannot Proceed",
        description:
          "Please ensure you're logged in and have selected a time slot",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // First create the appointment
      const bookingResponse = await createOnlineBooking({
        patientId: user.id,
        doctorId: doctor.id,
        onlineServiceId: doctor.onlineService!.id,
        slot: {
          id: selectedSlot.id,
          dayOfWeek: selectedSlot.dayOfWeek,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          date: selectedDate,
        },
        appointmentType,
        visitType,
        amount: doctor.onlineService!.fee,
      });

      // Store the appointment ID
      setAppointmentId(bookingResponse.appointment.id);

      // Create payment intent using the dedicated online payment endpoint
      const paymentResponse = await fetch("/api/online-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: doctor.onlineService!.fee,
          appointmentId: bookingResponse.appointment.id,
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await paymentResponse.json();

      if (!clientSecret) {
        throw new Error("No client secret received");
      }

      setClientSecret(clientSecret);
      setCurrentStep("payment");
    } catch (error) {
      console.error("Payment setup error:", error);
      toast({
        title: "Payment Setup Failed",
        description:
          error instanceof Error ? error.message : "Failed to setup payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      if (!appointmentId || !clientSecret) {
        throw new Error("Missing booking information");
      }

      const stripePaymentId = clientSecret.split("_secret")[0];

      const result = await updateOnlinePaymentStatus({
        appointmentId,
        stripePaymentId,
      });

      if (!result.success) {
        throw new Error("Failed to update appointment status");
      }

      toast({
        title: "Booking Confirmed",
        description:
          "Your online consultation has been booked and payment processed successfully.",
      });
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Payment confirmation error:", error);
      toast({
        title: "Payment Error",
        description:
          "Payment was processed but booking confirmation failed. Please contact support.",
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "slot_selection":
        return (
          <>
            {/* Date Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevWeek}
                  disabled={startDate <= startOfToday()}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous Week
                </Button>
                <div className="font-medium">
                  {format(dates[0], "MMM d")} -{" "}
                  {format(dates[6], "MMM d, yyyy")}
                </div>
                <Button variant="outline" size="sm" onClick={handleNextWeek}>
                  Next Week
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {dates.map((date) => (
                  <Button
                    key={date.toISOString()}
                    variant={
                      selectedDate.toDateString() === date.toDateString()
                        ? "default"
                        : "outline"
                    }
                    className={cn(
                      "flex flex-col h-auto py-2",
                      selectedDate.toDateString() === date.toDateString() &&
                        "border-2 border-primary"
                    )}
                    onClick={() => handleDateSelect(date)}
                    disabled={date < startOfToday()}
                  >
                    <span className="text-sm font-normal">
                      {format(date, "EEE")}
                    </span>
                    <span className="text-lg font-semibold">
                      {format(date, "d")}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="mt-6">
              <TimeSlotsGrid
                slots={doctor.onlineService?.slots || []}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onSlotSelect={setSelectedSlot}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleContinueToDetails}
                disabled={!selectedSlot}
              >
                Continue
              </Button>
            </div>
          </>
        );

      case "appointment_details":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Consultation Type</h3>
                <Select
                  value={appointmentType}
                  onValueChange={(value) =>
                    setAppointmentType(value as AppointmentType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AppointmentType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-medium mb-2">Visit Type</h3>
                <Select
                  value={visitType}
                  onValueChange={(value) => setVisitType(value as VisitType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(VisitType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 space-y-3">
              <h3 className="font-medium">Appointment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{format(selectedDate, "MMMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>
                    {selectedSlot?.startTime} - {selectedSlot?.endTime}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Consultation Fee:</span>
                  <span>Rs. {doctor.onlineService?.fee}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("slot_selection")}
              >
                Back
              </Button>
              <Button onClick={handleProceedToPayment} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Proceed to Payment"}
              </Button>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-6">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Amount to Pay:</span>
                <span className="text-lg font-bold">
                  Rs. {doctor.onlineService?.fee}
                </span>
              </div>
            </div>

            <StripePaymentForm
              clientSecret={clientSecret}
              amount={doctor.onlineService?.fee || 0}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setCurrentStep("appointment_details")}
              orderDetails={{
                name: user?.name || "",
                address: user?.address || "",
                phone: user?.phone || "",
                 // Add this to differentiate payment type
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={doctor.verification?.profilePhoto} />
              <AvatarFallback>
                {doctor.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl">
                Book Online Consultation with Dr. {doctor.name}
              </DialogTitle>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-muted-foreground">
                  {doctor.verification?.specialization[0]}
                </span>
                <Badge variant="outline" className="font-semibold">
                  Rs. {doctor.onlineService?.fee}
                </Badge>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Steps Indicator */}
          <div className="flex items-center justify-center gap-2">
            {["Select Time", "Details", "Payment"].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm",
                    index <= getStepNumber(currentStep)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  {index + 1}
                </div>
                {index < 2 && (
                  <div
                    className={cn(
                      "w-12 h-1 mx-2",
                      index < getStepNumber(currentStep)
                        ? "bg-primary"
                        : "bg-gray-100"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="mt-6">{renderStepContent()}</div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to get step number
function getStepNumber(step: BookingStep): number {
  switch (step) {
    case "slot_selection":
      return 0;
    case "appointment_details":
      return 1;
    case "payment":
      return 2;
    default:
      return 0;
  }
}
