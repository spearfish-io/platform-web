/**
 * Authentication Types - Main Export
 * 
 * Re-exports all authentication-related types for easy importing
 */

// Provider types
export type {
  AuthMode,
  OIDCProvider,
  CredentialsProvider,
  MockProvider,
  MockCredentials,
  ProviderConfig,
  AuthProviderButtonProps
} from './providers'

// Session types
export type {
  SpearfishUser,
  SpearfishSession,
  AuthState,
  LoginFormData,
  AuthError,
  AuthMetrics
} from './sessions'

// Error types
export type {
  AuthErrorCode,
  AuthErrorDetails,
  AuthErrorAction
} from './errors'

// Error utilities
export {
  AUTH_ERROR_MESSAGES,
  getAuthErrorDetails,
  createAuthError
} from './errors'