"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NurseLoginForm } from "@/components/auth/nurse-login-form"
import { NurseSignUpForm } from "@/components/auth/nurse-signup-form"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AuthenticationPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("login")
  const callbackUrl = searchParams?.get("callbackUrl") || '/'

  useEffect(() => {
    const tab = searchParams?.get("tab")
    if (tab === "signup" || tab === "login") {
      setActiveTab(tab)
    }
  }, [searchParams])

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold">SyncCare360</span>
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              SyncCare360 has transformed the way I provide healthcare. Its intuitive and streamlined
            </p>
            <footer className="text-sm">Sofia Davis - Registered Nurse</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Nurse Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your nurse account or create a new one
            </p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Enter your email and password to sign in to your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <NurseLoginForm callbackUrl={callbackUrl} />
                </CardContent>
                <CardFooter className="flex flex-col items-center">
                  <div className="text-sm text-muted-foreground mt-2">
                    Donot have an account?{" "}
                    <Button variant="link" className="p-0" onClick={() => setActiveTab("signup")}>
                      Create one
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Enter your information to create a nurse account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <NurseSignUpForm callback={callbackUrl} />
                </CardContent>
                <CardFooter className="flex flex-col items-center">
                  <div className="text-sm text-muted-foreground mt-2">
                    Already have an account?{" "}
                    <Button variant="link" className="p-0" onClick={() => setActiveTab("login")}>
                      Login
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
} 