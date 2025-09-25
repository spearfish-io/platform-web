import { NextRequest, NextResponse } from 'next/server'
import { getAuthMode } from '@/lib/auth-mode'

/**
 * Logout API Route
 * 
 * Handles logout requests for both legacy and OAuth authentication modes
 */
export async function POST(request: NextRequest) {
  try {
    const authMode = getAuthMode()
    console.log(`🔥 Logout request received for auth mode: ${authMode}`)
    
    if (authMode === 'legacy') {
      return handleLegacyLogout(request)
    } else {
      // For OAuth modes, let NextAuth handle logout
      return NextResponse.json({
        success: true,
        message: 'Use NextAuth signOut() for OAuth modes'
      })
    }
    
  } catch (error) {
    console.error('🔥 Logout API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Handle legacy logout (proxy to Server/api_server)
 */
async function handleLegacyLogout(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || ''
  const legacyLogoutUrl = `${baseUrl}/api/auth/logout`
  
  console.log('🔥 Proxying legacy logout request to:', legacyLogoutUrl)
  
  try {
    // Forward all cookies from the incoming request
    const cookieHeader = request.headers.get('cookie') || ''
    
    const response = await fetch(legacyLogoutUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Cookie': cookieHeader,
      },
    })
    
    console.log('🔥 Legacy logout response:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('🔥 Legacy logout failed:', errorText)
      return NextResponse.json(
        { 
          success: false,
          error: 'Logout failed'
        },
        { status: response.status }
      )
    }
    
    console.log('🔥 Legacy logout successful')
    
    // Create response
    const nextResponse = NextResponse.json({
      success: true,
      message: 'Logout successful'
    })
    
    // Forward any Set-Cookie headers to clear cookies
    const setCookieHeaders = response.headers.getSetCookie()
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach(cookie => {
        nextResponse.headers.append('Set-Cookie', cookie)
      })
      console.log('🍪 Forwarded logout cookies:', setCookieHeaders.length)
    }
    
    return nextResponse
  } catch (error) {
    console.error('🔥 Legacy logout fetch error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Network error',
        message: 'Unable to connect to authentication server. Please try again.'
      },
      { status: 500 }
    )
  }
}
