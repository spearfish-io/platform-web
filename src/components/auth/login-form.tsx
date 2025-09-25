"use client"

import { forwardRef, useId, useEffect } from "react"
import { Button, TextField, Flex, Text, Callout, Box, Switch } from "@radix-ui/themes"
import { ExclamationTriangleIcon, EyeOpenIcon, EyeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons"
import { useAuthForm } from "@/hooks/use-auth-form"
import { useState } from "react"
import { getAuthMode } from "@/lib/auth-mode"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

/**
 * Enhanced Login Form Component
 * 
 * Production-ready login form implementing all 11 enterprise principles:
 * - Type-safe validation with Zod
 * - Comprehensive accessibility (WCAG 2.1 AA)
 * - Error handling with user-friendly messages
 * - Security features (rate limiting, input sanitization)
 * - Performance optimizations
 * - Pure Radix UI styling
 */

interface LoginFormProps {
  /** Callback when login succeeds */
  onSuccess?: (redirectUrl: string) => void
  /** Callback when login fails */
  onError?: (error: string) => void
  /** Enable remember me functionality */
  enableRememberMe?: boolean
  /** Custom form title for accessibility */
  title?: string
  /** Additional CSS classes */
  className?: string
}

export const LoginForm = forwardRef<HTMLFormElement, LoginFormProps>(
  ({ 
    onSuccess, 
    onError, 
    enableRememberMe = true, 
    title = "Sign in to your account",
    className 
  }, ref) => {
    const authMode = getAuthMode()
    const router = useRouter()
    const searchParams = useSearchParams()
    const formId = useId()
    const [showPassword, setShowPassword] = useState(false)
    const [isOAuthLoading, setIsOAuthLoading] = useState(false)
    
    const {
      form,
      onSubmit,
      isLoading,
      error,
      attemptCount,
      isLocked,
      lockoutEndsAt,
      clearError,
      getFieldProps,
      getFieldError,
      isFieldInvalid,
    } = useAuthForm({ onSuccess, onError, enableRememberMe })

    // Calculate remaining lockout time
    const getRemainingLockoutTime = () => {
      if (!lockoutEndsAt) return 0
      return Math.ceil((lockoutEndsAt - Date.now()) / 1000 / 60)
    }

    const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev)
    }

    // Handle OAuth sign-in
    const handleOAuthSignIn = async () => {
      setIsOAuthLoading(true)
      const callbackUrl = searchParams.get("callbackUrl") || "/analytics"
      
      try {
        // Let Auth.js handle the OIDC redirect automatically
        await signIn('spearfish-oidc', {
          callbackUrl: callbackUrl,
          // redirect: true is the default for OAuth providers
        })
      } catch (error) {
        console.error('OIDC sign-in error:', error)
        onError?.('An error occurred during sign-in')
        setIsOAuthLoading(false)
      }
    }

    // Simple autofill detection - just sync form values with DOM when needed
    useEffect(() => {
      const syncFormWithDOM = () => {
        const emailInput = document.getElementById('login-email') as HTMLInputElement
        const passwordInput = document.getElementById('login-password') as HTMLInputElement
        
        if (emailInput?.value && emailInput.value !== form.getValues('email')) {
          form.setValue('email', emailInput.value)
        }
        if (passwordInput?.value && passwordInput.value !== form.getValues('password')) {
          form.setValue('password', passwordInput.value)
        }
      }

      // Check for autofill a few times after mount
      const timers = [
        setTimeout(syncFormWithDOM, 100),
        setTimeout(syncFormWithDOM, 500),
        setTimeout(syncFormWithDOM, 1000),
      ]
      
      return () => {
        timers.forEach(clearTimeout)
      }
    }, [form])

    // Always render OIDC sign-in since we've removed credentials provider
    // Legacy mode will be handled by the Identity API login page
    if (authMode !== 'mock') {
      return (
        <Flex direction="column" gap="4">
          <Text 
            id={`${formId}-title`} 
            className="sr-only"
            size="4" 
            weight="medium"
          >
            {title}
          </Text>

          <Button 
            size="3" 
            disabled={isOAuthLoading}
            loading={isOAuthLoading}
            onClick={handleOAuthSignIn}
            style={{ 
              width: "100%", 
              marginTop: "var(--space-2)"
            }}
          >
            {isOAuthLoading ? "Redirecting..." : "Sign in with Spearfish"}
          </Button>

          <Text size="1" color="gray" align="center">
            You will be redirected to the Spearfish authentication server
          </Text>
        </Flex>
      )
    }

    // Render mock form only for testing
    return (
      <form 
        ref={ref}
        id={formId}
        onSubmit={onSubmit}
        className={className}
        noValidate // We handle validation with Zod
        aria-labelledby={`${formId}-title`}
        aria-describedby={error ? `${formId}-error` : undefined}
      >
        <Flex direction="column" gap="4">
          {/* Screen reader title */}
          <Text 
            id={`${formId}-title`} 
            className="sr-only"
            size="4" 
            weight="medium"
          >
            {title}
          </Text>

          {/* Error Display */}
          {error && (
            <Callout.Root 
              color="red" 
              id={`${formId}-error`}
              role="alert"
              aria-live="polite"
            >
              <Callout.Icon>
                <ExclamationTriangleIcon />
              </Callout.Icon>
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}

          {/* Account Lockout Warning */}
          {isLocked && (
            <Callout.Root 
              color="amber"
              role="alert"
              aria-live="polite"
            >
              <Callout.Icon>
                <LockClosedIcon />
              </Callout.Icon>
              <Callout.Text>
                Account temporarily locked due to multiple failed attempts. 
                {lockoutEndsAt && ` Try again in ${getRemainingLockoutTime()} minutes.`}
              </Callout.Text>
            </Callout.Root>
          )}

          {/* Rate Limiting Warning */}
          {attemptCount >= 3 && attemptCount < 5 && !isLocked && (
            <Callout.Root color="amber">
              <Callout.Icon>
                <ExclamationTriangleIcon />
              </Callout.Icon>
              <Callout.Text>
                {5 - attemptCount} attempts remaining before account lockout.
              </Callout.Text>
            </Callout.Root>
          )}

          {/* Email Field */}
          <Flex direction="column" gap="2">
            <Text 
              as="label" 
              htmlFor="login-email"
              size="2" 
              weight="medium"
            >
              Email Address
              <Text color="red" aria-label="required">*</Text>
            </Text>
            
            <TextField.Root
              {...form.register("email")}
              {...getFieldProps("email")}
              type="email"
              placeholder="your.email@company.com"
              size="3"
              disabled={isLoading || isLocked}
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              onFocus={clearError}
              color={isFieldInvalid("email") ? "red" : undefined}
            />
            
            {isFieldInvalid("email") && (
              <Text 
                id="login-email-error"
                size="1" 
                color="red"
                role="alert"
                aria-live="polite"
              >
                {getFieldError("email")}
              </Text>
            )}
          </Flex>

          {/* Password Field */}
          <Flex direction="column" gap="2">
            <Text 
              as="label" 
              htmlFor="login-password"
              size="2" 
              weight="medium"
            >
              Password
              <Text color="red" aria-label="required">*</Text>
            </Text>
            
            <Box position="relative">
              <TextField.Root
                {...form.register("password")}
                {...getFieldProps("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                size="3"
                disabled={isLoading || isLocked}
                autoComplete="current-password"
                onFocus={clearError}
                color={isFieldInvalid("password") ? "red" : undefined}
                style={{ paddingRight: "var(--space-8)" }}
              />
              
              <Button
                type="button"
                variant="ghost"
                size="1"
                onClick={togglePasswordVisibility}
                disabled={isLoading || isLocked}
                style={{
                  position: "absolute",
                  right: "var(--space-2)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  padding: "var(--space-1)",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </Button>
            </Box>
            
            {isFieldInvalid("password") && (
              <Text 
                id="login-password-error"
                size="1" 
                color="red"
                role="alert"
                aria-live="polite"
              >
                {getFieldError("password")}
              </Text>
            )}
          </Flex>

          {/* Remember Me Checkbox */}
          {enableRememberMe && (
            <Flex align="center" gap="2">
              <Switch
                {...form.register("rememberMe")}
                id="login-rememberMe"
                size="1"
                disabled={isLoading || isLocked}
                aria-describedby="remember-me-description"
              />
              <Text 
                as="label" 
                htmlFor="login-rememberMe"
                size="2"
              >
                Remember me for 30 days
              </Text>
              <Text 
                id="remember-me-description"
                size="1" 
                color="gray"
                className="sr-only"
              >
                Keep me signed in on this device for 30 days
              </Text>
            </Flex>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            size="3" 
            disabled={isLoading || isLocked}
            loading={isLoading}
            style={{ 
              width: "100%", 
              marginTop: "var(--space-2)"
            }}
            aria-describedby="submit-button-description"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <Text 
            id="submit-button-description"
            size="1" 
            color="gray" 
            align="center"
            className="sr-only"
          >
            {isLocked 
              ? "Sign in is temporarily disabled due to too many failed attempts"
              : "Sign in with your Spearfish account credentials"
            }
          </Text>

          {/* Help Text */}
          <Text size="1" color="gray" align="center">
            Sign in with your Spearfish account credentials
          </Text>

          {/* Accessibility Status */}
          <div 
            aria-live="polite" 
            aria-atomic="true"
            className="sr-only"
          >
            {isLoading && "Signing in, please wait"}
            {error && `Error: ${error}`}
            {isLocked && "Account is temporarily locked"}
          </div>
        </Flex>
      </form>
    )
  }
)

LoginForm.displayName = "LoginForm"

/**
 * Loading Skeleton Component for Login Form
 * 
 * Provides accessible loading state while form is initializing
 */
export function LoginFormSkeleton() {
  return (
    <Flex direction="column" gap="4" aria-label="Loading sign in form">
      {/* Email Field Skeleton */}
      <Flex direction="column" gap="2">
        <Box 
          style={{ 
            height: "1.25rem", 
            width: "6rem", 
            backgroundColor: "var(--gray-6)",
            borderRadius: "var(--radius-2)",
            animation: "pulse 2s infinite"
          }}
          aria-hidden="true"
        />
        <Box 
          style={{ 
            height: "2.5rem", 
            backgroundColor: "var(--gray-4)",
            borderRadius: "var(--radius-2)",
            animation: "pulse 2s infinite"
          }}
          aria-hidden="true"
        />
      </Flex>

      {/* Password Field Skeleton */}
      <Flex direction="column" gap="2">
        <Box 
          style={{ 
            height: "1.25rem", 
            width: "5rem", 
            backgroundColor: "var(--gray-6)",
            borderRadius: "var(--radius-2)",
            animation: "pulse 2s infinite"
          }}
          aria-hidden="true"
        />
        <Box 
          style={{ 
            height: "2.5rem", 
            backgroundColor: "var(--gray-4)",
            borderRadius: "var(--radius-2)",
            animation: "pulse 2s infinite"
          }}
          aria-hidden="true"
        />
      </Flex>

      {/* Submit Button Skeleton */}
      <Box 
        style={{ 
          height: "2.5rem", 
          backgroundColor: "var(--gray-6)",
          borderRadius: "var(--radius-2)",
          marginTop: "var(--space-2)",
          animation: "pulse 2s infinite"
        }}
        aria-hidden="true"
      />

      <Text size="1" color="gray" align="center">
        Loading sign in form...
      </Text>
    </Flex>
  )
}