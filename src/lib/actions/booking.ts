'use server'
import { db } from "../db";
import { updateSlotStatus } from "./home-service";

interface CreateBookingParams {
  patientId: string;
  doctorId: string;
  homeServiceId: string;
  selectedServices: {
    type: string;  // Changed from SpecializationType to string as per schema
    price: number;
  }[];
  slot: {
    id: string;
    dayOfWeek: string;  // Changed from DayOfWeek enum to string as per schema
    startTime: string;
    endTime: string;
    date: Date;
  };
  paymentMethod: string;
  patientDetails: {
    name: string;
    address: string;
    phone: string;
  };
}

export async function createBooking({
  patientId,
  doctorId,
  homeServiceId,
  selectedServices,
  slot,
  paymentMethod,
  patientDetails
}: CreateBookingParams) {
  try {
    const booking = await db.homeServiceBooking.create({
      data: {
        patientId,
        doctorId,
        homeServiceId,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        scheduledDate: slot.date,
        totalAmount: selectedServices.reduce((sum, service) => sum + service.price, 0),
        selectedServices: selectedServices, // Stored directly as JSON
        paymentMethod,
        paymentStatus: "pending",
        status: "pending",
        patientDetails
      },
      include: {
        patient: true,
        doctor: true,
        homeService: true
      }
    });

    await updateSlotStatus(slot.id, true);

    return { booking };
  } catch (error) {
    console.error('Booking creation error:', error);
    throw error;
  }
}


interface UpdatePaymentParams {
  bookingId: string;
  stripePaymentId?: string;
  paymentMethod: 'card' | 'cash';
}

export async function updateBookingPaymentStatus({
  bookingId,
  stripePaymentId,
  paymentMethod
}: UpdatePaymentParams) {
  try {

  //  console.log("server actions started");
    const updatedBooking = await db.homeServiceBooking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: paymentMethod === 'card' ? 'completed' : 'pending',
        paymentMethod,
        stripePaymentId: stripePaymentId || null,
        updatedAt: new Date()
      }
    });

    // console.log("server actions succeed");

    


    return { success: true, booking: updatedBooking };
  } catch (error) {
    console.error('Payment status update error:', error);
    throw error;
  }
}


export async function getHomeServiceBookings(doctorId: string) {
  try {
    const bookings = await db.homeServiceBooking.findMany({
      where: {
        doctorId: doctorId,
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        homeService: {
          include: {
            specializations: true,
          },
        },
      },
      orderBy: {
        scheduledDate: 'desc',
      },
    })
    
    return bookings
  } catch (error) {
    console.error("Error fetching home service bookings:", error)
    throw new Error("Failed to fetch home service bookings")
  }
}

export async function getOnlineBookings(doctorId: string) {
  try {
    const bookings = await db.onlineAppointment.findMany({
      where: {
        doctorId: doctorId,
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        onlineService: true,
      },
      orderBy: {
        appointmentDate: 'desc',
      },
    })
    
    return bookings
  } catch (error) {
    console.error("Error fetching online bookings:", error)
    throw new Error("Failed to fetch online bookings")
  }
}