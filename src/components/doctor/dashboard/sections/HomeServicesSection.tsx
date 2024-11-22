"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useHomeServiceStore } from "@/store/useHomeServiceStore"
import { useEffect, useState } from "react"
import { HomeServiceDetails } from "./home-service/HomeServiceDetails"
import { HomeServiceForm } from "./home-service/HomeServiceForm"
import { getHomeService, toggleHomeService } from "@/lib/actions/home-service"
import { useToast } from "@/hooks/use-toast"
import { HomeServiceSkeleton } from "./HomeServiceSkeleton"
import { Loader2 } from "lucide-react"

export function HomeServicesSection() {
  const store = useHomeServiceStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRefetch, setShouldRefetch] = useState(false)
  const { toast } = useToast()


  const fetchHomeService = async () => {
    try {
      const response = await getHomeService()
      if (response.data) {
        store.setIsActive(response.data.homeService?.isActive ?? false)
        store.setSpecializations(response.data.homeService?.specializations ?? [])
        store.setSlots(response.data.homeService?.slots ?? [])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load home service details",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormComplete = () => {
    setShouldRefetch(true)
    setIsEditing(false)
  }

  

  useEffect(() => {
    fetchHomeService()
  }, [])


  useEffect(() => {
    if (shouldRefetch) {
      fetchHomeService()
      setShouldRefetch(false)
    }
  }, [shouldRefetch])

  useEffect(() => {
    const fetchAndInitialize = async () => {
      setIsLoading(true)
      try {
        const response = await getHomeService()
        if (response.data) {
          const homeService = response.data.homeService
          store.setIsActive(homeService?.isActive ?? false)
          store.setSpecializations(homeService?.specializations ?? [])
          store.setSlots(homeService?.slots ?? [])
          
          // Only set editing mode if service is newly activated with no data
          const isNewActivation  = homeService?.isActive && 
            (!homeService.specializations.length && !homeService.slots.length)
          setIsEditing(isNewActivation as boolean)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load home service details",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAndInitialize()
  }, [])


  if (isLoading) {
    return <HomeServiceSkeleton />
  }


  const toggleService = async (enabled: boolean) => {
    setIsLoading(true);
    try {
      const response = await toggleHomeService(enabled);
      if (response.error) throw new Error(response.error);
  
      store.setIsActive(enabled);
      if (!enabled) {
        store.resetStore();
      }
      
  
      toast({
        title: enabled ? "Service Activated" : "Service Deactivated",
        description: enabled 
          ? "You can now set up your home service details" 
          : "Home service has been deactivated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to toggle service",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>Home Services</CardTitle>
        <div className="flex items-center space-x-4">
        
          {!isEditing && (
            <div className="flex items-center space-x-2">
              <Switch
                checked={store.isActive}
                onCheckedChange={toggleService}
                disabled={isLoading}
              />
              <span className={cn(
                "text-sm",
                store.isActive ? "text-green-600" : "text-gray-500"
              )}>
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  store.isActive ? "Active" : "Inactive"
                )}
              </span>
            </div>
          )}
          
          {/* Show Edit button only when service is active and not in editing mode */}
          {store.isActive && !isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit Settings
            </Button>
          )}
        </div>
      </div>
    </CardHeader>
    
    <CardContent>
      {store.isActive ? (
        isEditing ? (
          <HomeServiceForm onCancel={handleFormComplete} />
        ) : (
          <HomeServiceDetails />
        )
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          Enable home services to start accepting home visit appointments
        </div>
      )}
    </CardContent>
  </Card>
)
  
}