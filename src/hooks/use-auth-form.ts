"use client"

import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginFormSchema, type LoginFormData, authValidation } from "@/lib/auth-validation"
import { useAuthMonitoring } from "@/lib/auth-monitoring"

/**
 * Authentication Form Hook
 * 
 * Provides comprehensive form management for authentication with:
 * - React Hook Form integration for performance
 * - Zod validation for type safety
 * - Error handling and user feedback
 * - Accessibility support
 * - Security features (rate limiting, input sanitization)
 */

interface UseAuthFormOptions {
  onSuccess?: (redirectUrl: string) => void
  onError?: (error: string) => void
  enableRememberMe?: boolean
}

interface AuthFormState {
  isLoading: boolean
  error: string | null
  attemptCount: number
  isLocked: boolean
  lockoutEndsAt: number | null
}

export function useAuthForm(options: UseAuthFormOptions = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const monitoring = useAuthMonitoring()
  const [formState, setFormState] = useState<AuthFormState>({
    isLoading: false,
    error: null,
    attemptCount: 0,
    isLocked: false,
    lockoutEndsAt: null,
  })

  // Get callback URL and error from search params
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const urlError = searchParams.get("error")

  // Initialize React Hook Form with Zod validation
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onBlur", // Validate on blur for better UX
  })

  /**
   * Handle form submission with comprehensive error handling
   */
  const onSubmit = useCallback(async (data: LoginFormData) => {
    // Check if account is locked out
    if (formState.isLocked && formState.lockoutEndsAt) {
      const now = Date.now()
      if (now < formState.lockoutEndsAt) {
        const remainingTime = Math.ceil((formState.lockoutEndsAt - now) / 1000 / 60)
        setFormState(prev => ({
          ...prev,
          error: `Account temporarily locked. Try again in ${remainingTime} minutes.`
        }))
        return
      } else {
        // Unlock account
        setFormState(prev => ({
          ...prev,
          isLocked: false,
          lockoutEndsAt: null,
          attemptCount: 0
        }))
      }
    }

    setFormState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Start monitoring timer
      const timer = monitoring.startTimer('login_attempt')

      // Sanitize inputs for security
      const sanitizedData = {
        email: authValidation.sanitizeInput(data.email),
        password: data.password, // Don't sanitize password as it may contain special chars
        rememberMe: data.rememberMe,
      }

      // Validate sanitized data
      const validation = authValidation.validateLoginForm(sanitizedData)
      if (!validation.success) {
        monitoring.trackValidationError('form', 'Invalid form data', sanitizedData.email)
        timer.error(new Error('Form validation failed'))
        setFormState(prev => ({
          ...prev,
          isLoading: false,
          error: "Please check your input and try again."
        }))
        return
      }

      // Track login attempt
      monitoring.trackLoginAttempt(sanitizedData.email, 'credentials')

      // Attempt authentication
      const result = await signIn("spearfish", {
        email: sanitizedData.email,
        password: sanitizedData.password,
        redirect: false,
      })

      if (result?.error) {
        // Handle authentication failure
        const newAttemptCount = formState.attemptCount + 1
        const shouldLock = newAttemptCount >= 5 // MAX_LOGIN_ATTEMPTS

        // Track failure
        monitoring.trackLoginFailure(
          sanitizedData.email,
          result.error,
          result.error,
          newAttemptCount
        )

        // Track rate limiting if applicable
        if (shouldLock) {
          monitoring.trackRateLimit(sanitizedData.email, newAttemptCount)
        }

        timer.error(new Error(result.error))

        setFormState(prev => ({
          ...prev,
          isLoading: false,
          error: getErrorMessage(result.error),
          attemptCount: newAttemptCount,
          isLocked: shouldLock,
          lockoutEndsAt: shouldLock ? Date.now() + (15 * 60 * 1000) : null, // 15 minutes
        }))

        options.onError?.(result.error)
      } else if (result?.ok) {
        // Success - track and redirect
        const duration = timer.end()
        
        // Track successful login (we'll get user details from session)
        monitoring.trackLoginSuccess({
          id: 'session-user', // Will be updated with actual ID
          email: sanitizedData.email,
          tenantId: 1, // Will be updated with actual tenant
          provider: 'credentials'
        }, duration)

        setFormState({
          isLoading: false,
          error: null,
          attemptCount: 0,
          isLocked: false,
          lockoutEndsAt: null,
        })

        options.onSuccess?.(callbackUrl)
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      console.error("Authentication error:", error)
      
      // Track unexpected error
      monitoring.trackEvent({
        type: 'login_failure',
        email: data.email,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorCode: 'unexpected_error',
      })

      setFormState(prev => ({
        ...prev,
        isLoading: false,
        error: "An unexpected error occurred. Please try again."
      }))
      options.onError?.("unexpected_error")
    }
  }, [formState, callbackUrl, router, options])

  /**
   * Clear form errors
   */
  const clearError = useCallback(() => {
    setFormState(prev => ({ ...prev, error: null }))
  }, [])

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    form.reset()
    setFormState({
      isLoading: false,
      error: null,
      attemptCount: 0,
      isLocked: false,
      lockoutEndsAt: null,
    })
  }, [form])

  // Form submission is now always allowed (validation happens on submit)

  /**
   * Get current error to display (URL error takes precedence)
   */
  const currentError = urlError ? getErrorMessage(urlError) : formState.error

  return {
    // Form management
    form,
    onSubmit: form.handleSubmit(onSubmit),
    
    // Form state
    isLoading: formState.isLoading,
    error: currentError,
    attemptCount: formState.attemptCount,
    isLocked: formState.isLocked,
    lockoutEndsAt: formState.lockoutEndsAt,
    
    // Form actions
    clearError,
    resetForm,
    
    // Field helpers
    getFieldError: (field: keyof LoginFormData) => form.formState.errors[field]?.message,
    isFieldInvalid: (field: keyof LoginFormData) => !!form.formState.errors[field],
    
    // Accessibility helpers
    getFieldId: (field: keyof LoginFormData) => `login-${field}`,
    getErrorId: (field: keyof LoginFormData) => `login-${field}-error`,
    getFieldProps: (field: keyof LoginFormData) => ({
      id: `login-${field}`,
      "aria-invalid": !!form.formState.errors[field],
      "aria-describedby": form.formState.errors[field] ? `login-${field}-error` : undefined,
    }),
  }
}

