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

  // Mock authentication endpoints
  http.post('http://localhost:3001/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as any
    
    if (email === 'admin@example.com' && password === 'password') {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
      })
    }
    
    return HttpResponse.json(
      { error: 'Invalid credentials' },
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