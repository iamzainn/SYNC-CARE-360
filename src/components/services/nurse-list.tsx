"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface NurseListProps {
  selectedNurse: string
  onSelect: (nurseId: string) => void
}

export function NurseList({ selectedNurse, onSelect }: NurseListProps) {
  const [nurses, setNurses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNurses() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/nurses')
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
  }, [])

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

  if (nurses.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">No nurses available at the moment</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {nurses.map((nurse) => (
        <Card 
          key={nurse.id}
          className={cn(
            "cursor-pointer transition-colors hover:bg-accent/20",
            selectedNurse === nurse.id && "border-primary bg-primary/5"
          )}
          onClick={() => onSelect(nurse.id)}
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
                {nurse.specialization}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant={nurse.isAvailable ? "default" : "outline"}>
                {nurse.isAvailable ? "Available" : "Limited"}
              </Badge>
              <div className="text-sm font-medium">
                Rs. {nurse.fee || 1500}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="flex flex-wrap gap-2">
              {nurse.expertise?.map((skill: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-background">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 