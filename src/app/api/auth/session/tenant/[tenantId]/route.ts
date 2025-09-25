import { NextRequest, NextResponse } from 'next/server'
import { getAuthMode } from '@/lib/auth-mode'

/**
 * Tenant Switch API Route
 * 
 * Handles tenant switching for legacy authentication mode
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    const { tenantId } = await params
    const authMode = getAuthMode()
    console.log(`🔧 Tenant switch request for tenant ${tenantId} in auth mode: ${authMode}`)
    
    // Log current session before switch
    const currentSessionUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || ''}/api/auth/session`
    const cookieHeader = request.headers.get('cookie') || ''
    
    try {
      const currentSessionResponse = await fetch(currentSessionUrl, {
        headers: { 'Cookie': cookieHeader, 'Accept': 'application/json' }
      })
      if (currentSessionResponse.ok) {
        const currentSession = await currentSessionResponse.json()
        console.log(`🔧 Current session before switch:`, {
          currentTenantId: currentSession.tenantId,
          currentTenantName: currentSession.tenantName,
          targetTenantId: tenantId,
          tenantMemberships: currentSession.tenantMemberships
        })
      }
    } catch (error) {
      console.log(`🔧 Could not fetch current session:`, error)
    }
    
    if (authMode !== 'legacy') {
      return NextResponse.json(
        { error: 'Tenant switching only available in legacy mode' },
        { status: 400 }
      )
    }
    
    return handleLegacyTenantSwitch(request, tenantId)
    
  } catch (error) {
    console.error('🔥 Tenant switch API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Handle legacy tenant switching (proxy to Server/api_server)
 */
async function handleLegacyTenantSwitch(request: NextRequest, tenantId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || ''
  const legacyTenantUrl = `${baseUrl}/api/auth/session/tenant/${tenantId}`
  
  console.log('🔥 Proxying legacy tenant switch request to:', legacyTenantUrl)
  
  try {
    // Forward all cookies from the incoming request (portal-spearfish pattern)
    const cookieHeader = request.headers.get('cookie') || ''
    
    const response = await fetch(legacyTenantUrl, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Cookie': cookieHeader,
      },
    })
    
    console.log('🔥 Legacy tenant switch response:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('🔥 Legacy tenant switch failed:', response.status, response.statusText, errorText)
      return NextResponse.json(
        { error: 'Tenant switch failed', details: errorText },
        { status: response.status }
      )
    }
    
    const sessionData = await response.json()
    console.log('🔥 Legacy tenant switch successful - new session data:', {
      newTenantId: sessionData.tenantId,
      newTenantName: sessionData.tenantName,
      roles: sessionData.roles
    })
    
    // Create the response and forward any cookies from the backend
    const nextResponse = NextResponse.json(sessionData)
    
    // Forward any Set-Cookie headers from the backend to update the client's cookies
    const setCookieHeaders = response.headers.getSetCookie?.() || []
    setCookieHeaders.forEach(cookie => {
      nextResponse.headers.append('Set-Cookie', cookie)
    })
    
    if (setCookieHeaders.length > 0) {
      console.log('🔥 Forwarded', setCookieHeaders.length, 'Set-Cookie headers from backend')
    } else {
      console.log('🔥 No Set-Cookie headers received from backend - this might be the issue!')
    }
    
    return nextResponse
  } catch (error) {
    console.error('🔥 Legacy tenant switch fetch error:', error)
    return NextResponse.json(
      { 
        error: 'Network error',
        message: 'Unable to connect to authentication server. Please try again.'
      },
      { status: 500 }
    )
  }
}