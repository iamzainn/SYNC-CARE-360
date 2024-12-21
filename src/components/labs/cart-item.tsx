import { Button } from "@/components/ui/button"
import { Lab, Test } from "@/lib/types/lab-test"
import { useCartStore } from "@/store/useCartStore"
import { formatPrice } from "@/utils/format-price"
import { X } from "lucide-react"
import { CartItem as CartItemType } from "@/lib/types/lab-test"


interface CartItemProps {
  item: CartItemType & {
    test: Test
    lab: Lab
  }
}

export function CartItem({ item }: CartItemProps) {
  const removeItem = useCartStore(state => state.removeItem)

  return (
    <div className="flex items-start gap-4">
      <div className="flex-1 space-y-1">
        <div className="flex justify-between">
          <div className="font-medium">{item.test.name}</div>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-muted-foreground"
            onClick={() => removeItem(item.testId)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          by {item.lab.name}
        </div>
        <div className="flex items-center gap-2">
          {item.discountedPrice ? (
            <>
              <span className="font-medium">
                {formatPrice(item.discountedPrice)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(item.price)}
              </span>
            </>
          ) : (
            <span className="font-medium">
              {formatPrice(item.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}