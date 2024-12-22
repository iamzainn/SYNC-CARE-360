
// components/services/doctor-list.tsx
"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  MapPin, 
  GraduationCap, 
  Stethoscope,
  User,
  AlertCircle,
  RefreshCcw
} from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { getVerifiedDoctors, VerifiedDoctor } from "@/lib/actions/doctorFortreatment"

interface DoctorListProps {
  selectedDoctor: string
  onSelect: (id: string) => void
}

export function DoctorList({ selectedDoctor, onSelect }: DoctorListProps) {
  const [doctors, setDoctors] = useState<VerifiedDoctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRetrying, setIsRetrying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchDoctors = async (showToast = false) => {
    try {
      setIsRetrying(true)
      const result = await getVerifiedDoctors()
      
      if (!result.success) {
        throw new Error(result.error)
      }

      setDoctors(result.data || [])
      setError(null)
      
      if (showToast) {
        toast({
          description: "Doctor list refreshed successfully"
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch doctors")
      if (showToast) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to refresh doctor list"
        })
      }
    } finally {
      setIsLoading(false)
      setIsRetrying(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  if (isLoading) {
    return <DoctorListSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          <p className="mb-2">{error}</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fetchDoctors(true)}
            disabled={isRetrying}
            className="mt-2"
          >
            {isRetrying ? (
              <>
                <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              'Try Again'
            )}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (doctors.length === 0) {
    return (
      <Alert>
        <AlertTitle>No Doctors Available</AlertTitle>
        <AlertDescription>
          No verified doctors are available at the moment. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          {doctors.length} verified doctor{doctors.length === 1 ? '' : 's'} available
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchDoctors(true)}
          disabled={isRetrying}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          isSelected={selectedDoctor === doctor.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

interface DoctorCardProps {
  doctor: VerifiedDoctor
  isSelected: boolean
  onSelect: (id: string) => void
}

function DoctorCard({ doctor, isSelected, onSelect }: DoctorCardProps) {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "border-primary ring-2 ring-primary/20" : ""
      }`}
      onClick={() => onSelect(doctor.id)}
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage 
            src={doctor.verification?.profilePhoto} 
            alt={doctor.name} 
          />
          <AvatarFallback>
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div>
            <h4 className="font-medium">
              {doctor.title} {doctor.name}
            </h4>
            <p className="text-sm text-muted-foreground">
              {doctor.specialization}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{doctor.city}</span>
            </div>
            {doctor.verification?.experienceYears && (
              <div className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                <span>{doctor.verification.experienceYears} years exp.</span>
              </div>
            )}
          </div>

          {doctor.verification?.specialization && (
            <div className="flex flex-wrap gap-1">
              {doctor.verification.specialization.map((spec, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="text-xs"
                >
                  {spec}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(doctor.id)
          }}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </div>
    </Card>
  )
}

function DoctorListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="w-full h-8 flex justify-between items-center">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex gap-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
            <Skeleton className="h-9 w-[70px]" />
          </div>
        </Card>
      ))}
    </div>
  )
}
