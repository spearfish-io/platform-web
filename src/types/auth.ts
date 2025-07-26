import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

/**
 * Spearfish User Types
 * Based on the Spearfish platform authentication system
 */

export interface SpearfishUser {
  id: string // User GUID from Spearfish
  email: string
  name: string
  firstName?: string
  lastName?: string
  userName?: string
  primaryTenantId: number
  tenantMemberships?: number[]
  roles?: string[]
  authType?: string
}

export interface SpearfishSession {
  user: SpearfishUser & DefaultSession["user"]
  tenantId: number
  roles: string[]
  tenantMemberships: number[]
  authType?: string
}

export interface SpearfishJWT extends DefaultJWT {
  id: string
  tenantId: number
  roles: string[]
  tenantMemberships: number[]
  authType?: string
  firstName?: string
  lastName?: string
  userName?: string
}

/**
 * Spearfish API Authentication Response
 * Based on the authentication response from the Spearfish API
 */
export interface SpearfishAuthResponse {
  success: boolean
  user?: {
    id: string
    email: string
    fullName: string
    firstName?: string
    lastName?: string
    userName?: string
    primaryTenantId: number
    tenantMemberships?: number[]
    roles?: string[]
    authType?: string
  }
  error?: string
  message?: string
}

/**
 * Authentication credentials for Spearfish login
 */
export interface SpearfishCredentials {
  email: string
  password: string
}

/**
 * Spearfish Role Constants
 * Based on SpearfishRolesConstants from the backend
 */
export const SpearfishRoles = {
  GLOBAL_ADMIN: "GlobalAdminRole",
  DEVOPS: "SpearfishDevOpsRole", 
  SALES_EMPLOYEE: "SpearfishSalesEmployeeRole",
  TENANT_ADMIN: "TenantAdminRole",
  TENANT_USER: "TenantUserRole",
} as const

export type SpearfishRoleType = typeof SpearfishRoles[keyof typeof SpearfishRoles]

/**
 * Helper types for role checking
 */
export interface RoleHelper {
  hasRole: (role: SpearfishRoleType) => boolean
  hasAnyRole: (roles: SpearfishRoleType[]) => boolean
  isGlobalAdmin: () => boolean
  isTenantAdmin: () => boolean
  isTenantUser: () => boolean
}

/**
 * Create role helper for checking user permissions
 */
export function createRoleHelper(userRoles: string[] = []): RoleHelper {
  return {
    hasRole: (role: SpearfishRoleType) => userRoles.includes(role),
    hasAnyRole: (roles: SpearfishRoleType[]) => roles.some(role => userRoles.includes(role)),
    isGlobalAdmin: () => userRoles.includes(SpearfishRoles.GLOBAL_ADMIN),
    isTenantAdmin: () => userRoles.includes(SpearfishRoles.TENANT_ADMIN),
    isTenantUser: () => userRoles.includes(SpearfishRoles.TENANT_USER),
  }
}

/**
 * Module augmentation for next-auth types
 */
declare module "next-auth" {
  interface Session extends SpearfishSession {}
  interface User extends SpearfishUser {}
}

declare module "next-auth/jwt" {
  interface JWT extends SpearfishJWT {}
}