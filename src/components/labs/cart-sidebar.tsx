// components/labs/cart-sidebar.tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { X, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/store/useCartStore"

import { labs, tests } from "@/libdata/labs"
import { CartItem } from "./cart-item"
import { formatPrice } from "@/utils/format-price"
import { toast } from "@/hooks/use-toast"
import { CheckoutDialog } from "./checkout-dialog"


interface CartSidebarProps {
  open: boolean
  onClose: () => void
}

export function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { items, getTotal } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const cartItems = items.map(item => {
    const test = tests.find(t => t.id === item.testId)
    const lab = labs.find(l => l.id === item.labId)
    return { ...item, test, lab }
  }).filter(item => item.test && item.lab)

  const subtotal = getTotal()
  const serviceCharge = 100 // Fixed service charge
  const total = subtotal + serviceCharge


  const handleProceedToCheckout = () => {
    console.log("Proceeding to checkout with items:", items)
    try {
      if (items.length === 0) {
        toast({
          variant: "destructive",
          title: "Cart Empty",
          description: "Please add tests to your cart before checkout"
        })
        return
      }
      setShowCheckout(true)
      // Don't close the sidebar yet
    } catch (error) {
      console.error("Error in handleProceedToCheckout:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to proceed to checkout"
      })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({cartItems.length})
          </SheetTitle>
        </SheetHeader>

        {cartItems.length > 0 ? (
          <div className="flex h-full flex-col">
            <ScrollArea className="flex-1 py-4">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  item.test && item.lab && (
                    <CartItem 
                      key={`${item.testId}-${item.labId}`}
                      item={item as any}
                    />
                  )
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-6">
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Service Charge</span>
                  <span className="text-sm font-medium">
                    {formatPrice(serviceCharge)}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Button 
                className="w-full"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-2">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <div className="text-xl font-medium">Your cart is empty</div>
            <Button 
              variant="outline"
              onClick={onClose}
            >
              Continue Browsing
            </Button>
          </div>
        )}
      </SheetContent>

      <CheckoutDialog
        open={showCheckout}
        onClose={() => {
          setShowCheckout(false)
          onClose() // Close the cart sidebar after checkout
        }}
      />
    </Sheet>

    
  )
}
