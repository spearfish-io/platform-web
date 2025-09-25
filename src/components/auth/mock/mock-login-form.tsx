/**
 * Mock Authentication Form Component
 * 
 * Development login form with predefined test credentials for easy testing
 * Built with Pure Radix UI Themes - no custom CSS classes
 */

'use client'

import { useState, useCallback } from 'react'
import { 
  Button, 
  TextField, 
  Flex, 
  Box, 
  Text, 
  Card, 
  Callout,
  Separator 
} from '@radix-ui/themes'
import { 
  Eye, 
  EyeOff, 
  User, 
  Lock, 
  AlertCircle,
  CheckCircle,
  Copy 
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { loginFormSchema, type LoginFormData } from '@/lib/auth-validation'
import { MockFormLayout, AuthFormFooter } from '../shared/auth-form-layout'
import { AuthErrorDisplay } from '../shared/auth-error-display'
import { AuthLoadingState } from '../shared/auth-loading-state'
import type { SpearfishUser, AuthError, MockCredentials } from '@/types/auth'

export interface MockLoginFormProps {
  /**
   * Callback URL after successful authentication
   */
  callbackUrl?: string
  
  /**
   * Test credentials to display (defaults to built-in credentials)
   */
  testCredentials?: MockCredentials[]
  
  /**
   * Show credential hints to developers
   */
  showCredentialHints?: boolean
  
  /**
   * Called when authentication succeeds
   */
  onAuthSuccess?: (user: SpearfishUser, redirectUrl: string) => void
  
  /**
   * Called when authentication fails
   */
  onAuthError?: (error: AuthError) => void
}

/**
 * Default test credentials for development
 */
const DEFAULT_TEST_CREDENTIALS: MockCredentials[] = [
  {
    email: 'admin@spearfish.io',
    password: 'Password123!',
    description: 'Admin user with full access',
    user: {
      id: 'admin-001',
      email: 'admin@spearfish.io',
      fullName: 'Admin User',
      firstName: 'Admin',
      lastName: 'User',
      userName: 'admin',
      primaryTenantId: 1,
      tenantMemberships: [1, 2, 3],
      roles: ['GlobalAdminRole', 'TenantAdminRole'],
      authType: 'mock'
    }
  },
  {
    email: 'user@spearfish.io',
    password: 'UserPass123!',
    description: 'Regular user with standard access',
    user: {
      id: 'user-001',
      email: 'user@spearfish.io',
      fullName: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      userName: 'testuser',
      primaryTenantId: 1,
      tenantMemberships: [1],
      roles: ['TenantUserRole'],
      authType: 'mock'
    }
  },
  {
    email: 'test@example.com',
    password: 'TestPass123!',
    description: 'Demo user for testing features',
    user: {
      id: 'test-001',
      email: 'test@example.com',
      fullName: 'Demo User',
      firstName: 'Demo',
      lastName: 'User',
      userName: 'demo',
      primaryTenantId: 2,
      tenantMemberships: [2],
      roles: ['TenantUserRole'],
      authType: 'mock'
    }
  }
]

/**
 * Mock authentication form with test credential hints
 */
export function MockLoginForm({
  callbackUrl = '/analytics',
  testCredentials = DEFAULT_TEST_CREDENTIALS,
  showCredentialHints = true,
  onAuthSuccess,
  onAuthError
}: MockLoginFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Form management with validation
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    mode: 'onBlur'
  })

  /**
   * Handle form submission
   */
  const onSubmit = useCallback(async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('spearfish-mock', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl
      })

      if (result?.error) {
        const errorMessage = result.error === 'CredentialsSignin' 
          ? 'Invalid email or password. Please check your credentials and try again.'
          : 'Authentication failed. Please try again.'
          
        setError(errorMessage)
        
        // Call error handler if provided
        onAuthError?.({
          code: result.error,
          message: errorMessage,
          userMessage: errorMessage,
          retryable: true
        })
      } else if (result?.ok) {
        // Success - redirect to callback URL
        onAuthSuccess?.(
          testCredentials.find(cred => cred.email === data.email)?.user as SpearfishUser,
          callbackUrl
        )
        
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.'
      setError(errorMessage)
      
      onAuthError?.({
        code: 'UnexpectedError',
        message: err instanceof Error ? err.message : 'Unknown error',
        userMessage: errorMessage,
        retryable: true
      })
    } finally {
      setIsLoading(false)
    }
  }, [callbackUrl, router, onAuthSuccess, onAuthError, testCredentials])

  /**
   * Quick login with predefined credentials
   */
  const handleQuickLogin = useCallback((credentials: MockCredentials) => {
    form.setValue('email', credentials.email)
    form.setValue('password', credentials.password)
    form.handleSubmit(onSubmit)()
  }, [form, onSubmit])

  /**
   * Copy credentials to clipboard
   */
  const copyCredentials = useCallback((email: string, password: string) => {
    const text = `${email} / ${password}`
    navigator.clipboard.writeText(text).then(() => {
      // Could show a toast notification here
      console.log('Credentials copied to clipboard')
    })
  }, [])

  // Show loading state during authentication
  if (isLoading) {
    return (
      <AuthLoadingState
        message="Authenticating with test credentials..."
        description="Signing you in with mock authentication"
        variant="card"
        size="2"
      />
    )
  }

  return (
    <MockFormLayout
      title="Development Sign In"
      subtitle="Use test credentials for development and testing"
      footer={<AuthFormFooter size="2" />}
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Flex direction="column" gap="4">
          {/* Development Notice */}
          <Callout.Root color="blue" size="2">
            <Callout.Icon>
              <AlertCircle style={{ width: '16px', height: '16px' }} />
            </Callout.Icon>
            <Callout.Text>
              <strong>Development Mode:</strong> This form uses mock authentication for testing. 
              Use the credentials below or any email/password combination.
            </Callout.Text>
          </Callout.Root>

          {/* Quick Login Options */}
          {showCredentialHints && testCredentials.length > 0 && (
            <Card p="3" style={{ backgroundColor: 'var(--gray-2)' }}>
              <Text size="2" weight="bold" mb="3">
                🚀 Quick Login Options
              </Text>
              
              <Flex direction="column" gap="2">
                {testCredentials.map((cred, index) => (
                  <Flex 
                    key={index} 
                    align="center" 
                    justify="between" 
                    p="2"
                    style={{ 
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: 'var(--radius-2)',
                      border: '1px solid var(--gray-6)'
                    }}
                  >
                    <Flex direction="column" gap="1">
                      <Text size="2" weight="medium">
                        {cred.user.fullName}
                      </Text>
                      <Text size="1" color="gray">
                        {cred.email} / {cred.password}
                      </Text>
                      <Text size="1" color="gray" style={{ fontStyle: 'italic' }}>
                        {cred.description}
                      </Text>
                    </Flex>
                    
                    <Flex gap="1">
                      <Button
                        type="button"
                        variant="soft"
                        size="1"
                        onClick={() => copyCredentials(cred.email, cred.password)}
                      >
                        <Copy style={{ width: '12px', height: '12px' }} />
                      </Button>
                      <Button
                        type="button"
                        variant="solid"
                        size="1"
                        onClick={() => handleQuickLogin(cred)}
                      >
                        Use
                      </Button>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            </Card>
          )}

          <Separator size="4" />

          {/* Manual Login Form */}
          <Flex direction="column" gap="3">
            <Text size="3" weight="bold">
              Manual Login
            </Text>

            {/* Email Field */}
            <Box>
              <Text as="label" size="2" weight="medium" htmlFor="mock-email">
                Email Address
              </Text>
              <TextField.Root 
                size="3"
                mt="1"
                placeholder="Enter your email"
                {...form.register('email')}
                id="mock-email"
                aria-invalid={!!form.formState.errors.email}
                aria-describedby={form.formState.errors.email ? 'mock-email-error' : undefined}
              >
                <TextField.Slot>
                  <User style={{ width: '16px', height: '16px' }} />
                </TextField.Slot>
              </TextField.Root>
              
              {form.formState.errors.email && (
                <Text 
                  size="1" 
                  color="red" 
                  mt="1"
                  id="mock-email-error"
                >
                  {form.formState.errors.email.message}
                </Text>
              )}
            </Box>

            {/* Password Field */}
            <Box>
              <Text as="label" size="2" weight="medium" htmlFor="mock-password">
                Password
              </Text>
              <TextField.Root 
                size="3"
                mt="1"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...form.register('password')}
                id="mock-password"
                aria-invalid={!!form.formState.errors.password}
                aria-describedby={form.formState.errors.password ? 'mock-password-error' : undefined}
              >
                <TextField.Slot>
                  <Lock style={{ width: '16px', height: '16px' }} />
                </TextField.Slot>
                <TextField.Slot>
                  <Button
                    type="button"
                    variant="ghost"
                    size="1"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff style={{ width: '16px', height: '16px' }} />
                    ) : (
                      <Eye style={{ width: '16px', height: '16px' }} />
                    )}
                  </Button>
                </TextField.Slot>
              </TextField.Root>
              
              {form.formState.errors.password && (
                <Text 
                  size="1" 
                  color="red" 
                  mt="1"
                  id="mock-password-error"
                >
                  {form.formState.errors.password.message}
                </Text>
              )}
            </Box>
          </Flex>

          {/* Error Display */}
          {error && (
            <Callout.Root color="red" size="2">
              <Callout.Icon>
                <AlertCircle style={{ width: '16px', height: '16px' }} />
              </Callout.Icon>
              <Callout.Text>
                {error}
              </Callout.Text>
            </Callout.Root>
          )}

          {/* Submit Button */}
          <Button 
            type="submit"
            size="3"
            disabled={isLoading || !form.formState.isValid}
            style={{ width: '100%' }}
          >
            {isLoading ? (
              <>
                <Box style={{ 
                  width: '16px', 
                  height: '16px',
                  animation: 'spin 1s linear infinite' 
                }}>
                  ⟳
                </Box>
                Signing In...
              </>
            ) : (
              <>
                <CheckCircle style={{ width: '16px', height: '16px' }} />
                Sign In with Mock Auth
              </>
            )}
          </Button>
        </Flex>
      </form>
    </MockFormLayout>
  )
}