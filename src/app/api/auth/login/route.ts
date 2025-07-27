import { NextRequest, NextResponse } from 'next/server'
import { isUsingMockAuth, isUsingLegacyAuth, getAuthMode } from '@/lib/auth-mode'

/**
 * Login API Route
 * 
 * Handles authentication requests through:
 * - Mock authentication (MSW test credentials)
 * - OAuth platform-api (modern OAuth 2.0)
 * - Legacy authentication (cookie-based portal-spearfish style)
 */
export async function POST(request: NextRequest) {
  try {
    const credentials = await request.json()
    console.log('🔥 Login request received:', { email: credentials.email, hasPassword: !!credentials.password })
    
    const authMode = getAuthMode()
    console.log(`🔧 Authentication mode: ${authMode}`)
    
    // Route to appropriate authentication handler
    switch (authMode) {
      case 'mock':
        console.log('🔧 Using mock authentication')
        return handleMockAuthentication(credentials)
      
      case 'legacy':
        console.log('🍪 Using legacy cookie-based authentication')
        return handleLegacyAuthentication(credentials, request)
      
      case 'oauth':
      default:
        console.log('🔗 Using OAuth 2.0 platform-api')
        return handleOAuthAuthentication(credentials)
    }
    
  } catch (error) {
    console.error('🔥 Login API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Handle mock authentication (server-side mock responses)
 */
async function handleMockAuthentication(credentials: any) {
  const { email, password } = credentials
  
  // Mock user database
  const mockUsers = [
    {
      id: 'user-123-456-789',
      email: 'admin@spearfish.io',
      password: 'Password123!',
      fullName: 'John Admin',
      firstName: 'John',
      lastName: 'Admin',
      userName: 'jadmin',
      primaryTenantId: 1,
      tenantMemberships: [1, 2, 3],
      roles: ['GlobalAdminRole', 'TenantAdminRole'],
      authType: 'Password',
    },
    {
      id: 'user-456-789-123',
      email: 'user@spearfish.io',
      password: 'UserPass123!',
      fullName: 'Jane User',
      firstName: 'Jane',
      lastName: 'User',
      userName: 'juser',
      primaryTenantId: 1,
      tenantMemberships: [1],
      roles: ['TenantUserRole'],
      authType: 'Password',
    },
    {
      id: 'user-789-123-456',
      email: 'test@example.com',
      password: 'TestPass123!',
      fullName: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      userName: 'testuser',
      primaryTenantId: 2,
      tenantMemberships: [2],
      roles: ['TenantUserRole'],
      authType: 'Password',
    }
  ]
  
  // Find user by email
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
  
  if (!user) {
    console.log('🔥 Mock auth: User not found')
    return NextResponse.json(
      { 
        success: false,
        error: 'Invalid credentials',
        message: 'Invalid email or password. Please check your credentials and try again.'
      },
      { status: 401 }
    )
  }
  
  if (user.password !== password) {
    console.log('🔥 Mock auth: Invalid password')
    return NextResponse.json(
      { 
        success: false,
        error: 'Invalid credentials',
        message: 'Invalid email or password. Please check your credentials and try again.'
      },
      { status: 401 }
    )
  }
  
  // Return user without password
  const { password: _, ...safeUser } = user
  console.log('🔥 Mock auth: Success for', email)
  
  return NextResponse.json({
    success: true,
    user: safeUser,
    message: 'Authentication successful'
  })
}

/**
 * Handle OAuth authentication (proxy to platform-api)
 */
async function handleOAuthAuthentication(credentials: any) {
  const platformApiUrl = `${process.env.NEXT_PUBLIC_API_URL}api/auth/login?useCookies=true&useSessionCookies=true`
  
  console.log('🔥 Proxying OAuth login request to:', platformApiUrl)
  console.log('🔥 Credentials:', { email: credentials.email, hasPassword: !!credentials.password })
  
  const response = await fetch(platformApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(credentials),
  })
  
  console.log('🔥 Platform-api response:', response.status, response.statusText)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('🔥 Platform-api login failed:', errorText)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: response.status }
    )
  }
  
  // Get response data - handle empty response from cookie-based auth
  let result: any = {}
  const responseText = await response.text()
  
  if (responseText && responseText.trim()) {
    try {
      result = JSON.parse(responseText)
    } catch (parseError) {
      console.log('🔥 Platform-api returned non-JSON response (likely empty - normal for cookie auth)')
    }
  } else {
    console.log('🔥 Platform-api returned empty response (normal for cookie-based auth)')
  }
  
  console.log('🔥 Platform-api login successful')
  
  // For OAuth mode using legacy endpoint, create minimal response
  return NextResponse.json({
    success: true,
    user: result.user || {
      // Minimal user data - the real data will be in the cookie claims
      email: credentials.email,
      authType: 'Password'
    },
    message: 'Authentication successful'
  })
}

/**
 * Handle legacy authentication (cookie-based portal-spearfish style)
 */
async function handleLegacyAuthentication(credentials: any, request: NextRequest) {
  const legacyApiUrl = `${process.env.NEXT_PUBLIC_API_URL}api/auth/login?useCookies=true`
  
  console.log('🔥 Proxying legacy login request to:', legacyApiUrl)
  console.log('🔥 Credentials:', { email: credentials.email, hasPassword: !!credentials.password })
  
  // Forward all cookies from the incoming request
  const cookieHeader = request.headers.get('cookie') || ''
  
  const response = await fetch(legacyApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': cookieHeader,
    },
    body: JSON.stringify(credentials),
    // Important: Don't use credentials: 'include' here as we're manually forwarding cookies
  })
  
  console.log('🔥 Legacy API response:', response.status, response.statusText)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('🔥 Legacy API login failed:', errorText)
    return NextResponse.json(
      { 
        success: false,
        error: 'Authentication failed',
        message: 'Invalid email or password. Please check your credentials and try again.'
      },
      { status: response.status }
    )
  }
  
  // Get response data - handle empty response from cookie-based auth
  let result: any = {}
  const responseText = await response.text()
  
  if (responseText && responseText.trim()) {
    try {
      result = JSON.parse(responseText)
    } catch (parseError) {
      console.log('🔥 Legacy API returned non-JSON response (likely empty - normal for cookie auth)')
    }
  } else {
    console.log('🔥 Legacy API returned empty response (normal for cookie-based auth)')
  }
  
  console.log('🔥 Legacy API login successful')
  
  // Create response and forward Set-Cookie headers
  // For legacy cookie auth, we create a minimal user object from what we can infer
  const nextResponse = NextResponse.json({
    success: true,
    user: result.user || {
      // Minimal user data - the real data will be in the cookie claims
      email: credentials.email,
      authType: 'Password'
    },
    message: 'Authentication successful'
  })
  
  // Forward all Set-Cookie headers from the legacy API
  const setCookieHeaders = response.headers.getSetCookie()
  if (setCookieHeaders && setCookieHeaders.length > 0) {
    setCookieHeaders.forEach(cookie => {
      nextResponse.headers.append('Set-Cookie', cookie)
    })
    console.log('🍪 Forwarded cookies:', setCookieHeaders.length)
  }
  
  return nextResponse
}