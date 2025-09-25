import { NextRequest, NextResponse } from 'next/server'
import { getAuthMode } from '@/lib/auth-mode'

/**
 * Session API Route
 * 
 * Handles session requests for:
 * - Legacy authentication (proxy to Server/api_server)
 * - OAuth authentication (handled by NextAuth.js)
 * - Mock authentication (server-side mock responses)
 */
export async function GET(request: NextRequest) {
  try {
    const authMode = getAuthMode()
    console.log(`🔧 Session request for auth mode: ${authMode}`)
    
    if (authMode === 'legacy') {
      return handleLegacySession(request)
    } else if (authMode === 'mock') {
      return handleMockSession(request)
    } else {
      // For OAuth modes, NextAuth.js handles sessions
      return NextResponse.json(
        { error: 'Use NextAuth.js for OAuth session management' },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('🔥 Session API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Handle legacy session requests (proxy to Server/api_server)
 */
async function handleLegacySession(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || ''
  const legacySessionUrl = `${baseUrl}/api/auth/session`
  
  console.log('🔥 Proxying legacy session request to:', legacySessionUrl)
  
  try {
    // Forward all cookies from the incoming request (portal-spearfish pattern)
    const cookieHeader = request.headers.get('cookie') || ''
    
    console.log('🍪 Request cookies available:', cookieHeader ? 'Yes' : 'No')
    console.log('🍪 Cookie header length:', cookieHeader.length)
    console.log('🍪 Contains .Spearfish.Identity:', cookieHeader.includes('.Spearfish.Identity'))
    if (cookieHeader.includes('.Spearfish.Identity')) {
      const identityMatch = cookieHeader.match(/\.Spearfish\.Identity=([^;]+)/)
      console.log('🍪 .Spearfish.Identity cookie found:', identityMatch ? 'Yes' : 'No')
      if (identityMatch) {
        console.log('🍪 .Spearfish.Identity length:', identityMatch[1].length)
      }
    }
    
    // Forward query parameters (e.g., time since last activity)
    const url = new URL(legacySessionUrl)
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value)
    })
    
    console.log('🔥 Final URL with params:', url.toString())
    console.log('🔥 Sending cookie header:', cookieHeader ? `${cookieHeader.slice(0, 50)}...` : 'None')
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cookie': cookieHeader,
      },
    })
    
    console.log('🔥 Legacy session response:', response.status, response.statusText)
    
    if (!response.ok) {
      console.error('🔥 Legacy session failed:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Session validation failed' },
        { status: response.status }
      )
    }
    
    const sessionData = await response.json()
    console.log('🔥 Legacy session successful')
    
    return NextResponse.json(sessionData)
  } catch (error) {
    console.error('🔥 Legacy session fetch error:', error)
    return NextResponse.json(
      { 
        error: 'Network error',
        message: 'Unable to connect to authentication server. Please try again.'
      },
      { status: 500 }
    )
  }
}

/**
 * Handle mock session requests
 */
async function handleMockSession(request: NextRequest) {
  // For mock mode, we don't have real sessions
  // Return a generic error to indicate no session
  console.log('🔥 Mock session request - no session available')
  return NextResponse.json(
    { error: 'No session available in mock mode' },
    { status: 401 }
  )
}