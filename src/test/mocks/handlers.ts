import { http, HttpResponse } from 'msw'

// Mock API handlers for testing
export const handlers = [
  // Mock user API endpoints
  http.get('http://localhost:3001/api/users', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'admin',
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'user',
        createdAt: '2024-01-02T00:00:00Z',
      },
    ])
  }),

  http.get('http://localhost:3001/api/users/:id', ({ params }) => {
    const { id } = params
    return HttpResponse.json({
      id,
      name: id === '1' ? 'John Doe' : 'Jane Smith',
      email: id === '1' ? 'john.doe@example.com' : 'jane.smith@example.com',
      role: id === '1' ? 'admin' : 'user',
      createdAt: '2024-01-01T00:00:00Z',
    })
  }),

  http.post('http://localhost:3001/api/users', async ({ request }) => {
    const userData = await request.json()
    return HttpResponse.json(
      {
        id: '3',
        ...userData,
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    )
  }),

  // Mock analytics API endpoints
  http.get('http://localhost:3001/api/analytics/overview', () => {
    return HttpResponse.json({
      totalUsers: 1234,
      activeUsers: 456,
      revenue: 78900,
      conversionRate: 3.2,
      growth: {
        users: 12.5,
        revenue: 8.3,
        conversion: -2.1,
      },
    })
  }),

  http.get('http://localhost:3001/api/analytics/charts/:type', ({ params }) => {
    const { type } = params
    
    if (type === 'users') {
      return HttpResponse.json({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [120, 150, 180, 220, 260, 290],
      })
    }
    
    if (type === 'revenue') {
      return HttpResponse.json({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [12000, 15000, 18000, 22000, 26000, 29000],
      })
    }
    
    return HttpResponse.json({ labels: [], data: [] })
  }),

  // Mock Spearfish platform-api authentication endpoints
  http.post('http://localhost:5000/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as any
    
    console.log('🔥 MSW intercepted auth request:', { email, hasPassword: !!password })
    
    // Admin test credentials (matches simplified form validation)
    if (email === 'admin@spearfish.io' && password === 'password123') {
      return HttpResponse.json({
        success: true,
        user: {
          id: 'user-123-456-789',
          email: 'admin@spearfish.io',
          fullName: 'John Admin',
          firstName: 'John',
          lastName: 'Admin',
          userName: 'jadmin',
          primaryTenantId: 1,
          tenantMemberships: [1, 2, 3],
          roles: ['GlobalAdminRole', 'TenantAdminRole'],
          authType: 'Password',
        },
        message: 'Authentication successful'
      })
    }
    
    // Regular user test credentials
    if (email === 'user@spearfish.io' && password === 'user123456') {
      return HttpResponse.json({
        success: true,
        user: {
          id: 'user-456-789-123',
          email: 'user@spearfish.io',
          fullName: 'Jane User',
          firstName: 'Jane',
          lastName: 'User',
          userName: 'juser',
          primaryTenantId: 1,
          tenantMemberships: [1],
          roles: ['TenantUserRole'],
          authType: 'Password',
        },
        message: 'Authentication successful'
      })
    }
    
    // Test user with simple credentials
    if (email === 'test@example.com' && password === 'test12345') {
      return HttpResponse.json({
        success: true,
        user: {
          id: 'user-789-123-456',
          email: 'test@example.com',
          fullName: 'Test User',
          firstName: 'Test',
          lastName: 'User',
          userName: 'testuser',
          primaryTenantId: 2,
          tenantMemberships: [2],
          roles: ['TenantUserRole'],
          authType: 'Password',
        },
        message: 'Authentication successful'
      })
    }
    
    // Invalid credentials
    console.log('🔥 MSW returning auth failure for:', email)
    return HttpResponse.json(
      { 
        success: false,
        error: 'Invalid credentials',
        message: 'Invalid email or password. Please check your credentials and try again.'
      },
      { status: 401 }
    )
  }),

  // Mock other Spearfish API endpoints
  http.get('http://localhost:5000/api/auth/session', () => {
    return HttpResponse.json({
      user: {
        id: 'user-123-456-789',
        email: 'admin@spearfish.io',
        fullName: 'John Admin',
        firstName: 'John',
        lastName: 'Admin',
        userName: 'jadmin',
        primaryTenantId: 1,
        tenantMemberships: [1, 2, 3],
        roles: ['GlobalAdminRole', 'TenantAdminRole'],
        authType: 'Password',
      },
      isAuthenticated: true,
      tenantId: 1,
      version: {
        api: '1.0.0',
        build: 'mock-msw'
      }
    })
  }),

  http.post('http://localhost:5000/api/auth/logout', () => {
    console.log('🔥 MSW intercepted logout request')
    return HttpResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    })
  }),

  // Platform-web internal API route (this calls the above mock)
  http.post('http://localhost:3001/api/auth/login', async ({ request }) => {
    const credentials = await request.json() as any
    
    console.log('🔥 MSW intercepted platform-web API route:', credentials.email)
    
    // This would normally proxy to platform-api, but we'll handle it directly
    if (credentials.email === 'admin@spearfish.io' && credentials.password === 'password123') {
      return HttpResponse.json({
        success: true,
        user: {
          id: 'user-123-456-789',
          email: 'admin@spearfish.io',
          fullName: 'John Admin',
          firstName: 'John',
          lastName: 'Admin',
          userName: 'jadmin',
          primaryTenantId: 1,
          tenantMemberships: [1, 2, 3],
          roles: ['GlobalAdminRole', 'TenantAdminRole'],
          authType: 'Password',
        },
        message: 'Authentication successful'
      })
    }
    
    return HttpResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    )
  }),

  http.post('http://localhost:3001/api/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),

  // Mock settings endpoints
  http.get('http://localhost:3001/api/settings', () => {
    return HttpResponse.json({
      theme: 'light',
      notifications: true,
      analytics: true,
      language: 'en',
    })
  }),

  http.put('http://localhost:3001/api/settings', async ({ request }) => {
    const settings = await request.json()
    return HttpResponse.json({
      ...settings,
      updatedAt: new Date().toISOString(),
    })
  }),

  // Error simulation handlers
  http.get('http://localhost:3001/api/error/500', () => {
    return HttpResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }),

  http.get('http://localhost:3001/api/error/404', () => {
    return HttpResponse.json(
      { error: 'Not Found' },
      { status: 404 }
    )
  }),

  http.get('http://localhost:3001/api/error/timeout', () => {
    // Simulate a timeout by delaying the response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json({ error: 'Timeout' }, { status: 408 }))
      }, 5000)
    })
  }),
]