import { NextRequest, NextResponse } from 'next/server'
import { getAuthMode } from '@/lib/auth-mode'

/**
 * Password Reset Email API Route
 * 
 * Handles password reset email requests for legacy authentication mode
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    const authMode = getAuthMode()
    console.log(`🔧 Password reset email request for auth mode: ${authMode}`)
    
    if (authMode !== 'legacy') {
      return NextResponse.json(
        { error: 'Password reset only available in legacy mode' },
        { status: 400 }
      )
    }
    
    return handleLegacyPasswordResetEmail(request, email)
    
  } catch (error) {
    console.error('🔥 Password reset email API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Handle legacy password reset email (proxy to Server/api_server)
 */
async function handleLegacyPasswordResetEmail(request: NextRequest, email: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || ''
  const legacyResetUrl = `${baseUrl}/api/auth/password/resetemail`
  
  console.log('🔥 Proxying legacy password reset email request to:', legacyResetUrl)
  
  try {
    // Forward all cookies from the incoming request (portal-spearfish pattern)
    const cookieHeader = request.headers.get('cookie') || ''
    
    const response = await fetch(legacyResetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify({ email }),
    })
    
    console.log('🔥 Legacy password reset email response:', response.status, response.statusText)
    
    if (!response.ok) {
      console.error('🔥 Legacy password reset email failed:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Password reset email failed' },
        { status: response.status }
      )
    }
    
    console.log('🔥 Legacy password reset email successful')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('🔥 Legacy password reset email fetch error:', error)
    return NextResponse.json(
      { 
        error: 'Network error',
        message: 'Unable to connect to authentication server. Please try again.'
      },
      { status: 500 }
    )
  }
}