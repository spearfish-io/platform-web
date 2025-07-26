import { NextRequest, NextResponse } from 'next/server'
import { isUsingMockAuth } from '@/lib/auth-mode'

/**
 * Login API Route
 * 
 * Handles authentication requests either through mocks or by proxying 
 * to the Spearfish API server based on authentication mode.
 */
export async function POST(request: NextRequest) {
  try {
    const credentials = await request.json()
    console.log('🔥 Login request received:', { email: credentials.email, hasPassword: !!credentials.password })
    
    // Check authentication mode
    if (isUsingMockAuth()) {
      console.log('🔧 Using mock authentication')
      return handleMockAuthentication(credentials)
    } else {
      console.log('🔗 Proxying to real platform-api')
      return handleRealAuthentication(credentials)
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
      password: 'password123',
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
      password: 'user123456',
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
      password: 'test12345',
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
 * Handle real authentication (proxy to platform-api)
 */
async function handleRealAuthentication(credentials: any) {
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
  
  console.log('🔥 Platform-api response:', response.status, response.statusText)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('🔥 Platform-api login failed:', errorText)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: response.status }
    )
  }
  
  const result = await response.json()
  console.log('🔥 Platform-api login successful')
  
  // Forward the response from Spearfish API
  return NextResponse.json(result)
}