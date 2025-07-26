import { NextRequest, NextResponse } from 'next/server'

/**
 * Login API Route
 * 
 * Proxies authentication requests to the Spearfish API server
 * to handle CORS and authentication flow properly.
 */
export async function POST(request: NextRequest) {
  try {
    const credentials = await request.json()
    
    // Call the actual Spearfish API server
    const spearfishApiUrl = `${process.env.NEXT_PUBLIC_API_URL}api/auth/login?useCookies=true&useSessionCookies=true`
    
    console.log('🔥 Proxying login request to:', spearfishApiUrl)
    console.log('🔥 Credentials:', { email: credentials.email, hasPassword: !!credentials.password })
    
    const response = await fetch(spearfishApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    
    console.log('🔥 Spearfish API response:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('🔥 Login failed:', errorText)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: response.status }
      )
    }
    
    const result = await response.json()
    console.log('🔥 Login successful')
    
    // Forward the response from Spearfish API
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('🔥 Login API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}