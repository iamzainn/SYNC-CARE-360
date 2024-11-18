"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

import { HomeServiceData } from "@/types"
import { HomeServiceForm } from "./home-service/HomeServiceForm"
import { HomeServiceDetails } from "./home-service/HomeServiceDetails"

interface HomeServicesSectionProps {
  initialData?: HomeServiceData
}

export function HomeServicesSection({ initialData }: HomeServicesSectionProps) {
  const { toast } = useToast()
  const [isActive, setIsActive] = useState(initialData?.isActive ?? false)
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const toggleService = async (enabled: boolean) => {
    if (enabled) {
      setIsActive(true)
      setIsEditing(true)
    } else {
      // Confirm before deactivating
      if (confirm("Are you sure you want to deactivate home services?")) {
        try {
        //   await updateHomeServiceStatus(false)
          setIsActive(false)
          setIsEditing(false)
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to deactivate service",
            variant: "destructive",
          })
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Home Services</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={isActive}
                onCheckedChange={toggleService}
              />
              <span className={cn(
                "text-sm",
                isActive ? "text-green-600" : "text-gray-500"
              )}>
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
            {isActive && !isEditing && (
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
        {isActive ? (
          isEditing ? (
            <HomeServiceForm 
              initialData={initialData}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <HomeServiceDetails data={initialData} />
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
