/**
 * Authentication Mode Router Component
 * 
 * Routes users to the appropriate authentication component based on the configured auth mode:
 * - oauth: OIDC provider selection and redirect handling
 * - legacy: Traditional email/password form with legacy API
 * - mock: Development login form with test credentials
 * 
 * Built with Pure Radix UI Themes - no custom CSS classes
 */

'use client'

import { Suspense } from 'react'
import { Card, Box, Heading, Text } from '@radix-ui/themes'
import { getAuthMode } from '@/lib/auth-mode'
import type { AuthMode, SpearfishUser, AuthError } from '@/types/auth'

// Lazy-loaded auth components for optimal bundle splitting
import { OIDCSignInForm } from '../oidc/oidc-signin-form'
import { LegacyLoginForm } from '../legacy/legacy-login-form'
import { MockLoginForm } from '../mock/mock-login-form'
import { AuthLoadingState } from './auth-loading-state'
import { AuthErrorDisplay } from './auth-error-display'

export interface AuthModeRouterProps {
  /**
   * Override the authentication mode (defaults to environment configuration)
   */
  mode?: AuthMode
  
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
   * Additional CSS class for the container (structural only)
   */
  className?: string
  
  /**
   * Show debug information in development mode
   */
  showDebug?: boolean
}

/**
 * Main authentication router component
 * Determines which authentication flow to render based on configuration
 */
export function AuthModeRouter({
  mode,
  callbackUrl = '/analytics',
  onAuthSuccess,
  onAuthError,
  className,
  showDebug = false,
}: AuthModeRouterProps) {
  // Get authentication mode from props or environment
  const authMode = mode || getAuthMode()
  
  // Development debug information
  const debugInfo = showDebug && process.env.NODE_ENV === 'development' && {
    mode: authMode,
    callbackUrl,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    nodeEnv: process.env.NODE_ENV,
  }

  return (
    <Box className={className}>
      <Suspense 
        fallback={
          <AuthLoadingState 
            message="Loading authentication..." 
            showSpinner={true}
          />
        }
      >
        {/* Debug Information (Development Only) */}
        {debugInfo && (
          <Card 
            mb="4" 
            p="3"
            style={{ backgroundColor: 'var(--yellow-2)', borderColor: 'var(--yellow-6)' }}
          >
            <Heading size="2" mb="2" color="yellow">
              🔧 Debug Info
            </Heading>
            <Text size="1" style={{ fontFamily: 'monospace' }}>
              Mode: {debugInfo.mode}<br />
              Callback: {debugInfo.callbackUrl}<br />
              API: {debugInfo.apiUrl}<br />
              Environment: {debugInfo.nodeEnv}
            </Text>
          </Card>
        )}

        {/* Route to appropriate authentication component */}
        {authMode === 'oauth' && (
          <OIDCSignInForm 
            callbackUrl={callbackUrl}
            onAuthSuccess={onAuthSuccess}
            onAuthError={onAuthError}
          />
        )}
        
        {authMode === 'legacy' && (
          <LegacyLoginForm 
            callbackUrl={callbackUrl}
            onAuthSuccess={onAuthSuccess}
            onAuthError={onAuthError}
          />
        )}
        
        {authMode === 'mock' && (
          <MockLoginForm 
            callbackUrl={callbackUrl}
            onAuthSuccess={onAuthSuccess}
            onAuthError={onAuthError}
            showCredentialHints={true}
          />
        )}
        
        {/* Fallback for invalid/unknown auth mode */}
        {!['oauth', 'legacy', 'mock'].includes(authMode) && (
          <AuthErrorDisplay 
            error={{
              code: 'Configuration',
              message: `Invalid authentication mode: ${authMode}`,
              description: 'Check your NEXT_PUBLIC_AUTH_MODE environment variable',
              userMessage: 'Authentication service is misconfigured. Please contact support.',
              retryable: false,
              actions: [
                { type: 'contact_support', label: 'Contact Support' }
              ]
            }}
            onRetry={() => window.location.reload()}
            showDetails={process.env.NODE_ENV === 'development'}
          />
        )}
      </Suspense>
    </Box>
  )
}

/**
 * Get authentication mode description for UI display
 */
export function getAuthModeDescription(mode: AuthMode): string {
  const descriptions = {
    oauth: 'Sign in with your organization account using secure OAuth 2.0',
    legacy: 'Sign in with your email and password using the classic login',
    mock: 'Development mode - sign in with test credentials for development'
  }
  
  return descriptions[mode] || 'Unknown authentication mode'
}

/**
 * Check if current auth mode supports specific features
 */
export function supportsFeature(mode: AuthMode, feature: string): boolean {
  const features = {
    oauth: ['sso', 'oidc', 'provider_selection', 'pkce'],
    legacy: ['credentials', 'remember_me', 'password_reset'],
    mock: ['test_credentials', 'development_mode', 'quick_login']
  }
  
  return features[mode]?.includes(feature) ?? false
}