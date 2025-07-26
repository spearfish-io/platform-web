/**
 * Test Utilities for Platform Web
 * 
 * Provides consistent testing setup and utilities for all test files.
 * Implements enterprise testing standards with accessibility support.
 */

import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Theme } from '@radix-ui/themes'
import { vi } from 'vitest'

/**
 * Test Wrapper Component
 * 
 * Provides necessary context providers for components under test
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Theme>
      {children}
    </Theme>
  )
}

/**
 * Custom render function with providers
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything from React Testing Library
export * from '@testing-library/react'

// Override render method
export { customRender as render }

/**
 * Mock Next.js router
 */
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  route: '/',
}

/**
 * Mock Next.js navigation hooks
 */
export const mockNextNavigation = () => {
  vi.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    usePathname: () => '/',
    useSearchParams: () => ({
      get: vi.fn((key: string) => {
        const params: Record<string, string> = {
          callbackUrl: '/',
          error: null,
        }
        return params[key] || null
      }),
    }),
  }))
}

/**
 * Mock NextAuth
 */
export const mockNextAuth = () => {
  vi.mock('next-auth/react', () => ({
    signIn: vi.fn(),
    signOut: vi.fn(),
    useSession: () => ({
      data: null,
      status: 'unauthenticated',
    }),
    SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  }))
}

/**
 * Create mock user session
 */
export const createMockSession = (overrides = {}) => ({
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    userName: 'testuser',
    primaryTenantId: 1,
    tenantMemberships: [1],
    roles: ['TenantUser'],
    authType: 'credentials',
  },
  tenantId: 1,
  roles: ['TenantUser'],
  tenantMemberships: [1],
  authType: 'credentials',
  expires: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
  ...overrides,
})

/**
 * Mock window.matchMedia for responsive testing
 */
export const mockMatchMedia = (query: string, matches: boolean = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((q) => ({
      matches: q === query ? matches : false,
      media: q,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

/**
 * Mock IntersectionObserver for lazy loading tests
 */
export const mockIntersectionObserver = () => {
  global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
  }))
}

/**
 * Mock ResizeObserver for responsive component tests
 */
export const mockResizeObserver = () => {
  global.ResizeObserver = vi.fn().mockImplementation((callback) => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
}

/**
 * Setup function for authentication tests
 */
export const setupAuthTests = () => {
  mockNextNavigation()
  mockNextAuth()
  mockMatchMedia('(prefers-reduced-motion: reduce)')
  mockIntersectionObserver()
  mockResizeObserver()
}

/**
 * Cleanup function for tests
 */
export const cleanupTests = () => {
  vi.clearAllMocks()
  vi.restoreAllMocks()
}

/**
 * Wait for element to be removed helper
 */
export const waitForElementToBeRemoved = async (
  element: HTMLElement,
  timeout: number = 1000
) => {
  return new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Element was not removed within ${timeout}ms`))
    }, timeout)

    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        clearTimeout(timeoutId)
        observer.disconnect()
        resolve()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}

/**
 * Simulate keyboard navigation for accessibility tests
 */
export const simulateKeyboardNavigation = async (
  user: any,
  steps: string[]
) => {
  for (const step of steps) {
    switch (step) {
      case 'tab':
        await user.tab()
        break
      case 'shift+tab':
        await user.tab({ shift: true })
        break
      case 'enter':
        await user.keyboard('{Enter}')
        break
      case 'space':
        await user.keyboard('{Space}')
        break
      case 'escape':
        await user.keyboard('{Escape}')
        break
      case 'arrow-down':
        await user.keyboard('{ArrowDown}')
        break
      case 'arrow-up':
        await user.keyboard('{ArrowUp}')
        break
      default:
        await user.keyboard(step)
    }
  }
}

/**
 * Check if element has proper ARIA attributes
 */
export const expectAccessibleElement = (element: HTMLElement) => {
  // Check for basic accessibility attributes
  if (element.getAttribute('role') === 'button') {
    expect(element).toHaveAttribute('type')
  }
  
  if (element.tagName === 'INPUT') {
    expect(element).toHaveAttribute('id')
    const label = document.querySelector(`label[for="${element.id}"]`)
    expect(label).toBeInTheDocument()
  }
  
  // Check for ARIA properties
  const ariaInvalid = element.getAttribute('aria-invalid')
  if (ariaInvalid === 'true') {
    const describedBy = element.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    const errorElement = document.getElementById(describedBy!)
    expect(errorElement).toBeInTheDocument()
  }
}

/**
 * Test data generators
 */
export const testData = {
  validEmail: 'test@example.com',
  invalidEmail: 'invalid-email',
  validPassword: 'SecureP@ss123',
  weakPassword: 'weak',
  shortPassword: '123',
  longPassword: 'a'.repeat(130),
  
  validCredentials: {
    email: 'test@example.com',
    password: 'SecureP@ss123',
  },
  
  invalidCredentials: {
    email: 'invalid@example.com',
    password: 'WrongPassword123',
  },
}

/**
 * Performance testing helper
 */
export const measurePerformance = async (
  testFunction: () => Promise<void> | void
) => {
  const startTime = performance.now()
  await testFunction()
  const endTime = performance.now()
  return endTime - startTime
}

/**
 * Error testing helper
 */
export const expectErrorToBeHandled = async (
  errorFunction: () => Promise<void> | void,
  expectedError?: string
) => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  
  try {
    await errorFunction()
  } catch (error) {
    if (expectedError) {
      expect(error).toMatch(expectedError)
    }
  } finally {
    consoleSpy.mockRestore()
  }
}

/**
 * Accessibility testing helper
 */
export const expectAccessibilityCompliance = async (container: HTMLElement) => {
  const { axe } = await import('jest-axe')
  const results = await axe(container)
  expect(results).toHaveNoViolations()
}

// Global test setup
beforeEach(() => {
  // Reset DOM
  document.body.innerHTML = ''
  
  // Reset any global mocks
  vi.clearAllMocks()
})

afterEach(() => {
  // Cleanup
  cleanupTests()
})