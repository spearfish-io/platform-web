/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { LoginForm, LoginFormSkeleton } from './login-form'
import { AuthErrorBoundary } from './auth-error-boundary'
import { Theme } from '@radix-ui/themes'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock Next.js hooks
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn((key: string) => {
      if (key === 'callbackUrl') return '/'
      if (key === 'error') return null
      return null
    }),
  }),
}))

// Mock next-auth
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}))

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Theme>
    {children}
  </Theme>
)

const renderWithTheme = (component: React.ReactElement) => {
  return render(component, { wrapper: TestWrapper })
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Rendering', () => {
    it('renders login form with all required fields', () => {
      renderWithTheme(<LoginForm />)

      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^Password/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('renders remember me checkbox when enabled', () => {
      renderWithTheme(<LoginForm enableRememberMe={true} />)

      expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument()
    })

    it('does not render remember me checkbox when disabled', () => {
      renderWithTheme(<LoginForm enableRememberMe={false} />)

      expect(screen.queryByLabelText(/remember me/i)).not.toBeInTheDocument()
    })

    it('renders password visibility toggle button', () => {
      renderWithTheme(<LoginForm />)

      expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument()
    })

    it('displays loading skeleton correctly', () => {
      renderWithTheme(<LoginFormSkeleton />)

      expect(screen.getByText(/loading sign in form/i)).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('shows validation errors for empty fields', async () => {
      const user = userEvent.setup()
      renderWithTheme(<LoginForm />)

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/email address is required/i)).toBeInTheDocument()
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      })
    })

    it('shows validation error for invalid email format', async () => {
      const user = userEvent.setup()
      renderWithTheme(<LoginForm />)

      const emailInput = screen.getByLabelText(/email address/i)
      await user.type(emailInput, 'invalid-email')
      await user.tab() // Trigger onBlur validation

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })
    })

    it('shows validation error for short password', async () => {
      const user = userEvent.setup()
      renderWithTheme(<LoginForm />)

      const passwordInput = screen.getByLabelText(/^Password/)
      await user.type(passwordInput, '123')
      await user.tab() // Trigger onBlur validation

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
      })
    })

    it('validates password complexity requirements', async () => {
      const user = userEvent.setup()
      renderWithTheme(<LoginForm />)

      const passwordInput = screen.getByLabelText(/^Password/)
      await user.type(passwordInput, 'weakpassword')
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText(/password must contain.*uppercase.*lowercase.*number/i)).toBeInTheDocument()
      })
    })

    it('accepts valid email and password', async () => {
      const user = userEvent.setup()
      renderWithTheme(<LoginForm />)

      const emailInput = screen.getByLabelText(/email address/i)
      const passwordInput = screen.getByLabelText(/^Password/)

      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'SecureP@ss123')

      // Should not show validation errors
      await waitFor(() => {
        expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/password must be at least/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('User Interactions', () => {
    it('toggles password visibility', async () => {
      const user = userEvent.setup()
      renderWithTheme(<LoginForm />)

      const passwordInput = screen.getByLabelText(/^Password/) as HTMLInputElement
      const toggleButton = screen.getByRole('button', { name: /show password/i })

      expect(passwordInput.type).toBe('password')

      await user.click(toggleButton)
      expect(passwordInput.type).toBe('text')
      expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument()

      await user.click(toggleButton)
      expect(passwordInput.type).toBe('password')
    })

    it('handles remember me checkbox toggle', async () => {
      const user = userEvent.setup()
      renderWithTheme(<LoginForm enableRememberMe={true} />)

      const rememberMeCheckbox = screen.getByLabelText(/remember me/i) as HTMLInputElement
      expect(rememberMeCheckbox.checked).toBe(false)

      await user.click(rememberMeCheckbox)
      expect(rememberMeCheckbox.checked).toBe(true)
    })

    it('clears errors when user starts typing', async () => {
      const user = userEvent.setup()
      renderWithTheme(<LoginForm />)

      // Trigger validation errors first
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/email address is required/i)).toBeInTheDocument()
      })

      // Start typing in email field
      const emailInput = screen.getByLabelText(/email address/i)
      await user.click(emailInput) // Focus triggers clearError

      await waitFor(() => {
        expect(screen.queryByText(/email address is required/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('calls onSuccess callback on successful login', async () => {
      const { signIn } = await import('next-auth/react')
      const mockSignIn = vi.mocked(signIn)
      const onSuccess = vi.fn()
      const user = userEvent.setup()

      mockSignIn.mockResolvedValueOnce({ ok: true, error: null })

      renderWithTheme(<LoginForm onSuccess={onSuccess} />)

      const emailInput = screen.getByLabelText(/email address/i)
      const passwordInput = screen.getByLabelText(/^Password/)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'SecureP@ss123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('spearfish', {
          email: 'user@example.com',
          password: 'SecureP@ss123',
          redirect: false,
        })
        expect(onSuccess).toHaveBeenCalledWith('/')
      })
    })

    it('displays error message on failed login', async () => {
      const { signIn } = await import('next-auth/react')
      const mockSignIn = vi.mocked(signIn)
      const onError = vi.fn()
      const user = userEvent.setup()

      mockSignIn.mockResolvedValueOnce({ 
        ok: false, 
        error: 'CredentialsSignin' 
      })

      renderWithTheme(<LoginForm onError={onError} />)

      const emailInput = screen.getByLabelText(/email address/i)
      const passwordInput = screen.getByLabelText(/^Password/)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'WrongPassword123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
        expect(onError).toHaveBeenCalledWith('CredentialsSignin')
      })
    })

    it('shows loading state during submission', async () => {
      const { signIn } = await import('next-auth/react')
      const mockSignIn = vi.mocked(signIn)
      const user = userEvent.setup()

      // Mock a delayed response
      mockSignIn.mockImplementation(() => new Promise(resolve => 
        setTimeout(() => resolve({ ok: true, error: null }), 100)
      ))

      renderWithTheme(<LoginForm />)

      const emailInput = screen.getByLabelText(/email address/i)
      const passwordInput = screen.getByLabelText(/^Password/)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'SecureP@ss123')
      await user.click(submitButton)

      // Should show loading state
      expect(screen.getByText(/signing in/i)).toBeInTheDocument()
      expect(submitButton).toBeDisabled()

      // Wait for completion
      await waitFor(() => {
        expect(screen.queryByText(/signing in/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Security Features', () => {
    it('implements rate limiting after multiple failed attempts', async () => {
      const { signIn } = await import('next-auth/react')
      const mockSignIn = vi.mocked(signIn)
      const user = userEvent.setup()

      // Mock failed attempts
      mockSignIn.mockResolvedValue({ 
        ok: false, 
        error: 'CredentialsSignin' 
      })

      renderWithTheme(<LoginForm />)

      const emailInput = screen.getByLabelText(/email address/i)
      const passwordInput = screen.getByLabelText(/^Password/)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'WrongPassword123')

      // Make multiple failed attempts
      for (let i = 0; i < 5; i++) {
        await user.click(submitButton)
        await waitFor(() => {
          expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
        })
      }

      // Should show lockout message
      await waitFor(() => {
        expect(screen.getByText(/account temporarily locked/i)).toBeInTheDocument()
        expect(submitButton).toBeDisabled()
      })
    })

    it('sanitizes user input', async () => {
      const { signIn } = await import('next-auth/react')
      const mockSignIn = vi.mocked(signIn)
      const user = userEvent.setup()

      mockSignIn.mockResolvedValueOnce({ ok: true, error: null })

      renderWithTheme(<LoginForm />)

      const emailInput = screen.getByLabelText(/email address/i)
      const passwordInput = screen.getByLabelText(/^Password/)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      // Input with potential HTML/script content
      await user.type(emailInput, '<script>alert("xss")</script>user@example.com')
      await user.type(passwordInput, 'SecureP@ss123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('spearfish', {
          email: 'scriptalert("xss")/scriptuser@example.com', // Sanitized
          password: 'SecureP@ss123',
          redirect: false,
        })
      })
    })
  })

  describe('Accessibility', () => {
    it('meets WCAG 2.1 AA accessibility standards', async () => {
      const { container } = renderWithTheme(<LoginForm />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('has proper ARIA labels and descriptions', () => {
      renderWithTheme(<LoginForm />)

      const emailInput = screen.getByLabelText(/email address/i)
      const passwordInput = screen.getByLabelText(/^Password/)

      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('autoComplete', 'email')
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('autoComplete', 'current-password')
    })

    it('announces errors to screen readers', async () => {
      const user = userEvent.setup()
      renderWithTheme(<LoginForm />)

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        const errorElement = screen.getByText(/email address is required/i)
        expect(errorElement).toHaveAttribute('role', 'alert')
        expect(errorElement).toHaveAttribute('aria-live', 'polite')
      })
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      renderWithTheme(<LoginForm enableRememberMe={true} />)

      // Tab through form elements
      await user.tab()
      expect(screen.getByLabelText(/email address/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/password/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByRole('button', { name: /show password/i })).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/remember me/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByRole('button', { name: /sign in/i })).toHaveFocus()
    })

    it('provides appropriate focus management', async () => {
      const user = userEvent.setup()
      renderWithTheme(<LoginForm />)

      const emailInput = screen.getByLabelText(/email address/i)
      const passwordToggle = screen.getByRole('button', { name: /show password/i })

      await user.click(emailInput)
      expect(emailInput).toHaveFocus()

      await user.click(passwordToggle)
      expect(passwordToggle).toHaveFocus()
    })

    it('handles reduced motion preferences', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      renderWithTheme(<LoginFormSkeleton />)
      
      // Should not have pulse animation with reduced motion
      const skeletonElements = document.querySelectorAll('[aria-hidden="true"]')
      skeletonElements.forEach(element => {
        const styles = window.getComputedStyle(element)
        expect(styles.animation).toBe('none')
      })
    })
  })

  describe('Error Boundary Integration', () => {
    it('catches and displays errors gracefully', () => {
      const ErrorThrowingForm = () => {
        throw new Error('Test error')
      }

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      renderWithTheme(
        <AuthErrorBoundary>
          <ErrorThrowingForm />
        </AuthErrorBoundary>
      )

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()

      consoleSpy.mockRestore()
    })

    it('allows error recovery', async () => {
      const user = userEvent.setup()
      let shouldError = true

      const ConditionalErrorForm = () => {
        if (shouldError) {
          throw new Error('Test error')
        }
        return <LoginForm />
      }

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      renderWithTheme(
        <AuthErrorBoundary>
          <ConditionalErrorForm />
        </AuthErrorBoundary>
      )

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()

      // Fix the error condition and retry
      shouldError = false
      const retryButton = screen.getByRole('button', { name: /try again/i })
      await user.click(retryButton)

      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()

      consoleSpy.mockRestore()
    })
  })

  describe('Performance', () => {
    it('renders quickly without performance issues', () => {
      const startTime = performance.now()
      renderWithTheme(<LoginForm />)
      const endTime = performance.now()

      // Should render in less than 100ms
      expect(endTime - startTime).toBeLessThan(100)
    })

    it('handles rapid user input without performance degradation', async () => {
      const user = userEvent.setup()
      renderWithTheme(<LoginForm />)

      const emailInput = screen.getByLabelText(/email address/i)
      
      const startTime = performance.now()
      
      // Simulate rapid typing
      await user.type(emailInput, 'rapid.typing.test@example.com', { delay: 1 })
      
      const endTime = performance.now()

      // Should handle rapid input efficiently
      expect(endTime - startTime).toBeLessThan(1000)
    })
  })
})