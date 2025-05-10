"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"


interface NurseProfileSectionProps {
  nurseId: string
  nurseName?: string
}

export function NurseProfileSection({ nurseId, nurseName }: NurseProfileSectionProps) {
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchNurseProfile() {
      try {
        const response = await fetch(`/api/nurse/${nurseId}/profile`)
        if (!response.ok) throw new Error('Failed to fetch nurse profile')
        const data = await response.json()
        setProfileData(data)
      } catch (error) {
        console.error('Error fetching nurse profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNurseProfile()
  }, [nurseId])

  if (isLoading) {
    return <ProfileSkeleton />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photo and Name */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileData?.profilePhoto || ""} />
              <AvatarFallback>
                {nurseName?.charAt(0).toUpperCase() || "N"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{profileData?.name || nurseName}</h3>
              <p className="text-muted-foreground">Registered Nurse</p>
            </div>
          </div>

          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Email:</span>
              <p className="font-medium">{profileData?.email || "N/A"}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Phone:</span>
              <p className="font-medium">{profileData?.phone || "N/A"}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">City:</span>
              <p className="font-medium">{profileData?.city || "N/A"}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Verification Status:</span>
              <p>
                <Badge variant={profileData?.isVerifiedNurse ? "default" : "secondary"}>
                  {profileData?.isVerifiedNurse ? "Verified" : "Pending Verification"}
                </Badge>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Section */}
      <Card>
        <CardHeader>
          <CardTitle>Nursing Services</CardTitle>
        </CardHeader>
        <CardContent>
          {profileData?.verification?.services && 
          profileData.verification.services.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profileData.verification.services.map((service: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {service}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No services registered yet.</p>
          )}

          {/* Verification Status Info */}
          {profileData?.verification && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <div>
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Verification Status: </span>
                    {profileData.verification.status}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Last Updated: {new Date(profileData.verification.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(4).fill(null).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Array(5).fill(null).map((_, i) => (
              <Skeleton key={i} className="h-8 w-32 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 