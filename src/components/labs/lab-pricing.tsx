
'use client'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { useCartStore } from "@/store/useCartStore"
import { Test } from "@/lib/types/lab-test"
import { useToast } from "@/hooks/use-toast"
import { labs } from "@/libdata/labs"


interface LabPricingProps {
  test: Test
}

export function LabPricing({ test }: LabPricingProps) {
  const addItem = useCartStore(state => state.addItem)
  const { toast } = useToast()

  const handleAddToCart = (labId: string, price: number, discountedPrice?: number) => {
    addItem({
      testId: test.id,
      labId,
      price,
      discountedPrice
    })

    toast({
      title: "Added to cart",
      description: `${test.name} has been added to your cart.`
    })
  }

  return (
    <Card className="p-6">
      <h2 className="font-semibold mb-4">Available at Labs</h2>
      <div className="space-y-4">
        {test.labPricing.map((pricing) => {
          const lab = labs.find(l => l.id === pricing.labId)
          if (!lab) return null

          const discountedPrice = pricing.discount 
            ? pricing.price * (1 - pricing.discount.percentage / 100)
            : null

          return (
            <Card key={pricing.labId} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{lab.name}</h3>
                  <p className="text-sm text-gray-500">{lab.city}</p>
                </div>
                {pricing.discount && (
                  <Badge variant="secondary" className="bg-blue-100">
                    {pricing.discount.percentage}% OFF
                  </Badge>
                )}
              </div>

              <div className="mt-4">
                {discountedPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">
                      Rs. {discountedPrice.toFixed(0)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      Rs. {pricing.price}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-bold">
                    Rs. {pricing.price}
                  </span>
                )}
              </div>

              <Button 
                className="w-full mt-4"
                onClick={() => handleAddToCart(
                  pricing.labId, 
                  pricing.price, 
                  discountedPrice || undefined
                )}
              >
                Book with {lab.name}
              </Button>
            </Card>
          )
        })}
      </div>
    </Card>
  )
}
