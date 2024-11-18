"use client"

import { useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"

export const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY"
] as const;

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9 // Start from 9 AM
  const minute = (i % 2) * 30
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}).filter(time => {
  const hour = parseInt(time.split(':')[0])
  return hour >= 9 && hour < 16 // 9 AM to 4 PM
})

const slotSchema = z.object({
  dayOfWeek: z.enum(DAYS),
  startTime: z.string(),
  endTime: z.string()
})

type SlotFormValues = z.infer<typeof slotSchema>

interface HomeServiceSlotsFormProps {
  initialData?: { dayOfWeek: string; startTime: string; endTime: string }[]
  onPrevious: () => void
  onComplete: () => void
}

export function HomeServiceSlotsForm({
  initialData = [],
  onPrevious,
  onComplete
}: HomeServiceSlotsFormProps) {
  const [slots, setSlots] = useState(initialData)
  const [isPending, setIsPending] = useState(false)
  const toast = useToast()

  const form = useForm<SlotFormValues>({
    resolver: zodResolver(slotSchema),
    defaultValues: {
      dayOfWeek: undefined,
      startTime: undefined,
      endTime: undefined
    }
  })

  const onSubmitSlot = (values: SlotFormValues) => {
    // Check for overlapping slots
    const isOverlapping = slots.some(slot => {
      if (slot.dayOfWeek !== values.dayOfWeek) return false;
      
      const [existingStartHour, existingStartMinute] = slot.startTime.split(':').map(Number)
      const [existingEndHour, existingEndMinute] = slot.endTime.split(':').map(Number)
      const [newStartHour, newStartMinute] = values.startTime.split(':').map(Number)
      const [newEndHour, newEndMinute] = values.endTime.split(':').map(Number)
      
      const existingStart = existingStartHour * 60 + existingStartMinute
      const existingEnd = existingEndHour * 60 + existingEndMinute
      const newStart = newStartHour * 60 + newStartMinute
      const newEnd = newEndHour * 60 + newEndMinute

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      )
    });

    if (isOverlapping) {

      // toast({
      //   title: "Error",
      //   description: "This time slot overlaps with an existing slot for this day",
      //   variant: "destructive"
      // });
      return;
    }

    setSlots(prev => [...prev, values])
    form.reset()
  }

  const timeSlots = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => {
      const hour = Math.floor(i / 2) + 9 // Start from 9 AM
      const minute = (i % 2) * 30
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    }).filter(time => {
      const hour = parseInt(time.split(':')[0])
      return hour >= 9 && hour < 16 // 9 AM to 4 PM
    })
  }, [])

  const removeSlot = (dayToRemove: string, timeToRemove: string) => {
    setSlots(prev => prev.filter(
      slot => !(slot.dayOfWeek === dayToRemove && slot.startTime === timeToRemove)
    ))
   }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitSlot)} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DAYS.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day.charAt(0) + day.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={!form.getValues("startTime")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots
                        .filter(time => time > (form.getValues("startTime") || ""))
                        .map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" variant="outline">Add Slot</Button>
        </form>
      </Form>

      <div className="space-y-4">
        <h4 className="font-medium">Added Time Slots</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DAYS.map(day => {
            const daySlots = slots.filter(slot => slot.dayOfWeek === day)
            if (daySlots.length === 0) return null;

            return (
              <div key={day} className="p-3 border rounded-lg">
                <h4 className="font-medium mb-2">
                  {day.charAt(0) + day.slice(1).toLowerCase()}
                </h4>
                <div className="flex flex-wrap gap-2">
                {daySlots
 .sort((a, b) => a.startTime.localeCompare(b.startTime))
 .map((slot) => (
   <Badge
     key={`${slot.dayOfWeek}-${slot.startTime}`}
     variant="secondary"
     className="px-3 py-1 space-x-2"
   >
     <span>{slot.startTime} - {slot.endTime}</span>
     <button
       type="button"
       onClick={() => removeSlot(slot.dayOfWeek, slot.startTime)}
       className="text-muted-foreground hover:text-foreground"
     >
       <X className="h-3 w-3" />
     </button>
   </Badge>
 ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}