"use client"

import { useCartStore } from "@/store/useCartStore"
import { CartSidebar } from "../labs/cart-sidebar"
import { CartButton } from "../labs/cart-button"
import { EmptyCartMessage } from "../labs/empty-cart-message"


interface LabsLayoutProps {
  children: React.ReactNode
}

export function LabsLayout({ children }: LabsLayoutProps) {
  const { isCartOpen, setCartOpen, items } = useCartStore()

  return (
    <div className="relative min-h-screen">
      <CartButton />
      {children}
      <CartSidebar 
        open={isCartOpen} 
        onClose={() => setCartOpen(false)} 
      />
      {items.length === 0 && (
        <div className="fixed right-4 top-20 z-50 w-80">
          <EmptyCartMessage />
        </div>
      )}
    </div>
  )
}