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
import { HOME_SPECIALIZATIONS } from "@/lib/constants/home-services"
import { useHomeServiceStore } from "@/store/useHomeServiceStore"
import { useToast } from "@/hooks/use-toast"
import * as z from "zod"
import { getHomeService, updateHomeService } from "@/lib/actions/home-service"
import { SpecializationType } from "@prisma/client"

const specializationSchema = z.object({
  type: z.nativeEnum(SpecializationType),
  price: z.number().min(100, "Minimum price is Rs. 100")
})

type SpecializationFormValues = z.infer<typeof specializationSchema>

interface HomeServiceSpecializationFormProps {
  onNext: () => void
}

export function HomeServiceSpecializationForm({ onNext }: HomeServiceSpecializationFormProps) {
  const store = useHomeServiceStore()
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await getHomeService();
  //     if (response.data?.homeService) {
  //       store.setSpecializations(response.data.homeService.specializations);
  //     }
  //   };
  //   fetchData();
  // }, []);
 

  const form = useForm<SpecializationFormValues>({
    resolver: zodResolver(specializationSchema),
    defaultValues: {
      type: undefined,
      price: undefined
    }
  })



  const availableSpecializations = HOME_SPECIALIZATIONS.filter(
    spec => !store.specializations.some(s => s.type === spec.id)
  )

  

  const onSubmitSpecialization = (values: SpecializationFormValues) => {
    // Check if specialization already exists
    if (store.specializations.some(s => s.type === values.type)) {
      toast({
        title: "Error",
        description: "This specialization is already added",
        variant: "destructive"
      })
      return
    }

    store.addSpecialization({
      type: values.type,
      price: values.price
    })

    form.reset(
    {
      price:0
    }
    )
    toast({
      title: "Success",
      description: "Service added to list"
    })
  }



 const handleNext = async () => {
    if (store.specializations.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one specialization",
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
      onNext()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save specializations",
        variant: "destructive"
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitSpecialization)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {HOME_SPECIALIZATIONS.map((spec) => (
                          <SelectItem key={spec.id} value={spec.id}>
                            {spec.label}
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
                Adding...
              </>
            ) : (
              "Add Service"
            )}
          </Button>
          </form>
        </Form>

        {/* Display added specializations */}
        <div className="space-y-4">
          <h4 className="font-medium">Added Services</h4>
          <div className="grid gap-2">
          {store.specializations.map((spec) => {
     const specData = HOME_SPECIALIZATIONS.find(s => s.id === spec.type)
     return (
       <div key={spec.type} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
         <span className="font-medium">{specData?.label}</span>
         <div className="flex items-center gap-3">
           <Badge variant="secondary">
             Rs. {spec.price}
           </Badge>
           <Button
             type="button"
             variant="ghost"
             size="sm"
             onClick={() => store.removeSpecialization(spec.type)}
           >
             <X className="h-4 w-4" />
           </Button>
         </div>
       </div>
     )
   })}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
      <Button
          onClick={handleNext}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save & Move next: Set Availability"
          )}
        </Button>
      </div>
    </div>
  )
}