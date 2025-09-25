/**
 * Authentication Loading State Component
 * 
 * Displays loading states during authentication processes with proper accessibility
 * Built with Pure Radix UI Themes - no custom CSS classes
 */

'use client'

import { Box, Card, Flex, Spinner, Text, Heading } from '@radix-ui/themes'
import { Loader2 } from 'lucide-react'

export interface AuthLoadingStateProps {
  /**
   * Loading message to display to users
   */
  message?: string
  
  /**
   * Detailed description of what's happening (optional)
   */
  description?: string
  
  /**
   * Show spinner animation
   */
  showSpinner?: boolean
  
  /**
   * Loading state variant for different contexts
   */
  variant?: 'card' | 'inline' | 'overlay'
  
  /**
   * Size of the loading component
   */
  size?: '1' | '2' | '3'
}

/**
 * Authentication loading component with accessibility support
 */
export function AuthLoadingState({
  message = 'Loading...',
  description,
  showSpinner = true,
  variant = 'card',
  size = '2'
}: AuthLoadingStateProps) {
  const content = (
    <Flex 
      direction="column" 
      align="center" 
      justify="center" 
      gap={size === '3' ? '4' : size === '2' ? '3' : '2'}
      p={size === '3' ? '6' : size === '2' ? '4' : '3'}
    >
      {/* Loading Spinner */}
      {showSpinner && (
        <Box style={{ color: 'var(--blue-9)' }}>
          <Loader2 
            style={{ 
              width: size === '3' ? '32px' : size === '2' ? '24px' : '20px',
              height: size === '3' ? '32px' : size === '2' ? '24px' : '20px',
              animation: 'spin 1s linear infinite'
            }}
            aria-hidden="true"
          />
        </Box>
      )}
      
      {/* Loading Message */}
      <Flex direction="column" align="center" gap="1">
        <Heading 
          size={size === '3' ? '4' : size === '2' ? '3' : '2'}
          color="gray"
          weight="medium"
        >
          {message}
        </Heading>
        
        {description && (
          <Text 
            size={size === '3' ? '3' : size === '2' ? '2' : '1'}
            color="gray" 
            align="center"
            style={{ maxWidth: '400px' }}
          >
            {description}
          </Text>
        )}
      </Flex>
    </Flex>
  )

  // Apply variant styling
  if (variant === 'card') {
    return (
      <Card 
        size={size}
        style={{ minHeight: '200px' }}
        role="status" 
        aria-live="polite" 
        aria-label={message}
      >
        {content}
      </Card>
    )
  }

  if (variant === 'overlay') {
    return (
      <Box
        position="fixed"
        inset="0"
        style={{ 
          backgroundColor: 'var(--color-overlay)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999
        }}
        role="status"
        aria-live="polite"
        aria-label={message}
      >
        <Flex 
          width="100%" 
          height="100%" 
          align="center" 
          justify="center"
        >
          <Card size={size}>
            {content}
          </Card>
        </Flex>
      </Box>
    )
  }

  // inline variant
  return (
    <Box 
      role="status" 
      aria-live="polite" 
      aria-label={message}
      py={size === '3' ? '4' : size === '2' ? '3' : '2'}
    >
      {content}
    </Box>
  )
}

/**
 * Specific loading states for different auth processes
 */

export function SignInLoadingState() {
  return (
    <AuthLoadingState
      message="Signing you in..."
      description="Please wait while we authenticate your credentials"
      variant="card"
      size="2"
    />
  )
}

export function OIDCRedirectLoadingState() {
  return (
    <AuthLoadingState
      message="Redirecting to sign-in..."
      description="You will be redirected to your identity provider"
      variant="card"
      size="2"
    />
  )
}

export function TokenRefreshLoadingState() {
  return (
    <AuthLoadingState
      message="Refreshing session..."
      description="Updating your authentication status"
      variant="inline"
      size="1"
    />
  )
}

export function SignOutLoadingState() {
  return (
    <AuthLoadingState
      message="Signing you out..."
      description="Clearing your session and redirecting"
      variant="overlay"
      size="2"
    />
  )
}

/**
 * Authentication process steps loading component
 */
interface AuthStepLoadingProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
  description?: string
}

export function AuthStepLoading({
  currentStep,
  totalSteps,
  stepLabels,
  description
}: AuthStepLoadingProps) {
  return (
    <Card size="3" style={{ minHeight: '240px' }}>
      <Flex direction="column" align="center" gap="4" p="4">
        {/* Progress Indicator */}
        <Flex direction="column" align="center" gap="2">
          <Text size="2" color="gray" weight="medium">
            Step {currentStep} of {totalSteps}
          </Text>
          <Box 
            width="200px" 
            height="2px" 
            style={{ 
              backgroundColor: 'var(--gray-6)',
              borderRadius: '1px',
              overflow: 'hidden'
            }}
          >
            <Box
              height="100%"
              style={{
                backgroundColor: 'var(--blue-9)',
                width: `${(currentStep / totalSteps) * 100}%`,
                transition: 'width 0.3s ease'
              }}
            />
          </Box>
        </Flex>

        {/* Current Step */}
        <Flex direction="column" align="center" gap="3">
          <Loader2 
            style={{ 
              width: '24px',
              height: '24px',
              color: 'var(--blue-9)',
              animation: 'spin 1s linear infinite'
            }}
            aria-hidden="true"
          />
          
          <Heading size="3" weight="medium" align="center">
            {stepLabels[currentStep - 1] || 'Processing...'}
          </Heading>
          
          {description && (
            <Text size="2" color="gray" align="center" style={{ maxWidth: '300px' }}>
              {description}
            </Text>
          )}
        </Flex>
      </Flex>
    </Card>
  )
}