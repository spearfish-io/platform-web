import * as React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Theme } from '@radix-ui/themes'

// Custom render function that includes Radix UI Theme provider
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Theme
      accentColor="blue"
      grayColor="slate"
      radius="medium"
      scaling="100%"
      appearance="light"
    >
      {children}
    </Theme>
  )

  return render(ui, { wrapper: Wrapper, ...options })
}

// Mock data generators for testing
export const createMockUser = (overrides = {}) => ({
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'user',
  createdAt: '2024-01-01T00:00:00Z',
  ...overrides,
})

export const createMockMetric = (overrides = {}) => ({
  id: '1',
  title: 'Test Metric',
  value: 100,
  ...overrides,
})

export const createMockAnalytics = (overrides = {}) => ({
  totalUsers: 1234,
  activeUsers: 456,
  revenue: 78900,
  conversionRate: 3.2,
  growth: {
    users: 12.5,
    revenue: 8.3,
    conversion: -2.1,
  },
  ...overrides,
})

// Wait utilities for async operations
export const waitFor = (condition: () => boolean, timeout = 1000): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    
    const check = () => {
      if (condition()) {
        resolve()
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'))
      } else {
        setTimeout(check, 10)
      }
    }
    
    check()
  })
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'

// Override the default render with our custom render
export { customRender as render }