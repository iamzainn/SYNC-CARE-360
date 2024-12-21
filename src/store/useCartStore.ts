// store/useCartStore.ts
import { CartItem } from '@/lib/types/lab-test'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartStore {
  items: CartItem[]
  isCartOpen: boolean
  isCheckoutOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (testId: string) => void
  clearCart: () => void
  setCartOpen: (open: boolean) => void
  setCheckoutOpen: (open: boolean) => void
  getTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      isCheckoutOpen: false,
      addItem: (item) => {
        set((state) => {
          const filteredItems = state.items.filter(i => i.testId !== item.testId)
          return { 
            items: [...filteredItems, item],
            isCartOpen: true
          }
        })
      },
      removeItem: (testId) => {
        set((state) => ({
          items: state.items.filter(item => item.testId !== testId)
        }))
      },
      clearCart: () => set({ items: [] }),
      setCartOpen: (open) => set({ isCartOpen: open }),
      setCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
      getTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => 
          total + (item.discountedPrice || item.price), 0)
      }
    }),
    {
      name: 'lab-test-cart'
    }
  )
)