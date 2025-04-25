'use client'

import { useEffect, useState } from 'react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { redirect } from 'next/navigation'

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await getSession()
        
        if (!session) {
          // No session, redirect to login
          router.push('/patient/auth')
          return
        }

        // Set the user role
        setUserRole(session.user?.role || null)
        setIsLoading(false)
      } catch (error) {
        console.error('Auth check error:', error)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    )
  }

  if (userRole === 'DOCTOR') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Doctor Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            This services section is only available for patients.
            As a doctor, you have access to different functionality in your dashboard.
          </p>
          <button 
            onClick={() => router.push('/doctor/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Doctor Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 