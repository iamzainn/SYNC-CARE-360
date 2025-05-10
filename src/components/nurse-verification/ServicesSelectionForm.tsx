"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { NURSING_SERVICES } from "@/lib/constants/nursing-services"
import { nurseServicesSchema, NurseServicesValues } from "@/lib/validations/nurse-verification"
import { useNurseVerificationStore } from "@/store/useNurseVerificationStore"

export function ServicesSelectionForm() {
  const store = useNurseVerificationStore()
  const [isPending, setIsPending] = useState(false)

  const form = useForm<NurseServicesValues>({
    resolver: zodResolver(nurseServicesSchema),
    defaultValues: {
      services: store.services || [],
    },
  })

  const removeService = (index: number) => {
    const currentServices = form.getValues("services") || []
    form.setValue(
      "services",
      currentServices.filter((_, i) => i !== index)
    )
  }

  async function onSubmit(data: NurseServicesValues) {
    setIsPending(true)
    try {
      store.updateServices(data.services)
      store.nextStep()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Select Your Services</h2>
          <p className="text-sm text-muted-foreground">
            Choose all the nursing services you are qualified to provide.
          </p>
        </div>

        {/* Services Selection */}
        <FormField
          control={form.control}
          name="services"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel>Nursing Services</FormLabel>
              <div className="flex flex-wrap gap-2">
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      if (value && !field.value.includes(value)) {
                        form.setValue("services", [...field.value, value]);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {NURSING_SERVICES.map((service) => (
                        <SelectItem
                          key={service}
                          value={service}
                          disabled={field.value.includes(service)}
                        >
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Selected Services:</p>
                {field.value.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No services selected</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((service, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 space-x-2"
                      >
                        <span>{service}</span>
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={isPending}
          >
            Review Application
          </Button>
        </div>
      </form>
    </Form>
  )
} 