import { describe, it, expect, beforeEach } from 'vitest'
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'

// Mock API client functions for testing
const API_BASE_URL = 'http://localhost:3001/api'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

interface Analytics {
  totalUsers: number
  activeUsers: number
  revenue: number
  conversionRate: number
  growth: {
    users: number
    revenue: number
    conversion: number
  }
}

// API client functions (these would normally be in a separate file)
export const apiClient = {
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`)
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`)
    }
    return response.json()
  },

  async getUser(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`)
    }
    return response.json()
  },

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.status}`)
    }
    return response.json()
  },

  async getAnalytics(): Promise<Analytics> {
    const response = await fetch(`${API_BASE_URL}/analytics/overview`)
    if (!response.ok) {
      throw new Error(`Failed to fetch analytics: ${response.status}`)
    }
    return response.json()
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`)
    }
    return response.json()
  },
}

describe('API Client Integration Tests', () => {
  describe('User API', () => {
    it('fetches all users successfully', async () => {
      const users = await apiClient.getUsers()
      
      expect(users).toHaveLength(2)
      expect(users[0]).toMatchObject({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'admin',
      })
      expect(users[1]).toMatchObject({
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'user',
      })
    })

    it('fetches a single user by ID', async () => {
      const user = await apiClient.getUser('1')
      
      expect(user).toMatchObject({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'admin',
      })
    })

    it('creates a new user successfully', async () => {
      const newUserData = {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        role: 'user',
      }

      const createdUser = await apiClient.createUser(newUserData)
      
      expect(createdUser).toMatchObject({
        id: '3',
        ...newUserData,
      })
      expect(createdUser.createdAt).toBeDefined()
    })

    it('handles user not found error', async () => {
      // Override the handler for this specific test
      server.use(
        http.get('http://localhost:3001/api/users/999', () => {
          return HttpResponse.json(
            { error: 'User not found' },
            { status: 404 }
          )
        })
      )

      await expect(apiClient.getUser('999')).rejects.toThrow('Failed to fetch user: 404')
    })
  })

  describe('Analytics API', () => {
    it('fetches analytics overview successfully', async () => {
      const analytics = await apiClient.getAnalytics()
      
      expect(analytics).toMatchObject({
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
    })
  })

  describe('Authentication API', () => {
    it('logs in successfully with valid credentials', async () => {
      const result = await apiClient.login('admin@example.com', 'password')
      
      expect(result).toMatchObject({
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
      })
    })

    it('fails login with invalid credentials', async () => {
      await expect(
        apiClient.login('wrong@example.com', 'wrongpassword')
      ).rejects.toThrow('Login failed: 401')
    })
  })

  describe('Error Handling', () => {
    it('handles 500 server errors', async () => {
      server.use(
        http.get('http://localhost:3001/api/users', () => {
          return HttpResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
          )
        })
      )

      await expect(apiClient.getUsers()).rejects.toThrow('Failed to fetch users: 500')
    })

    it('handles network errors', async () => {
      server.use(
        http.get('http://localhost:3001/api/users', () => {
          return HttpResponse.error()
        })
      )

      await expect(apiClient.getUsers()).rejects.toThrow()
    })
  })

  describe('Request/Response Formats', () => {
    it('sends proper JSON content-type headers', async () => {
      const newUserData = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      }

      // Create a spy to verify the request
      server.use(
        http.post('http://localhost:3001/api/users', async ({ request }) => {
          expect(request.headers.get('content-type')).toBe('application/json')
          
          const body = await request.json()
          expect(body).toEqual(newUserData)
          
          return HttpResponse.json({
            id: '4',
            ...newUserData,
            createdAt: new Date().toISOString(),
          })
        })
      )

      await apiClient.createUser(newUserData)
    })

    it('handles empty response bodies', async () => {
      server.use(
        http.get('http://localhost:3001/api/users', () => {
          return new HttpResponse(null, { status: 204 })
        })
      )

      // This should handle the empty response gracefully
      const response = await fetch(`${API_BASE_URL}/users`)
      expect(response.status).toBe(204)
    })
  })

  describe('Concurrent Requests', () => {
    it('handles multiple simultaneous requests', async () => {
      const promises = [
        apiClient.getUser('1'),
        apiClient.getUser('2'),
        apiClient.getAnalytics(),
      ]

      const results = await Promise.all(promises)
      
      expect(results).toHaveLength(3)
      expect(results[0].id).toBe('1')
      expect(results[1].id).toBe('2')
      expect(results[2].totalUsers).toBe(1234)
    })
  })
})