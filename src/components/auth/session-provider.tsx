"use client"

import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

interface AuthSessionProviderProps {
  children: React.ReactNode
  session?: Session | null
}

/**
 * Client-side session provider for Auth.js
 * Wraps the application to provide session context to all components
 */
export function AuthSessionProvider({ children, session }: AuthSessionProviderProps) {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  )
}