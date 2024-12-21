'use client'
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/store/useCartStore"
import { useToast } from "@/hooks/use-toast"
import { Test } from "@/lib/types/lab-test"
import { number } from "zod"


interface TestCardProps {
  test: Test
  labId?: string
}

export function TestCard({ test, labId }: TestCardProps) {
  const addItem = useCartStore(state => state.addItem)
  const { toast } = useToast()

  // Get pricing based on lab or lowest price if no lab specified
  const pricing = labId 
    ? test.labPricing.find(p => p.labId === labId)
    : test.labPricing.reduce((min, p) => 
        p.price < min.price ? p : min, 
        test.labPricing[0]
      )

  if (!pricing) return null

  const discountedPrice = pricing.discount 
    ? pricing.price * (1 - pricing.discount.percentage / 100)
    : null

  const handleAddToCart = () => {
    addItem({
      testId: test.id,
      labId: pricing.labId,
      price: pricing.price,
      discountedPrice:discountedPrice?discountedPrice:0
    })

    toast({
      title: "Test Added",
      description: "Test has been added to your cart"
    })
  }

  return (
    <Card className="flex flex-col h-full">
      <Link href={`/tests/${test.id}`} className="flex-1">
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium line-clamp-2">{test.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{test.knownAs}</p>
            </div>
            {pricing.discount && (
              <Badge variant="secondary" className="bg-blue-100 whitespace-nowrap">
                {pricing.discount.percentage}% OFF
              </Badge>
            )}
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {test.sampleType}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Free Home Sample
              </Badge>
            </div>

            <div>
              {discountedPrice ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold">
                    Rs. {discountedPrice.toFixed(0)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    Rs. {pricing.price}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold">
                  Rs. {pricing.price}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4 pt-0 mt-auto">
        <Button 
          className="w-full"
          onClick={handleAddToCart}
        >
          Add to cart
        </Button>
      </div>
    </Card>
  )
}