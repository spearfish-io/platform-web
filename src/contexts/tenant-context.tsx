'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import type { Tenant } from '@/types/tenant'
import type { SpearfishSession } from '@/types/auth'

interface TenantContextType {
  tenants: Tenant[]
  currentTenantId?: number
  currentTenant?: Tenant
  isLoading: boolean
  isSwitching: boolean
  switchTenant: (tenantId: number) => Promise<void>
  refreshTenants: () => Promise<void>
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

interface TenantProviderProps {
  children: ReactNode
}

export function TenantProvider({ children }: TenantProviderProps) {
  const { data: session, status } = useSession() as { 
    data: SpearfishSession | null
    status: 'loading' | 'authenticated' | 'unauthenticated' 
  }
  
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSwitching, setIsSwitching] = useState(false)
  
  const currentTenantId = session?.tenantId
  const currentTenant = tenants.find(t => t.id === currentTenantId)
  
  const fetchTenants = useCallback(async () => {
    if (status !== 'authenticated') {
      setTenants([])
      setIsLoading(false)
      return
    }
    
    try {
      setIsLoading(true)
      const response = await fetch('/api/tenants', {
        credentials: 'include'
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated, clear tenants
          setTenants([])
          return
        }
        throw new Error(`Failed to fetch tenants: ${response.status}`)
      }
      
      const tenantsData = await response.json()
      setTenants(tenantsData)
    } catch (error) {
      console.error('Failed to fetch tenants:', error)
      // Don't clear tenants on network error, keep existing data
    } finally {
      setIsLoading(false)
    }
  }, [status])
  
  const switchTenant = useCallback(async (tenantId: number) => {
    console.log('🔄 Starting tenant switch from', session?.tenantId, 'to', tenantId)
    setIsSwitching(true)
    
    try {
      const response = await fetch(`/api/auth/session/tenant/${tenantId}`, {
        method: 'PUT',
        credentials: 'include',
      })
      
      console.log('🔄 Tenant switch response:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('🔥 Tenant switch failed:', errorText)
        throw new Error(`Failed to switch tenant: ${response.status} ${errorText}`)
      }
      
      const responseData = await response.json()
      console.log('🔄 Tenant switch response data:', responseData)
      
      // Add a small delay to ensure the cookie is set
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Verify the switch worked by checking session
      const verifyResponse = await fetch('/api/auth/session', {
        credentials: 'include'
      })
      
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json()
        console.log('🔄 Session verification after switch:', {
          oldTenantId: session?.tenantId,
          newTenantId: verifyData.tenantId,
          newTenantName: verifyData.tenantName
        })
        
        if (verifyData.tenantId === tenantId) {
          console.log('✅ Tenant switch successful, reloading page')
        } else {
          console.warn('⚠️ Tenant switch may have failed - expected', tenantId, 'but got', verifyData.tenantId)
        }
      }
      
      // Reload the page to update session context
      // In a more sophisticated setup, we could update the session in place
      window.location.reload()
    } catch (error) {
      console.error('🔥 Failed to switch tenant:', error)
      setIsSwitching(false) // Only set to false on error, success will reload
      throw error // Re-throw so components can handle the error
    }
  }, [session?.tenantId])
  
  // Fetch tenants when session changes
  useEffect(() => {
    if (status !== 'loading') {
      fetchTenants()
    }
  }, [fetchTenants, status])
  
  const value: TenantContextType = {
    tenants,
    currentTenantId,
    currentTenant,
    isLoading,
    isSwitching,
    switchTenant,
    refreshTenants: fetchTenants,
  }
  
  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenants() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenants must be used within a TenantProvider')
  }
  return context
}