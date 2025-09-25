/**
 * Authentication Provider Types
 * 
 * Type definitions for all authentication providers and their configurations
 * Supporting OIDC, Legacy credentials, and Mock authentication modes
 */

export type AuthMode = 'mock' | 'oauth' | 'legacy'

export interface OIDCProvider {
  id: string
  name: string
  type: 'oidc'
  issuer: string
  clientId: string
  clientSecret?: string
  scopes: string[]
  icon?: string
  description?: string
}

export interface CredentialsProvider {
  id: string
  name: string
  type: 'credentials'
  endpoint: string
  method: 'POST'
  icon?: string
  description?: string
}

export interface MockProvider {
  id: string
  name: string
  type: 'mock'
  icon?: string
  description?: string
  testCredentials?: MockCredentials[]
}

export interface MockCredentials {
  email: string
  password: string
  description: string
  user: {
    id: string
    email: string
    fullName: string
    firstName?: string
    lastName?: string
    userName?: string
    primaryTenantId: number
    tenantMemberships: number[]
    roles: string[]
    authType: string
  }
}

export interface ProviderConfig {
  oidc?: OIDCProvider[]
  credentials?: CredentialsProvider
  mock?: MockProvider
}

export interface AuthProviderButtonProps {
  provider: OIDCProvider | CredentialsProvider | MockProvider
  callbackUrl?: string
  disabled?: boolean
  loading?: boolean
  variant?: 'solid' | 'soft' | 'outline' | 'ghost'
  size?: '1' | '2' | '3' | '4'
  onClick?: (providerId: string) => void
}