import { Card } from "@/components/ui/card"
import Image from "next/image"

export function EmptyCartMessage() {
  return (
    <Card className="p-4 text-center">
      <div className="flex flex-col items-center">
        <Image 
          src="/images/empty-cart.png" 
          alt="Empty Cart" 
          width={100} 
          height={100}
          className="mb-4"
        />
        <p className="text-sm text-muted-foreground">
          Your cart is empty right now, please add a test in your cart
        </p>
      </div>
    </Card>
  )
}