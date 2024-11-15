// types/payment.ts
export interface PaymentIntent {
    id: string
    client_secret: string
    amount: number
  }