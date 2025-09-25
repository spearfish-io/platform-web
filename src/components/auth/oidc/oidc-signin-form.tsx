/**
 * OIDC Sign-In Form Component
 * 
 * OAuth 2.0/OpenID Connect provider selection and redirect handling
 * Built with Pure Radix UI Themes - no custom CSS classes
 */

'use client'

import { useState, useCallback } from 'react'
import { 
  Button, 
  Flex, 
  Box, 
  Text, 
  Card, 
  Callout,
  Separator 
} from '@radix-ui/themes'
import { 
  Shield, 
  ExternalLink, 
  Chrome,
  Building2,
  AlertCircle,
  ArrowRight
} from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { OIDCFormLayout, AuthFormFooter } from '../shared/auth-form-layout'
import { AuthLoadingState, OIDCRedirectLoadingState } from '../shared/auth-loading-state'
import { AuthErrorDisplay } from '../shared/auth-error-display'
import type { SpearfishUser, AuthError, OIDCProvider } from '@/types/auth'

export interface OIDCSignInFormProps {
  /**
   * Available OIDC providers (defaults to configured providers)
   */
  providers?: OIDCProvider[]
  
  /**
   * Callback URL after successful authentication
   */
  callbackUrl?: string
  
  /**
   * Called when a provider is selected
   */
  onProviderSelect?: (providerId: string) => void
  
  /**
   * Called when authentication succeeds
   */
  onAuthSuccess?: (user: SpearfishUser, redirectUrl: string) => void
  
  /**
   * Called when authentication fails
   */
  onAuthError?: (error: AuthError) => void
  
  /**
   * Show provider descriptions
   */
  showDescriptions?: boolean
}

/**
 * Default OIDC providers configuration
 */
const DEFAULT_PROVIDERS: OIDCProvider[] = [
  {
    id: 'spearfish-oidc',
    name: 'Spearfish Identity',
    type: 'oidc',
    issuer: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    clientId: 'platform-web',
    scopes: ['openid', 'profile', 'email', 'offline_access'],
    icon: 'Shield',
    description: 'Sign in with your Spearfish account using secure OAuth 2.0'
  },
  {
    id: 'google',
    name: 'Google',
    type: 'oidc',
    issuer: 'https://accounts.google.com',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    scopes: ['openid', 'profile', 'email'],
    icon: 'Chrome',
    description: 'Continue with your Google account'
  }
]

/**
 * OIDC provider selection form
 */
