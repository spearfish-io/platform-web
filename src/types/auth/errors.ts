/**
 * Authentication Error Types
 * 
 * Comprehensive error handling for authentication flows
 * Includes error codes, user-friendly messages, and recovery actions
 */

export type AuthErrorCode = 
  | 'CredentialsSignin'
  | 'AccessDenied'
  | 'Verification'
  | 'Configuration'
  | 'Default'
  | 'AccountNotFound'
  | 'InvalidCredentials'
  | 'TooManyAttempts'
  | 'AccountLocked'
  | 'TokenExpired'
  | 'TokenInvalid'
  | 'NetworkError'
  | 'ServerError'
  | 'ValidationError'
  | 'UnexpectedError'
  | 'ProviderError'
  | 'OIDCError'
  | 'RefreshTokenError'

export interface AuthErrorDetails {
  code: AuthErrorCode
  message: string
  description?: string
  userMessage: string
  retryable: boolean
  retryAfter?: number
  actions?: AuthErrorAction[]
  field?: string
  context?: Record<string, unknown>
}

export interface AuthErrorAction {
  type: 'retry' | 'reset' | 'redirect' | 'contact_support' | 'change_password'
  label: string
  url?: string
  handler?: () => void
}

export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, AuthErrorDetails> = {
  CredentialsSignin: {
    code: 'CredentialsSignin',
    message: 'Invalid credentials provided',
    userMessage: 'Invalid email or password. Please check your credentials and try again.',
    retryable: true,
    actions: [
      { type: 'retry', label: 'Try Again' },
      { type: 'reset', label: 'Forgot Password?' }
    ]
  },
  AccessDenied: {
    code: 'AccessDenied',
    message: 'Access denied by provider or authorization server',
    userMessage: 'Access denied. Please contact your administrator.',
    retryable: false,
    actions: [
      { type: 'contact_support', label: 'Contact Support' }
    ]
  },
  Verification: {
    code: 'Verification',
    message: 'Email verification required',
    userMessage: 'Please verify your email address before signing in.',
    retryable: false,
    actions: [
      { type: 'retry', label: 'Resend Verification Email' }
    ]
  },
  Configuration: {
    code: 'Configuration',
    message: 'Authentication provider configuration error',
    userMessage: 'Authentication service is temporarily unavailable. Please try again later.',
    retryable: true,
    retryAfter: 300, // 5 minutes
    actions: [
      { type: 'retry', label: 'Try Again Later' },
      { type: 'contact_support', label: 'Contact Support' }
    ]
  },
  Default: {
    code: 'Default',
    message: 'Unknown authentication error',
    userMessage: 'An error occurred during sign in. Please try again.',
    retryable: true,
    actions: [
      { type: 'retry', label: 'Try Again' }
    ]
  },
  AccountNotFound: {
    code: 'AccountNotFound',
    message: 'No account found with the provided email',
    userMessage: 'No account found with this email address.',
    retryable: false,
    field: 'email',
    actions: [
      { type: 'retry', label: 'Check Email Address' },
      { type: 'contact_support', label: 'Create Account' }
    ]
  },
  InvalidCredentials: {
    code: 'InvalidCredentials',
    message: 'The provided credentials are invalid',
    userMessage: 'Invalid email or password.',
    retryable: true,
    actions: [
      { type: 'retry', label: 'Try Again' },
      { type: 'reset', label: 'Reset Password' }
    ]
  },
  TooManyAttempts: {
    code: 'TooManyAttempts',
    message: 'Too many failed login attempts',
    userMessage: 'Too many failed attempts. Please try again later.',
    retryable: true,
    retryAfter: 900, // 15 minutes
    actions: [
      { type: 'retry', label: 'Try Again Later' },
      { type: 'reset', label: 'Reset Password' }
    ]
  },
  AccountLocked: {
    code: 'AccountLocked',
    message: 'Account is temporarily locked',
    userMessage: 'Account temporarily locked due to security reasons.',
    retryable: true,
    retryAfter: 900, // 15 minutes
    actions: [
      { type: 'retry', label: 'Try Again Later' },
      { type: 'contact_support', label: 'Contact Support' }
    ]
  },
  TokenExpired: {
    code: 'TokenExpired',
    message: 'Authentication token has expired',
    userMessage: 'Your session has expired. Please sign in again.',
    retryable: true,
    actions: [
      { type: 'retry', label: 'Sign In Again' }
    ]
  },
  TokenInvalid: {
    code: 'TokenInvalid',
    message: 'Authentication token is invalid',
    userMessage: 'Authentication failed. Please sign in again.',
    retryable: true,
    actions: [
      { type: 'retry', label: 'Sign In Again' }
    ]
  },
  NetworkError: {
    code: 'NetworkError',
    message: 'Network connection error',
    userMessage: 'Connection failed. Please check your internet connection and try again.',
    retryable: true,
    actions: [
      { type: 'retry', label: 'Try Again' }
    ]
  },
  ServerError: {
    code: 'ServerError',
    message: 'Internal server error',
    userMessage: 'Server error. Please try again later.',
    retryable: true,
    retryAfter: 300, // 5 minutes
    actions: [
      { type: 'retry', label: 'Try Again Later' },
      { type: 'contact_support', label: 'Contact Support' }
    ]
  },
  ValidationError: {
    code: 'ValidationError',
    message: 'Form validation failed',
    userMessage: 'Please check your input and try again.',
    retryable: true,
    actions: [
      { type: 'retry', label: 'Correct and Try Again' }
    ]
  },
  UnexpectedError: {
    code: 'UnexpectedError',
    message: 'An unexpected error occurred',
    userMessage: 'An unexpected error occurred. Please try again.',
    retryable: true,
    actions: [
      { type: 'retry', label: 'Try Again' },
      { type: 'contact_support', label: 'Contact Support' }
    ]
  },
  ProviderError: {
    code: 'ProviderError',
    message: 'Authentication provider error',
    userMessage: 'Authentication service error. Please try again.',
    retryable: true,
    actions: [
      { type: 'retry', label: 'Try Again' }
    ]
  },
  OIDCError: {
    code: 'OIDCError',
    message: 'OIDC authentication flow error',
    userMessage: 'Sign-in process failed. Please try again.',
    retryable: true,
    actions: [
      { type: 'retry', label: 'Try Again' }
    ]
  },
  RefreshTokenError: {
    code: 'RefreshTokenError',
    message: 'Token refresh failed',
    userMessage: 'Session renewal failed. Please sign in again.',
    retryable: true,
    actions: [
      { type: 'retry', label: 'Sign In Again' }
    ]
  }
}

/**
 * Get error details by error code
 */
export function getAuthErrorDetails(code: string): AuthErrorDetails {
  return AUTH_ERROR_MESSAGES[code as AuthErrorCode] || AUTH_ERROR_MESSAGES.Default
}

/**
 * Create an authentication error with context
 */
export function createAuthError(
  code: AuthErrorCode,
  context?: Record<string, unknown>,
  field?: string
): AuthErrorDetails {
  const base = AUTH_ERROR_MESSAGES[code]
  return {
    ...base,
    context,
    field: field || base.field
  }
}