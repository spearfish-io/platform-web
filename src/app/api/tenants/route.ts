import { NextRequest, NextResponse } from 'next/server'
import { getAuthMode } from '@/lib/auth-mode'

/**
 * Tenants API Route
 * 
 * Provides tenant information for the current user
 * In legacy mode, proxies to the Server/api_server
 * In OIDC mode, would integrate with the platform-api tenant endpoints
 */
export async function GET(request: NextRequest) {
  try {
    const authMode = getAuthMode()
    console.log(`🔧 Tenants request in auth mode: ${authMode}`)
    
    if (authMode === 'legacy') {
      return handleLegacyTenants(request)
    } else {
      // OIDC mode - would integrate with platform-api
      return NextResponse.json(
        { error: 'Tenant listing not yet implemented for OIDC mode' },
        { status: 501 }
      )
    }
    
  } catch (error) {
    console.error('🔥 Tenants API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Handle legacy tenant listing (proxy to Server/api_server)
 */
async function handleLegacyTenants(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || ''
  
  // In legacy mode, we need to get tenant information from the session data
  // Since the legacy API doesn't have a dedicated tenants endpoint,
  // we'll extract tenant information from the user session
  
  try {
    // First get the current session to see what tenants the user has access to
    const sessionUrl = `${baseUrl}/api/auth/session`
    const cookieHeader = request.headers.get('cookie') || ''
    
    console.log('🔥 Fetching legacy session for tenant info from:', sessionUrl)
    
    const response = await fetch(sessionUrl, {
      headers: {
        'Accept': 'application/json',
        'Cookie': cookieHeader,
      },
    })
    
    if (!response.ok) {
      console.error('🔥 Legacy session fetch failed:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to fetch session' },
        { status: response.status }
      )
    }
    
    const sessionData = await response.json()
    console.log('🔥 Legacy session data received for tenants:', {
      tenantId: sessionData.tenantId,
      tenantName: sessionData.tenantName,
      tenantMemberships: sessionData.tenantMemberships,
      roles: sessionData.roles
    })
    
    // The legacy API might have different tenant endpoints, let's try multiple approaches
    const potentialTenantEndpoints = [
      `${baseUrl}/api/tenants`,
      `${baseUrl}/api/user/tenants`,
      `${baseUrl}/api/auth/tenants`,
    ]
    
    for (const tenantsUrl of potentialTenantEndpoints) {
      try {
        console.log('🔥 Trying tenant endpoint:', tenantsUrl)
        
        const tenantsResponse = await fetch(tenantsUrl, {
          headers: {
            'Accept': 'application/json',
            'Cookie': cookieHeader,
          },
        })
        
        if (tenantsResponse.ok) {
          const tenantsData = await tenantsResponse.json()
          console.log('🔥 Tenants data received from', tenantsUrl, ':', tenantsData)
          
          // If we get tenant data from the dedicated endpoint, use that
          if (Array.isArray(tenantsData) && tenantsData.length > 0) {
            return NextResponse.json(tenantsData.map((tenant: any) => ({
              id: tenant.id || tenant.tenantId,
              name: tenant.name || tenant.tenantName,
              type: tenant.type || 'Unknown',
              description: tenant.description || ''
            })))
          }
        } else {
          console.warn('🔥 Tenant endpoint not available:', tenantsUrl, tenantsResponse.status)
        }
      } catch (error) {
        console.warn('🔥 Failed to fetch from tenant endpoint:', tenantsUrl, error)
      }
    }
    
    // Fallback: Extract what we can from session data
    const tenants = []
    
    // Add current tenant
    if (sessionData.tenantId && sessionData.tenantName) {
      tenants.push({
        id: sessionData.tenantId,
        name: sessionData.tenantName,
        type: 'Unknown', // Legacy API doesn't provide tenant type in session
        description: ''
      })
    }
    
    // Parse tenant memberships if available
    // Note: The legacy API session typically only returns tenant IDs in memberships,
    // not the full tenant details. We would need additional API calls to get names.
    if (sessionData.tenantMemberships && typeof sessionData.tenantMemberships === 'string') {
      const membershipIds = sessionData.tenantMemberships.split(',').map((id: string) => parseInt(id.trim()))
      console.log('🔥 Found tenant memberships:', membershipIds)
      
      // For each membership ID that's not the current tenant, we'd need to fetch tenant details
      // This is a limitation of the legacy API structure
      membershipIds.forEach((tenantId: number) => {
        if (tenantId !== sessionData.tenantId && !tenants.find(t => t.id === tenantId)) {
          tenants.push({
            id: tenantId,
            name: `Tenant ${tenantId}`, // We don't have the name without additional API calls
            type: 'Unknown',
            description: 'Tenant details not available from session'
          })
        }
      })
    }
    
    console.log('🔥 Returning tenant list:', tenants)
    return NextResponse.json(tenants)
    
  } catch (error) {
    console.error('🔥 Legacy tenants fetch error:', error)
    return NextResponse.json(
      { 
        error: 'Network error',
        message: 'Unable to connect to authentication server. Please try again.'
      },
      { status: 500 }
    )
  }
}