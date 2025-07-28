import { auth } from "@/lib/auth"
import { env } from "@/lib/env"
import { SpearfishRoles, type SpearfishRoleType, type RoleHelper } from "@/types/auth"

/**
 * Server-side utility to get the current session
 */
export async function getCurrentSession() {
  return await auth()
}

/**
 * Server-side utility to get the current user
 */
export async function getCurrentUser() {
  const session = await getCurrentSession()
  return session?.user || null
}

/**
 * Server-side utility to check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession()
  return !!session?.user
}

/**
 * Server-side utility to require authentication
 * Throws an error if user is not authenticated
 */
export async function requireAuth() {
  const session = await getCurrentSession()
  if (!session?.user) {
    throw new Error("Authentication required")
  }
  return session
}

/**
 * Create role helper utilities for a user's roles
 */
export function createRoleHelper(userRoles: string[] = []): RoleHelper {
  return {
    hasRole: (role: SpearfishRoleType) => userRoles.includes(role),
    
    hasAnyRole: (roles: SpearfishRoleType[]) => 
      roles.some(role => userRoles.includes(role)),
    
    isGlobalAdmin: () => userRoles.includes(SpearfishRoles.GLOBAL_ADMIN),
    
    isTenantAdmin: () => userRoles.includes(SpearfishRoles.TENANT_ADMIN),
    
    isTenantUser: () => userRoles.includes(SpearfishRoles.TENANT_USER),
  }
}

/**
 * Server-side utility to check user roles
 */
export async function hasRole(role: SpearfishRoleType): Promise<boolean> {
  const session = await getCurrentSession()
  const userRoles = session?.user?.roles || []
  return userRoles.includes(role)
}

/**
 * Server-side utility to check if user has any of the specified roles
 */
export async function hasAnyRole(roles: SpearfishRoleType[]): Promise<boolean> {
  const session = await getCurrentSession()
  const userRoles = session?.user?.roles || []
  return roles.some(role => userRoles.includes(role))
}

/**
 * Server-side utility to require specific role
 * Throws an error if user doesn't have the required role
 */
export async function requireRole(role: SpearfishRoleType) {
  const session = await requireAuth()
  const userRoles = session.user?.roles || []
  
  if (!userRoles.includes(role)) {
    throw new Error(`Required role: ${role}`)
  }
  
  return session
}

/**
 * Server-side utility to require any of the specified roles
 */
export async function requireAnyRole(roles: SpearfishRoleType[]) {
  const session = await requireAuth()
  const userRoles = session.user?.roles || []
  
  const hasRequiredRole = roles.some(role => userRoles.includes(role))
  if (!hasRequiredRole) {
    throw new Error(`Required one of roles: ${roles.join(", ")}`)
  }
  
  return session
}

/**
 * Server-side utility to check tenant access
 */
export async function hasTenantAccess(tenantId: number): Promise<boolean> {
  const session = await getCurrentSession()
  const tenantMemberships = session?.user?.tenantMemberships || []
  return tenantMemberships.includes(tenantId)
}

/**
 * Server-side utility to require tenant access
 */
export async function requireTenantAccess(tenantId: number) {
  const session = await requireAuth()
  const tenantMemberships = session.user?.tenantMemberships || []
  
  if (!tenantMemberships.includes(tenantId)) {
    throw new Error(`Access denied for tenant: ${tenantId}`)
  }
  
  return session
}

/**
 * Check if user is a global admin (has access to all tenants)
 */
export async function isGlobalAdmin(): Promise<boolean> {
  return await hasRole(SpearfishRoles.GLOBAL_ADMIN)
}

/**
 * Check if user is a tenant admin for their primary tenant
 */
export async function isTenantAdmin(): Promise<boolean> {
  return await hasRole(SpearfishRoles.TENANT_ADMIN)
}

/**
 * Get user's primary tenant ID
 */
export async function getPrimaryTenantId(): Promise<number | null> {
  const session = await getCurrentSession()
  return session?.user?.primaryTenantId || null
}

/**
 * Get user's tenant memberships
 */
export async function getTenantMemberships(): Promise<number[]> {
  const session = await getCurrentSession()
  return session?.user?.tenantMemberships || []
}

// OIDC-specific utilities for token management and validation

/**
 * Refresh an access token using the refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string
  expires_in: number
  refresh_token?: string
}> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}connect/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: 'platform-web',
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Token refresh failed: ${response.status} ${errorText}`)
  }

  return await response.json()
}

/**
 * Validate OIDC configuration endpoints
 */
export async function validateOIDCEndpoints(): Promise<{
  isValid: boolean
  errors: string[]
}> {
  const errors: string[] = []
  
  try {
    // Check discovery endpoint
    const discoveryResponse = await fetch(`${env.NEXT_PUBLIC_API_URL}.well-known/openid-configuration`)
    if (!discoveryResponse.ok) {
      errors.push(`Discovery endpoint failed: ${discoveryResponse.status}`)
    } else {
      const discovery = await discoveryResponse.json()
      
      // Validate required endpoints exist
      const requiredEndpoints = ['authorization_endpoint', 'token_endpoint', 'userinfo_endpoint']
      for (const endpoint of requiredEndpoints) {
        if (!discovery[endpoint]) {
          errors.push(`Missing ${endpoint} in discovery document`)
        }
      }
      
      // Validate PKCE support
      if (!discovery.code_challenge_methods_supported?.includes('S256')) {
        errors.push('PKCE S256 not supported')
      }
    }
  } catch (error) {
    errors.push(`Discovery endpoint error: ${error}`)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Get user display name from session
 */
export function getUserDisplayName(session: any): string {
  const user = session?.user
  if (!user) return 'Unknown User'
  
  if (user.name) return user.name
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`
  if (user.firstName) return user.firstName
  if (user.email) return user.email
  return 'User'
}

/**
 * Log authentication event for audit trail
 */
export function logAuthEvent(event: string, details: Record<string, any>): void {
  if (env.NODE_ENV === 'development') {
    console.log(`[AUTH_EVENT] ${event}:`, details)
  }
  
  // In production, this would send to audit logging service
  // Example: auditLogger.log({ event, ...details })
}