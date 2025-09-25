/**
 * Tenant Types for Platform Web
 * Based on the Spearfish platform tenant system
 */

export type TenantType = 
  | 'CustomerProduction'
  | 'CustomerSandbox'
  | 'Development'
  | 'SalesDemo'

// Display names for tenant types
export const TENANT_TYPE_DISPLAY_NAMES: Record<TenantType, string> = {
  'CustomerProduction': 'Production',
  'CustomerSandbox': 'Sandbox',
  'Development': 'Development',
  'SalesDemo': 'Demo'
}

export interface Tenant {
  id: number
  name: string
  description?: string
  type: TenantType | string
}

export interface TenantSwitchResponse {
  success: boolean
  tenantId?: number
  tenantName?: string
  roles?: string[]
  error?: string
}