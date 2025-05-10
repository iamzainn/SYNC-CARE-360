"use client"

import { useEffect, useState, useCallback } from "react"
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
  FormDescription,
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
import { Loader2, X, Plus, Settings } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

import { SpecializedServiceSlot, ServiceOffering, useSpecializedServiceStore } from "@/store/useSpecializedServiceStore"
import { useToast } from "@/hooks/use-toast"
import * as z from "zod"
import { getSpecializedService, updateSpecializedService } from "@/lib/actions/specialized-service"
import { DAYS } from "@/lib/constants/home-services" // Reusing the same constants as doctor
import { NURSING_SERVICES } from "@/lib/constants/nursing-services"

// Schema for time slot form
const slotFormSchema = z.object({
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

// Schema for service offering form
const serviceFormSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  price: z.number().min(100, "Minimum price is Rs. 100"),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
})

type SlotFormValues = z.infer<typeof slotFormSchema>
type ServiceFormValues = z.infer<typeof serviceFormSchema>

interface SpecializedServiceFormProps {
  onComplete: () => void
}

export function SpecializedServiceForm({ onComplete }: SpecializedServiceFormProps) {
  const store = useSpecializedServiceStore()
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'services' | 'slots'>('services')
  
  // Services that the nurse is verified for but hasn't added to offerings yet
  const [availableServices, setAvailableServices] = useState<string[]>([])
  const [verifiedServices, setVerifiedServices] = useState<string[]>([])

  // Fetch initial data only once on mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await getSpecializedService()
        
        if (!isMounted) return;
        
        if (response.data) {
          const specializedService = response.data.specializedService;
          const verified = response.data.verifiedServices || [];
          
          // Update store
          store.setIsActive(specializedService?.isActive ?? false)
          store.setSlots(specializedService?.slots ?? [])
          store.setServiceOfferings(specializedService?.serviceOfferings ?? [])
          
          // Store verified services
          setVerifiedServices(verified)
          
          // Calculate available services (those verified but not yet added)
          const currentServiceNames = (specializedService?.serviceOfferings || [])
            .map(offering => offering.serviceName);
          
          setAvailableServices(verified.filter(
            service => !currentServiceNames.includes(service)
          ));
        }
      } catch (error) {
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to load specialized service details",
            variant: "destructive"
          })
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    
    fetchData()
    
    return () => {
      isMounted = false;
    }
  }, [toast]) // Don't include store in dependencies

  // Update available services on service offering changes
  useEffect(() => {
    const currentServiceNames = store.serviceOfferings.map(offering => offering.serviceName)
    setAvailableServices(
      verifiedServices.filter(service => !currentServiceNames.includes(service))
    )
  }, [store.serviceOfferings, verifiedServices])

  // Form for time slots
  const slotForm = useForm<SlotFormValues>({
    resolver: zodResolver(slotFormSchema),
    defaultValues: {
      dayOfWeek: undefined,
      startTime: undefined,
      endTime: undefined
    }
  })

  // Form for service offerings
  const serviceForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      serviceName: "",
      price: 500,
      isActive: true,
      description: ""
    }
  })

  // Generate time slots in 20-minute intervals from 9 AM to 6 PM
  const timeSlots = Array.from({ length: 27 }, (_, i) => {
    const hour = 9 + Math.floor(i / 3)
    const minute = (i % 3) * 20
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  })

  const isSlotOverlapping = (newSlot: Omit<SlotFormValues, 'fee'>) => {
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

  // Submit handler for time slots
  const onSubmitSlot = (values: SlotFormValues) => {
    // Check for overlapping slots
    if (isSlotOverlapping(values)) {
      toast({
        title: "Error",
        description: "This time slot overlaps with an existing slot",
        variant: "destructive"
      })
      return
    }

    // Add slot to store
    store.addSlot(values as SpecializedServiceSlot)

    // Reset form fields
    slotForm.reset({
      dayOfWeek: undefined,
      startTime: undefined,
      endTime: undefined
    })
    
    toast({
      title: "Success",
      description: "Time slot added successfully"
    })
  }

  // Submit handler for service offerings
  const onSubmitService = (values: ServiceFormValues) => {
    // Add service offering to store
    store.addServiceOffering(values as ServiceOffering)

    // Reset form
    serviceForm.reset({
      serviceName: "",
      price: 500,
      isActive: true,
      description: ""
    })
    
    toast({
      title: "Success",
      description: "Service offering added successfully"
    })
  }

  // Save all settings
  const handleSaveSettings = async () => {
    if (store.slots.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one time slot",
        variant: "destructive"
      })
      return
    }

    if (store.serviceOfferings.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one service offering",
        variant: "destructive"
      })
      return
    }

    setIsPending(true)
    try {
      const response = await updateSpecializedService({
        isActive: true,
        slots: store.slots,
        serviceOfferings: store.serviceOfferings
      })

      if (response.error) throw new Error(response.error)
      
      onComplete()
      toast({
        title: "Success",
        description: "Specialized service settings saved successfully"
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
      {/* Tab navigation */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'services' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('services')}
        >
          Service Offerings
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'slots' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('slots')}
        >
          Time Slots
        </button>
      </div>

      {/* Service Offerings Tab */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Your Service Offerings</h3>
            <p className="text-sm text-muted-foreground">
              Set up the nursing services you offer with their individual prices.
            </p>
          </div>

          {/* Current Service Offerings */}
          {store.serviceOfferings.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {store.serviceOfferings.map((offering, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-medium">{offering.serviceName}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`active-${index}`}
                          checked={offering.isActive}
                          onCheckedChange={(checked) => 
                            store.updateServiceOffering(offering.serviceName, { isActive: !!checked })
                          }
                        />
                        <label htmlFor={`active-${index}`} className="text-sm text-muted-foreground cursor-pointer">
                          Active
                        </label>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Price:</span>
                        <span className="font-medium">Rs. {offering.price}</span>
                      </div>
                      
                      {offering.description && (
                        <div className="pt-2">
                          <p className="text-sm">{offering.description}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-end pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => store.removeServiceOffering(offering.serviceName)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Form to add new service offering */}
          <Form {...serviceForm}>
            <form onSubmit={serviceForm.handleSubmit(onSubmitService)} className="space-y-4">
              <FormField
                control={serviceForm.control}
                name="serviceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableServices.length > 0 ? (
                          availableServices.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            All verified services have been added
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select from the nursing services you&apos;ve been verified to provide
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={serviceForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (Rs.)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter price"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={serviceForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of your service"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={serviceForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Activate this service immediately
                      </FormLabel>
                      <FormDescription>
                        Toggle to make this service available for booking
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                variant="outline" 
                className="w-full"
                disabled={!serviceForm.getValues("serviceName") || availableServices.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Service Offering
              </Button>
            </form>
          </Form>
        </div>
      )}

      {/* Time Slots Tab */}
      {activeTab === 'slots' && (
        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Your Availability</h3>
            <p className="text-sm text-muted-foreground">
              Set up the time slots when you are available to provide services.
            </p>
          </div>

          <Form {...slotForm}>
            <form onSubmit={slotForm.handleSubmit(onSubmitSlot)} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={slotForm.control}
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
                  control={slotForm.control}
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
                  control={slotForm.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={!slotForm.getValues("startTime")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots
                            .filter(time => time > (slotForm.getValues("startTime") || ""))
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
                <Plus className="mr-2 h-4 w-4" />
                Add Time Slot
              </Button>
            </form>
          </Form>

          {/* Display slots grouped by day */}
          <div className="space-y-4 mt-6">
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
        </div>
      )}

      {/* Save Settings Button */}
      <Separator className="my-6" />
      <div className="flex justify-end pt-6">
        <Button
          onClick={handleSaveSettings}
          disabled={isPending || store.slots.length === 0 || store.serviceOfferings.length === 0}
          className="flex items-center"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Settings...
            </>
          ) : (
            <>
              <Settings className="mr-2 h-4 w-4" />
              Save All Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
