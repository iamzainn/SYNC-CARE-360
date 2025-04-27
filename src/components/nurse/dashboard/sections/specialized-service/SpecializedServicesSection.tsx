"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useSpecializedServiceStore } from "@/store/useSpecializedServiceStore"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { getSpecializedService, toggleSpecializedService } from "@/lib/actions/specialized-service"
import { SpecializedServiceSkeleton } from "./SpecializedServiceSkeleton"
import { SpecializedServiceForm } from "./SpecializedServiceForm"
import { SpecializedServiceDetails } from "./SpecializedServiceDetails"

export function SpecializedServicesSection() {
  const store = useSpecializedServiceStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRefetch, setShouldRefetch] = useState(false)
  const { toast } = useToast()

  // Fetch specialized service details
  const fetchSpecializedService = async () => {
    try {
      const response = await getSpecializedService()
      if (response.data) {
        store.setIsActive(response.data.specializedService?.isActive ?? false)
        store.setFee(response.data.specializedService?.fee ?? 0)
        store.setSlots(response.data.specializedService?.slots ?? [])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load specialized service details",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSpecializedService()
  }, [])

  useEffect(() => {
    if (shouldRefetch) {
      fetchSpecializedService()
      setShouldRefetch(false)
    }
  }, [shouldRefetch])

  if (isLoading) return <SpecializedServiceSkeleton />

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Specialized Medical Services</CardTitle>
          <div className="flex items-center space-x-4">
            {!isEditing && (
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={store.isActive}
                  onCheckedChange={async (enabled) => {
                    setIsLoading(true)
                    const response = await toggleSpecializedService(enabled)
                    if (!response.error) {
                      store.setIsActive(enabled)
                      if (!enabled) store.resetStore()
                      toast({
                        title: enabled ? "Service Activated" : "Service Deactivated",
                        description: enabled ? "Set up your specialized treatment details" : "Specialized service has been deactivated"
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
            <SpecializedServiceForm 
              onComplete={() => {
                setShouldRefetch(true)
                setIsEditing(false)
              }} 
            />
          ) : (
            <SpecializedServiceDetails />
          )
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Enable specialized medical services to start accepting treatment requests
          </div>
        )}
      </CardContent>
    </Card>
  )
}
