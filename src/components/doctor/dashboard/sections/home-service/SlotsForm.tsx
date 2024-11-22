// components/doctor/dashboard/sections/home-service/SlotsForm.tsx
"use client"

import { useState, useMemo, useEffect } from "react"
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
import { Loader2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useHomeServiceStore } from "@/store/useHomeServiceStore"
import * as z from "zod"
import { DAYS } from "@/lib/constants/home-services"
import { getHomeService, updateHomeService } from "@/lib/actions/home-service"



const slotSchema = z.object({
  dayOfWeek: z.enum(DAYS),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required")
}).refine((data) => {
  const [startHour, startMinute] = data.startTime.split(':').map(Number)
  const [endHour, endMinute] = data.endTime.split(':').map(Number)
  const startMinutes = startHour * 60 + startMinute
  const endMinutes = endHour * 60 + endMinute
  return endMinutes > startMinutes
}, "End time must be after start time");

type SlotFormValues = z.infer<typeof slotSchema>

interface HomeServiceSlotsFormProps {
  onPrevious: () => void
  onComplete: () => void
}

export function HomeServiceSlotsForm({
  onPrevious,
  onComplete
}: HomeServiceSlotsFormProps) {
  const store = useHomeServiceStore()
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await getHomeService();
  //     if (response.data?.homeService) {
  //       store.setSlots(response.data.homeService.slots);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const form = useForm<SlotFormValues>({
    resolver: zodResolver(slotSchema),
    defaultValues: {
      dayOfWeek: undefined,
      startTime: undefined,
      endTime: undefined
    }
  })

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

  const isSlotOverlapping = (newSlot: SlotFormValues) => {
    return store.slots.some(existingSlot => {
      if (existingSlot.dayOfWeek !== newSlot.dayOfWeek) return false;
      
      const [newStartHour, newStartMinute] = newSlot.startTime.split(':').map(Number)
      const [newEndHour, newEndMinute] = newSlot.endTime.split(':').map(Number)
      const [existingStartHour, existingStartMinute] = existingSlot.startTime.split(':').map(Number)
      const [existingEndHour, existingEndMinute] = existingSlot.endTime.split(':').map(Number)
      
      const newStart = newStartHour * 60 + newStartMinute
      const newEnd = newEndHour * 60 + newEndMinute
      const existingStart = existingStartHour * 60 + existingStartMinute
      const existingEnd = existingEndHour * 60 + existingEndMinute

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      )
    })
  }

  const onSubmitSlot = (values: SlotFormValues) => {
    if (isSlotOverlapping(values)) {
      toast({
        title: "Error",
        description: "This time slot overlaps with an existing slot for this day",
        variant: "destructive"
      })
      return
    }

    store.addSlot(values)
    const currentdayOfWeek=values.dayOfWeek
    const currentstartTime=values.startTime
    const currentendTime=values.endTime

    //reset value can be any without of these using Math.random
    const randomDayOfWeek = DAYS.filter(day => day !== currentdayOfWeek)[Math.floor(Math.random() * DAYS.length)]
    const randomStartTime = timeSlots.filter(time => time !== currentstartTime)[Math.floor(Math.random() * timeSlots.length)]
    const randomEndTime = timeSlots.filter(time => time !== currentendTime)[Math.floor(Math.random() * timeSlots.length)]
    
    
    // Reset form with proper cleanup
    form.reset({
      dayOfWeek: randomDayOfWeek,
      startTime: randomStartTime,
      endTime: randomEndTime
    })
    
    // Clear touched states and errors
    Object.keys(values).forEach(key => {
      form.clearErrors(key as keyof SlotFormValues)
      form.resetField(key as keyof SlotFormValues, {
        defaultValue: undefined
      })
    })

    toast({
      title: "Success",
      description: "Time slot added successfully"
    })
  }

  const handleComplete = async () => {
    if (store.slots.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one time slot",
        variant: "destructive"
      })
      return
    }

    setIsPending(true)
    try {
      const response = await updateHomeService({
        isActive: true,
        specializations: store.specializations,
        slots: store.slots
      })

      if (response.error) throw new Error(response.error)
      onComplete()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save slots",
        variant: "destructive"
      })
    } finally {
      setIsPending(false)
    }
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

          <Button 
            type="submit" 
            variant="outline" 
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Slot...
              </>
            ) : (
              "Add Time Slot"
            )}
          </Button>
        </form>
      </Form>

      {/* Display slots grouped by day */}
      <div className="space-y-4">
        <h4 className="font-medium">Added Time Slots</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DAYS.map(day => {
            const daySlots = store.slots.filter(slot => slot.dayOfWeek === day)
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
                          onClick={() => store.removeSlot(slot.dayOfWeek, slot.startTime)}
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

      <div className="flex justify-between pt-4">
      <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isPending}
        >
          Previous: Specializations
        </Button>
        <Button
          onClick={handleComplete}
          disabled={isPending || store.slots.length === 0}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Complete Setup"
          )}
        </Button>
      </div>
    </div>
  )
}