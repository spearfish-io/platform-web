/**
 * Legacy Authentication Form Component
 * 
 * Traditional email/password authentication form for legacy API compatibility
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
  Callout,
  Checkbox
} from '@radix-ui/themes'
import { 
  Eye, 
  EyeOff, 
  User, 
  Lock, 
  AlertCircle,
  LogIn
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { loginFormSchema, type LoginFormData } from '@/lib/auth-validation'
import { LegacyFormLayout, AuthFormFooter } from '../shared/auth-form-layout'
import { AuthLoadingState } from '../shared/auth-loading-state'
import type { SpearfishUser, AuthError } from '@/types/auth'

export interface LegacyLoginFormProps {
  /**
   * Callback URL after successful authentication
   */
  callbackUrl?: string
  
  /**
   * Called when authentication succeeds
   */
  onAuthSuccess?: (user: SpearfishUser, redirectUrl: string) => void
  
  /**
   * Called when authentication fails
   */
  onAuthError?: (error: AuthError) => void
  
  /**
   * Enable "Remember Me" functionality
   */
  enableRememberMe?: boolean
  
  /**
   * Maximum login attempts before lockout
   */
  maxAttempts?: number
}

/**
 * Legacy email/password authentication form
 */
export function LegacyLoginForm({
  callbackUrl = '/analytics',
  onAuthSuccess,
  onAuthError,
  enableRememberMe = true,
  maxAttempts = 5
}: LegacyLoginFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)

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
    if (attemptCount >= maxAttempts) {
      setError('Too many failed attempts. Please try again later.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Note: This would use a legacy credentials provider
      // For now, we'll show a coming soon message
      const result = await signIn('spearfish-legacy', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl
      })

      if (result?.error) {
        const newAttemptCount = attemptCount + 1
        setAttemptCount(newAttemptCount)
        
        const errorMessage = result.error === 'CredentialsSignin' 
          ? 'Invalid email or password. Please check your credentials and try again.'
          : 'Authentication failed. Please try again.'
          
        setError(errorMessage)
        
        onAuthError?.({
          code: result.error,
          message: errorMessage,
          userMessage: errorMessage,
          retryable: newAttemptCount < maxAttempts
        })
      } else if (result?.ok) {
        // Success - redirect to callback URL
        onAuthSuccess?.(
          {
            id: 'legacy-user',
            email: data.email,
            name: 'Legacy User',
            primaryTenantId: 1,
            tenantMemberships: [1],
            roles: ['TenantUserRole'],
            authType: 'credentials'
          } as SpearfishUser,
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
  }, [callbackUrl, router, onAuthSuccess, onAuthError, attemptCount, maxAttempts])

  // Show loading state during authentication
  if (isLoading) {
    return (
      <AuthLoadingState
        message="Authenticating..."
        description="Verifying your credentials with legacy authentication"
        variant="card"
        size="2"
      />
    )
  }

  return (
    <LegacyFormLayout
      title="Sign In"
      subtitle="Enter your credentials to access your account"
      footer={<AuthFormFooter size="2" />}
    >
      {/* Coming Soon Notice */}
      <Callout.Root color="orange" size="2" mb="4">
        <Callout.Icon>
          <AlertCircle style={{ width: '16px', height: '16px' }} />
        </Callout.Icon>
        <Callout.Text>
          <strong>Coming Soon:</strong> Legacy authentication is not yet implemented. 
          Please use Mock mode (NEXT_PUBLIC_AUTH_MODE=mock) for development.
        </Callout.Text>
      </Callout.Root>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Flex direction="column" gap="4">
          {/* Email Field */}
          <Box>
            <Text as="label" size="2" weight="medium" htmlFor="legacy-email">
              Email Address
            </Text>
            <TextField.Root 
              size="3"
              mt="1"
              placeholder="Enter your email"
              {...form.register('email')}
              id="legacy-email"
              aria-invalid={!!form.formState.errors.email}
              aria-describedby={form.formState.errors.email ? 'legacy-email-error' : undefined}
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
                id="legacy-email-error"
              >
                {form.formState.errors.email.message}
              </Text>
            )}
          </Box>

          {/* Password Field */}
          <Box>
            <Flex align="center" justify="between" mb="1">
              <Text as="label" size="2" weight="medium" htmlFor="legacy-password">
                Password
              </Text>
              <Text size="1">
                <a 
                  href="/auth/reset-password" 
                  style={{ 
                    color: 'var(--blue-9)',
                    textDecoration: 'none'
                  }}
                >
                  Forgot password?
                </a>
              </Text>
            </Flex>
            
            <TextField.Root 
              size="3"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              {...form.register('password')}
              id="legacy-password"
              aria-invalid={!!form.formState.errors.password}
              aria-describedby={form.formState.errors.password ? 'legacy-password-error' : undefined}
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
                id="legacy-password-error"
              >
                {form.formState.errors.password.message}
              </Text>
            )}
          </Box>

          {/* Remember Me */}
          {enableRememberMe && (
            <Box>
              <Text as="label" size="2">
                <Flex align="center" gap="2">
                  <Checkbox 
                    {...form.register('rememberMe')}
                    id="legacy-remember-me"
                  />
                  Remember me for 30 days
                </Flex>
              </Text>
            </Box>
          )}

          {/* Error Display */}
          {error && (
            <Callout.Root color="red" size="2">
              <Callout.Icon>
                <AlertCircle style={{ width: '16px', height: '16px' }} />
              </Callout.Icon>
              <Callout.Text>
                {error}
                {attemptCount > 0 && (
                  <Text size="1" mt="1" display="block">
                    Attempts: {attemptCount}/{maxAttempts}
                  </Text>
                )}
              </Callout.Text>
            </Callout.Root>
          )}

          {/* Submit Button */}
          <Button 
            type="submit"
            size="3"
            disabled={isLoading || !form.formState.isValid || attemptCount >= maxAttempts}
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
                <LogIn style={{ width: '16px', height: '16px' }} />
                Sign In
              </>
            )}
          </Button>

          {/* Additional Options */}
          <Flex direction="column" gap="2" align="center">
            <Text size="1" color="gray">
              Don't have an account?{' '}
              <a 
                href="/auth/register" 
                style={{ 
                  color: 'var(--blue-9)',
                  textDecoration: 'none'
                }}
              >
                Create one here
              </a>
            </Text>
          </Flex>
        </Flex>
      </form>
    </LegacyFormLayout>
  )
}