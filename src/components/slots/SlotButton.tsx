import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { TimeSlot } from "./type"

interface SlotButtonProps {
  slot: TimeSlot
  isSelected: boolean
  onSelect: (slot: TimeSlot) => void
}

export function SlotButton({ slot, isSelected, onSelect }: SlotButtonProps) {
  const tooltipText = slot.isPast 
    ? "This time slot has passed" 
    : slot.isReserved 
    ? "Already booked"
    : "Available for booking"

  return (
    <div className="relative group">
      <Button
        variant={isSelected ? "default" : "outline"}
        size="sm"
        disabled={slot.isReserved || slot.isPast}
        onClick={() => onSelect(slot)}
        className={cn(
          "gap-2 text-sm relative transition-all",
          "hover:border-primary hover:bg-primary/5",
          (slot.isReserved || slot.isPast) && "opacity-50 cursor-not-allowed hover:bg-transparent",
          slot.isPast && "bg-gray-100",
          isSelected && "bg-blue-600 text-white hover:bg-blue-700"
        )}
      >
        <Clock className="h-3 w-3" />
        {format(parseISO(`2024-01-01T${slot.startTime}`), 'h:mm a')}
      </Button>
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 
        rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        {tooltipText}
      </span>
    </div>
  )
}