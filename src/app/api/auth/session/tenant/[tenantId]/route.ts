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
      console.error('🔥 Legacy tenant switch failed:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Tenant switch failed' },
        { status: response.status }
      )
    }
    
    const sessionData = await response.json()
    console.log('🔥 Legacy tenant switch successful')
    
    return NextResponse.json(sessionData)
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