/**
 * Convert error codes to user-friendly messages
 */
function getErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    "CredentialsSignin": "Invalid email or password. Please check your credentials and try again.",
    "AccessDenied": "Access denied. Please contact your administrator.",
    "Verification": "Please verify your email address before signing in.",
    "Default": "An error occurred during sign in. Please try again.",
    "Configuration": "Authentication service is temporarily unavailable. Please try again later.",
    "AccountNotFound": "No account found with this email address.",
    "InvalidCredentials": "Invalid email or password.",
    "TooManyAttempts": "Too many failed attempts. Please try again later.",
    "unexpected_error": "An unexpected error occurred. Please try again.",
  }

  return errorMessages[errorCode] || errorMessages.Default
}

/**
 * Password strength checker hook
 */
export function usePasswordStrength(password: string) {
  const strength = authValidation.getPasswordStrength(password)
  
  const getStrengthColor = () => {
    if (strength.score <= 2) return "red"
    if (strength.score <= 3) return "amber"  
    if (strength.score <= 4) return "blue"
    return "green"
  }

  const getStrengthLabel = () => {
    if (strength.score <= 2) return "Weak"
    if (strength.score <= 3) return "Fair"
    if (strength.score <= 4) return "Good"  
    return "Strong"
  }

  return {
    score: strength.score,
    feedback: strength.feedback,
    color: getStrengthColor(),
    label: getStrengthLabel(),
    isValid: strength.score >= 3, // Minimum acceptable strength
  }
}