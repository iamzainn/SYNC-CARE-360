"use client"

import { useEffect, useState } from "react"
import { useSpecializedServiceStore } from "@/store/useSpecializedServiceStore"
import { getSpecializedService, toggleSpecializedService } from "@/lib/actions/specialized-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { SpecializedServiceForm } from "./SpecializedServiceForm"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Check, Clock, Loader2, Sparkles } from "lucide-react"

export function SpecializedServicesSection() {
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const store = useSpecializedServiceStore()
  const { toast } = useToast()

  // Fetch initial data only once on mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const response = await getSpecializedService()
        
        if (!isMounted) return;
        
        if (response.data) {
          const { specializedService } = response.data;
          
          // Update store with service data
          store.setIsActive(specializedService?.isActive ?? false);
          store.setSlots(specializedService?.slots ?? []);
          store.setServiceOfferings(specializedService?.serviceOfferings ?? []);
        }
      } catch (error) {
        console.error("Failed to fetch specialized service:", error)
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to load specialized service data",
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
  }, [toast])

  // Handle toggle
  const handleToggle = async (checked: boolean) => {
    try {
      setIsToggling(true);
      const response = await toggleSpecializedService(checked)
      
      if (response.success) {
        store.setIsActive(checked)
        
        // Reset store if deactivating
        if (!checked) {
          store.resetStore();
        }
        
        toast({
          title: checked ? "Service Activated" : "Service Deactivated",
          description: checked ? "Set up your specialized service details" : "Specialized service has been deactivated"
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update service status",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Failed to toggle specialized service:", error)
      toast({
        title: "Error",
        description: "Failed to update service status",
        variant: "destructive"
      })
    } finally {
      setIsToggling(false);
    }
  }

  // Service summary component
  const ServiceSummary = () => {
    if (store.serviceOfferings.length === 0) {
      return (
        <div className="text-center p-4 border rounded-md bg-muted/20">
          <p>No services configured yet. Click &quot;Edit Details&quot; to add services.</p>
        </div>
      )
    }
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Available Services</h3>
          <div className="flex flex-wrap gap-2">
            {store.serviceOfferings.map((service) => (
              <Badge 
                key={service.serviceName} 
                variant={service.isActive ? "default" : "outline"}
                className="flex items-center"
              >
                {service.isActive && <Check className="mr-1 h-3 w-3" />}
                {service.serviceName} - Rs. {service.price}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Availability Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].map(day => {
              const slots = store.slots.filter(slot => slot.dayOfWeek === day)
              
              if (slots.length === 0) return null
              
              return (
                <div key={day} className="flex items-center p-2 border rounded-md">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{day.charAt(0) + day.slice(1).toLowerCase()}</p>
                    <p className="text-xs text-muted-foreground">
                      {slots
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map(slot => `${slot.startTime}-${slot.endTime}`)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Specialized Services</CardTitle>
        <CardDescription>
          Manage your specialized nursing services and availability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Service Status Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Service Status</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable your specialized service
              </p>
            </div>
            <Switch
              checked={store.isActive}
              onCheckedChange={handleToggle}
              disabled={isToggling}
            />
          </div>

          {/* Service Details Form */}
          {store.isActive && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium flex items-center">
                  <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
                  Service Details
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setIsFormOpen(!isFormOpen)}
                >
                  {isFormOpen ? "Hide Details" : "Edit Details"}
                </Button>
              </div>
              
              {isFormOpen ? (
                <SpecializedServiceForm onComplete={() => setIsFormOpen(false)} />
              ) : (
                <ServiceSummary />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