export function OIDCSignInForm({
  providers = DEFAULT_PROVIDERS,
  callbackUrl = '/analytics',
  onProviderSelect,
  onAuthSuccess,
  onAuthError,
  showDescriptions = true
}: OIDCSignInFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Filter available providers based on configuration
  const availableProviders = providers.filter(provider => {
    if (provider.id === 'google') {
      return !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    }
    return true
  })

  /**
   * Handle provider selection and OAuth redirect
   */
  const handleProviderSignIn = useCallback(async (providerId: string) => {
    setIsLoading(true)
    setSelectedProvider(providerId)
    setError(null)

    try {
      // Call provider selection callback
      onProviderSelect?.(providerId)

      // Initiate OAuth flow
      const result = await signIn(providerId, {
        callbackUrl,
        redirect: false
      })

      if (result?.error) {
        const errorMessage = result.error === 'OAuthSignin' 
          ? 'Failed to initiate sign-in process. Please try again.'
          : result.error === 'OAuthCallback'
          ? 'Authentication was cancelled or failed. Please try again.'
          : 'Authentication failed. Please try again.'
          
        setError(errorMessage)
        
        onAuthError?.({
          code: result.error,
          message: errorMessage,
          userMessage: errorMessage,
          retryable: true
        })
      } else if (result?.url) {
        // OAuth redirect initiated successfully
        // The user will be redirected to the provider
        // We'll show a loading state while redirect happens
        setTimeout(() => {
          if (result.url) {
            window.location.href = result.url
          }
        }, 1000)
      }
    } catch (err) {
      const errorMessage = 'Failed to connect to authentication service. Please try again.'
      setError(errorMessage)
      
      onAuthError?.({
        code: 'ProviderError',
        message: err instanceof Error ? err.message : 'Unknown error',
        userMessage: errorMessage,
        retryable: true
      })
    } finally {
      // Don't set loading to false immediately if redirecting
      if (!selectedProvider) {
        setIsLoading(false)
      }
    }
  }, [callbackUrl, onProviderSelect, onAuthSuccess, onAuthError])

  /**
   * Get provider icon component
   */
  const getProviderIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Shield: <Shield style={{ width: '20px', height: '20px' }} />,
      Chrome: <Chrome style={{ width: '20px', height: '20px' }} />,
      Building2: <Building2 style={{ width: '20px', height: '20px' }} />
    }
    
    return icons[iconName] || <Shield style={{ width: '20px', height: '20px' }} />
  }

  // Show loading state during provider redirect
  if (isLoading && selectedProvider) {
    return (
      <OIDCRedirectLoadingState />
    )
  }

  return (
    <OIDCFormLayout
      title="Sign In to Your Account"
      subtitle="Choose your preferred sign-in method"
      footer={<AuthFormFooter size="2" />}
    >
      <Flex direction="column" gap="4">
        {/* OAuth Information */}
        <Callout.Root color="blue" size="2">
          <Callout.Icon>
            <Shield style={{ width: '16px', height: '16px' }} />
          </Callout.Icon>
          <Callout.Text>
            <strong>Secure Authentication:</strong> Sign in using OAuth 2.0 with your 
            organization's identity provider. Your credentials are never stored by this application.
          </Callout.Text>
        </Callout.Root>

        {/* Provider Buttons */}
        {availableProviders.length > 0 ? (
          <Flex direction="column" gap="3">
            <Text size="3" weight="bold">
              Choose Your Account
            </Text>

            {availableProviders.map((provider) => (
              <Card 
                key={provider.id}
                p="3"
                style={{ 
                  cursor: 'pointer',
                  border: '1px solid var(--gray-6)',
                  transition: 'border-color 0.2s ease'
                }}
                onClick={() => handleProviderSignIn(provider.id)}
              >
                <Flex align="center" justify="between">
                  <Flex align="center" gap="3">
                    <Box style={{ color: 'var(--blue-9)' }}>
                      {getProviderIcon(provider.icon || 'Shield')}
                    </Box>
                    
                    <Flex direction="column" gap="1">
                      <Text size="3" weight="medium">
                        Continue with {provider.name}
                      </Text>
                      
                      {showDescriptions && provider.description && (
                        <Text size="2" color="gray">
                          {provider.description}
                        </Text>
                      )}
                    </Flex>
                  </Flex>
                  
                  <ArrowRight 
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      color: 'var(--gray-9)' 
                    }} 
                  />
                </Flex>
              </Card>
            ))}
          </Flex>
        ) : (
          <AuthErrorDisplay
            error={{
              code: 'Configuration',
              message: 'No OIDC providers configured',
              userMessage: 'No sign-in providers are currently available.',
              description: 'Please contact your administrator to configure authentication providers.',
              retryable: false,
              actions: [
                { type: 'contact_support', label: 'Contact Support' }
              ]
            }}
            variant="callout"
            size="2"
          />
        )}

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

        {/* Loading State */}
        {isLoading && !selectedProvider && (
          <Box py="4">
            <AuthLoadingState
              message="Preparing sign-in..."
              variant="inline"
              size="1"
            />
          </Box>
        )}

        <Separator size="4" />

        {/* Additional Information */}
        <Card p="3" style={{ backgroundColor: 'var(--gray-2)' }}>
          <Flex direction="column" gap="2">
            <Text size="2" weight="bold">
              🔒 How OAuth Sign-In Works
            </Text>
            
            <Text size="2" color="gray">
              1. Click your preferred sign-in provider above
            </Text>
            <Text size="2" color="gray">
              2. You'll be redirected to your organization's secure login page
            </Text>
            <Text size="2" color="gray">
              3. Sign in with your existing credentials
            </Text>
            <Text size="2" color="gray">
              4. You'll be returned here and automatically signed in
            </Text>
          </Flex>
        </Card>

        {/* Troubleshooting */}
        <details>
          <summary style={{ cursor: 'pointer' }}>
            <Text size="2" color="gray">Trouble signing in?</Text>
          </summary>
          <Box mt="2">
            <Flex direction="column" gap="2">
              <Text size="2" color="gray">
                • Make sure pop-ups are enabled in your browser
              </Text>
              <Text size="2" color="gray">
                • Clear your browser cache and cookies
              </Text>
              <Text size="2" color="gray">
                • Try signing in with a different browser
              </Text>
              <Text size="2" color="gray">
                • Contact IT support if problems persist
              </Text>
            </Flex>
          </Box>
        </details>
      </Flex>
    </OIDCFormLayout>
  )
}