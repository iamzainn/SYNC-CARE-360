"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface NurseListProps {
  selectedNurse: string
  requiredServices: string[]
  onSelect: (nurseId: string, servicePrices: Record<string, number>) => void
}

export function NurseList({ selectedNurse, requiredServices, onSelect }: NurseListProps) {
  const [nurses, setNurses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredNurses, setFilteredNurses] = useState<any[]>([])

  // Fetch all nurses
  useEffect(() => {
    async function fetchNurses() {
      try {
        setIsLoading(true)
        
        // Create URL with query parameters for required services
        let url = '/api/nurses';
        if (requiredServices.length > 0) {
          url = `/api/nurses?services=${requiredServices.join(',')}`;
        }
        
        const response = await fetch(url)
        const data = await response.json()

        if (data.success) {
          setNurses(data.nurses || [])
        } else {
          setError(data.error || 'Failed to fetch nurses')
        }
      } catch (error) {
        setError('Error connecting to server')
        console.error('Error fetching nurses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNurses()
  }, [requiredServices])

  // Filter nurses based on required services
  useEffect(() => {
    // We can simply use the nurses directly since the API now filters for ALL required services
    setFilteredNurses(nurses);
  }, [nurses]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-4">
        <p>{error}</p>
        <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
      </div>
    )
  }

  if (filteredNurses.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">No nurses available for the selected services</p>
        <p className="text-sm mt-2">Please try selecting different services or try again later</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredNurses.map((nurse) => {
        // Extract service prices for required services that the nurse offers
        const servicePrices: Record<string, number> = {}
        const availableServices: string[] = []
        
        // Track both active and inactive services
        const activeServices: string[] = []
        const inactiveServices: string[] = []
        
        // Make sure serviceOfferings is an array and populated
        if (Array.isArray(nurse.serviceOfferings)) {
          // First populate active services for required ones
          requiredServices.forEach(serviceName => {
            const serviceOffering = nurse.serviceOfferings.find(
              (offering: any) => offering.serviceName === serviceName && offering.isActive
            )
            if (serviceOffering) {
              servicePrices[serviceName] = serviceOffering.price
              availableServices.push(serviceName)
              activeServices.push(serviceName)
            }
          })
          
          // Now get all services this nurse offers (both active and inactive)
          nurse.serviceOfferings.forEach((offering: any) => {
            if (offering.isActive && !activeServices.includes(offering.serviceName)) {
              activeServices.push(offering.serviceName)
            } else if (!offering.isActive) {
              inactiveServices.push(offering.serviceName)
            }
          })
        }

        return (
          <Card 
            key={nurse.id}
            className={cn(
              "cursor-pointer transition-colors hover:bg-accent/20",
              selectedNurse === nurse.id && "border-primary bg-primary/5"
            )}
            onClick={() => onSelect(nurse.id, servicePrices)}
          >
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={nurse.profilePhoto || ''} alt={nurse.name} />
                <AvatarFallback>{nurse.name?.charAt(0) || 'N'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-base flex items-center gap-2">
                  {nurse.name}
                  {selectedNurse === nurse.id && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {nurse.city || "Location not specified"}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant={nurse.isAvailable ? "default" : "outline"}>
                  {nurse.isAvailable ? "Available" : "Limited"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              {/* Display requested services with prices */}
              <div className="mb-3">
                <p className="text-sm font-medium mb-1 flex items-center">
                  <DollarSign className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  Requested Services:
                </p>
                {availableServices.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {availableServices.map((service) => (
                      <div key={service} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate mr-2">{service}</span>
                        <span className="font-medium">Rs. {servicePrices[service] || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No matching services available</p>
                )}
              </div>
              
              <Separator className="my-2" />
              
              {/* Display all services offered by the nurse */}
              <div className="mb-3">
                <p className="text-sm font-medium mb-1">All Registered Services:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {activeServices.filter(s => !availableServices.includes(s)).map(service => (
                    <Badge key={service} variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                      {service} (Active)
                    </Badge>
                  ))}
                  {inactiveServices.map(service => (
                    <Badge key={service} variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                      {service} (Inactive)
                    </Badge>
                  ))}
                </div>
                {activeServices.length === 0 && inactiveServices.length === 0 && (
                  <p className="text-sm text-muted-foreground">No additional services registered</p>
                )}
              </div>
              
              <Separator className="my-2" />
              
              {/* Display expertise */}
              {Array.isArray(nurse.expertise) && nurse.expertise.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">Verified Skills:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {nurse.expertise.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-background">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 