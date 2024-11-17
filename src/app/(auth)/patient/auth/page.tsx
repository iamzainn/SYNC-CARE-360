// app/(auth)/patient/auth/page.tsx
'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatientLoginForm } from "@/components/auth/patient-login-form"
import { PatientSignUpForm } from "@/components/auth/patient-signup-form"
import { Card, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function PatientAuthPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'login')

  // Update active tab when URL changes
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Update URL without navigation
    const params = new URLSearchParams(searchParams)
    params.set('tab', value)
    router.push(`/patient/auth?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-[450px] p-6">
        <CardHeader className="space-y-1 flex flex-col items-center mb-4">
          <Image
            src="/logo.jpeg"
            alt="Care Sync 360"
            width={120}
            height={120}
            className="mb-2"
          />
          <h2 className="text-2xl font-semibold text-center">Welcome</h2>
          <p className="text-sm text-muted-foreground text-center">
            {activeTab === 'login' 
              ? 'Sign in to your account to continue'
              : 'Create an account to get started'}
          </p>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <PatientLoginForm callbackUrl={callbackUrl??''} />
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => handleTabChange('signup')}
                className="text-primary hover:underline"
              >
                Sign up
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="signup">
            <PatientSignUpForm callback={callbackUrl??''} />
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => handleTabChange('login')}
                className="text-primary hover:underline"
              >
                Login
              </button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Additional helper text or links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Are you a doctor?{" "}
            <Link 
              href="/doctor/auth" 
              className="text-primary hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}