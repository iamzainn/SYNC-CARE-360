"use client"

import { useEffect, useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, X } from "lucide-react"

import { useOnlineServiceStore } from "@/store/useOnlineServiceStore"
import { useToast } from "@/hooks/use-toast"
import * as z from "zod"
import { getOnlineService, updateOnlineService } from "@/lib/actions/online-service"
import { DAYS } from "@/lib/constants/home-services"

const formSchema = z.object({
  fee: z.number().min(100, "Minimum fee is Rs. 100"),
  dayOfWeek: z.enum(DAYS),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required")
}).refine((data) => {
  const [startHour, startMinute] = data.startTime.split(':').map(Number)
  const [endHour, endMinute] = data.endTime.split(':').map(Number)
  const startMinutes = startHour * 60 + startMinute
  const endMinutes = endHour * 60 + endMinute
  return endMinutes > startMinutes
}, "End time must be after start time")

type FormValues = z.infer<typeof formSchema>

interface OnlineServiceFormProps {
  onComplete: () => void
}

export function OnlineServiceForm({ onComplete }: OnlineServiceFormProps) {
  const store = useOnlineServiceStore()
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOnlineService()
        if (response.data?.onlineService) {
          store.setFee(response.data.onlineService.fee)
          store.setSlots(response.data.onlineService.slots)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load online service details",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fee: store.fee || 0,
      dayOfWeek: undefined,
      startTime: undefined,
      endTime: undefined
    }
  })

  // Generate time slots in 20-minute intervals from 9 AM to 6 PM
  const timeSlots = Array.from({ length: 27 }, (_, i) => {
    const hour = 9 + Math.floor(i / 3)
    const minute = (i % 3) * 20
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  })

  const isSlotOverlapping = (newSlot: Omit<FormValues, 'fee'>) => {
    return store.slots.some(existingSlot => {
      if (existingSlot.dayOfWeek !== newSlot.dayOfWeek) return false
      
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

  const onSubmit = (values: FormValues) => {
    const { fee, ...slotData } = values

    // Check for overlapping slots
    if (isSlotOverlapping(slotData)) {
      toast({
        title: "Error",
        description: "This time slot overlaps with an existing slot",
        variant: "destructive"
      })
      return
    }

    // Just update the store
    store.setFee(fee)
    store.addSlot(slotData)

    // Reset the form except fee
    form.reset({
      fee,
      dayOfWeek: undefined,
      startTime: undefined,
      endTime: undefined
    })
    
    toast({
      title: "Success",
      description: "Time slot added successfully"
    })
  }

  const handleSaveSettings = async () => {
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
      const response = await updateOnlineService({
        isActive: true,
        fee: store.fee,
        slots: store.slots
      })

      if (response.error) throw new Error(response.error)
      
      onComplete()
      toast({
        title: "Success",
        description: "Online service settings saved successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setIsPending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consultation Fee (Rs.)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter consultation fee"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
          >
            Add Time Slot
          </Button>
        </form>
      </Form>

      {/* Display slots grouped by day */}
      <div className="space-y-4">
        <h4 className="font-medium">Added Time Slots</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DAYS.map(day => {
            const daySlots = store.slots.filter(slot => slot.dayOfWeek === day)
            if (daySlots.length === 0) return null

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

      {/* Save Settings Button */}
      <div className="flex justify-end pt-6">
        <Button
          onClick={handleSaveSettings}
          disabled={isPending || store.slots.length === 0}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Settings...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>
    </div>
  )
}