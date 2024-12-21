// types/lab-test.ts
export interface TestFAQ {
    question: string;
    answer: string;
  }
  
  export interface TestPreparation {
    instruction: string;
  }
  
  export interface Lab {
    id: string;
    name: string;
    description: string;
    phone: string;
    city: string;
    services: string[];
    logo?: string;
  }
  
  export interface Test {
    id: string;
    name: string;
    knownAs: string;
    sampleType: string;
    basePrice: number;
    preparations: TestPreparation[];
    faqs: TestFAQ[];
    description: string;
    ageGroup: string;
    category: string;
    turnaroundTime: string;
    labPricing: {
      labId: string;
      price: number;
      discount?: {
        percentage: number;
        validUntil: Date;
      };
    }[];
  }
  
  export interface CartItem {
    testId: string;
    labId: string;
    price: number;
    discountedPrice?: number;
  }
  
  export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  
  export interface TestBooking {
    id: string;
    patientId: string;
    testId: string;
    labId: string;
    bookingDate: Date;
    appointmentDate?: Date;
    status: BookingStatus;
    paymentStatus: 'PENDING' | 'PAID';
    amount: number;
    paymentId?: string;
  }