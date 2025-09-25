/**
 * Authentication Components - Main Export
 * 
 * Re-exports all authentication components for easy importing
 */

// Main router component
export { AuthModeRouter, getAuthModeDescription, supportsFeature } from './shared/auth-mode-router'

// Shared components
export { 
  AuthLoadingState,
  SignInLoadingState,
  OIDCRedirectLoadingState,
  TokenRefreshLoadingState,
  SignOutLoadingState,
  AuthStepLoading
} from './shared/auth-loading-state'

export {
  AuthErrorDisplay,
  NetworkErrorDisplay,
  ConfigurationErrorDisplay
} from './shared/auth-error-display'

export {
  AuthFormLayout,
  OIDCFormLayout,
  LegacyFormLayout,
  MockFormLayout,
  AuthFormFooter
} from './shared/auth-form-layout'

// OIDC components
export { OIDCSignInForm } from './oidc/oidc-signin-form'

// Legacy components
export { LegacyLoginForm } from './legacy/legacy-login-form'

// Mock components
export { MockLoginForm } from './mock/mock-login-form'