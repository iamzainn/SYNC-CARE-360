"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useOnlineServiceStore } from "@/store/useOnlineServiceStore"
import { useEffect, useState } from "react"

import { useToast } from "@/hooks/use-toast"


import { getOnlineService, toggleOnlineService } from "@/lib/actions/online-service"
import { OnlineServiceSkeleton } from "./OnlineServiceSkeleton"
import { OnlineServiceForm } from "./OnlineServiceForm"
import { OnlineServiceDetails } from "./OnlineServiceDetails"

export function OnlineServicesSection() {
  const store = useOnlineServiceStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRefetch, setShouldRefetch] = useState(false)
  const { toast } = useToast()


  const fetchOnlineService = async () => {
    try {
      const response = await getOnlineService()
      if (response.data) {
        store.setIsActive(response.data.onlineService?.isActive ?? false)
        store.setFee(response.data.onlineService?.fee ?? 0)
        store.setSlots(response.data.onlineService?.slots ?? [])
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

  useEffect(() => {
    fetchOnlineService()
  }, [])

  useEffect(() => {
    if (shouldRefetch) {
      fetchOnlineService()
      setShouldRefetch(false)
    }
  }, [shouldRefetch])

  if (isLoading) return <OnlineServiceSkeleton />

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Online Appointments</CardTitle>
          <div className="flex items-center space-x-4">
            {!isEditing && (
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={store.isActive}
                  onCheckedChange={async (enabled) => {
                    setIsLoading(true)
                    const response = await toggleOnlineService(enabled)
                    if (!response.error) {
                      store.setIsActive(enabled)
                      if (!enabled) store.resetStore()
                      toast({
                        title: enabled ? "Service Activated" : "Service Deactivated",
                        description: enabled ? "Set up your online consultation details" : "Online service has been deactivated"
                      })
                    }
                    setIsLoading(false)
                  }}
                />
                <span className={cn(
                  "text-sm",
                  store.isActive ? "text-green-600" : "text-gray-500"
                )}>
                  {store.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            )}
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
            <OnlineServiceForm 
              onComplete={() => {
                setShouldRefetch(true)
                setIsEditing(false)
              }} 
            />
          ) : (
            <OnlineServiceDetails />
          )
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Enable online appointments to start accepting consultation bookings
          </div>
        )}
      </CardContent>
    </Card>
  )
}