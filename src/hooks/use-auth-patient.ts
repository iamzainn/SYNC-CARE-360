"use client"

import { getSession } from "next-auth/react"
import { useEffect, useState } from "react"


interface AuthUser {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAuthPatient() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();
        
        if (session?.user && session.user.role === "PATIENT") {
          setAuthState({
            user: {
              id: session.user.id,
              name: session.user.name || "",
              email: session.user.email || "",
              phone: session.user.email || "",
              address: session.user.email || ""
            },
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Auth error:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    fetchSession();
  }, []);

  return authState;
}