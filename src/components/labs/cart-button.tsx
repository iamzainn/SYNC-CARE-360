// components/labs/cart-button.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/store/useCartStore"
import { useEffect, useState } from "react"

export function CartButton() {
  const [mounted, setMounted] = useState(false)
  const { items, setCartOpen } = useCartStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed right-4 top-4 z-50">
      <Button 
        variant="default"
        size="lg"
        className="relative pr-8"
        onClick={() => setCartOpen(true)}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Test in your cart ({items.length})
        {items.length > 0 && (
          <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
            {items.length}
          </span>
        )}
      </Button>
    </div>
  )
}