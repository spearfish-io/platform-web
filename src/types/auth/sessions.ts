/**
 * Authentication Session Types
 * 
 * Type definitions for user sessions, tokens, and authentication state
 * Compatible with Auth.js and Spearfish authentication systems
 */

import type { DefaultSession, DefaultUser } from "next-auth"

/**
 * Extended user type for Spearfish platform
 * Includes tenant information and role-based access control
 */
export interface SpearfishUser extends DefaultUser {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  userName?: string
  primaryTenantId: number
  tenantMemberships: number[]
  roles: string[]
  authType: 'oidc' | 'credentials' | 'google' | 'mock'
  image?: string
}

/**
 * Extended session type for Spearfish platform
 * Includes tenant context and simplified access to user properties
 */
export interface SpearfishSession extends DefaultSession {
  user: SpearfishUser
  tenantId: number
  roles: string[]
  authType: string
}

/**
 * Authentication state for components
 */
export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: SpearfishUser | null
  session: SpearfishSession | null
  error: string | null
}

/**
 * Login form data structure
 */
export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * Authentication error with context
 */
export interface AuthError {
  code: string
  message: string
  description?: string
  field?: keyof LoginFormData
  retryable?: boolean
}

/**
 * Authentication monitoring data
 */
export interface AuthMetrics {
  loginAttempts: number
  successfulLogins: number
  failedLogins: number
  lockouts: number
  averageLoginTime: number
  lastLoginAttempt: Date | null
  lastSuccessfulLogin: Date | null
}