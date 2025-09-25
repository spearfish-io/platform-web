/**
 * Authentication Error Display Component
 * 
 * Comprehensive error display with user-friendly messages, recovery actions, and accessibility
 * Built with Pure Radix UI Themes - no custom CSS classes
 */

'use client'

import { Button, Card, Flex, Text, Heading, Callout, Code } from '@radix-ui/themes'
import { AlertCircle, RefreshCw, ArrowLeft, Mail, Phone } from 'lucide-react'
import type { AuthErrorDetails, AuthErrorAction } from '@/types/auth/errors'

export interface AuthErrorDisplayProps {
  /**
   * Error details to display
   */
  error: AuthErrorDetails
  
  /**
   * Called when user clicks retry button
   */
  onRetry?: () => void
  
  /**
   * Called when user clicks back/cancel button
   */
  onBack?: () => void
  
  /**
   * Show detailed error information (development mode)
   */
  showDetails?: boolean
  
  /**
   * Display variant
   */
  variant?: 'card' | 'callout' | 'inline'
  
  /**
   * Component size
   */
  size?: '1' | '2' | '3'
}

/**
 * Main error display component with recovery actions
 */
export function AuthErrorDisplay({
  error,
  onRetry,
  onBack,
  showDetails = false,
  variant = 'card',
  size = '2'
}: AuthErrorDisplayProps) {
  const handleActionClick = (action: AuthErrorAction) => {
    if (action.handler) {
      action.handler()
    } else if (action.url) {
      window.open(action.url, '_blank', 'noopener,noreferrer')
    } else if (action.type === 'retry' && onRetry) {
      onRetry()
    }
  }

  const content = (
    <Flex 
      direction="column" 
      gap={size === '3' ? '4' : size === '2' ? '3' : '2'}
      p={variant === 'inline' ? '0' : size === '3' ? '6' : size === '2' ? '4' : '3'}
    >
      {/* Error Icon and Title */}
      <Flex direction="column" align="center" gap="3">
        <AlertCircle 
          style={{ 
            width: size === '3' ? '48px' : size === '2' ? '32px' : '24px',
            height: size === '3' ? '48px' : size === '2' ? '32px' : '24px',
            color: getErrorColor(error.code)
          }}
          aria-hidden="true"
        />
        
        <Flex direction="column" align="center" gap="1">
          <Heading 
            size={size === '3' ? '5' : size === '2' ? '4' : '3'}
            color="red"
            weight="bold"
            align="center"
          >
            Authentication Error
          </Heading>
          
          <Text 
            size={size === '3' ? '4' : size === '2' ? '3' : '2'}
            color="gray"
            align="center"
            style={{ maxWidth: '500px' }}
          >
            {error.userMessage}
          </Text>
        </Flex>
      </Flex>

      {/* Error Description (if available) */}
      {error.description && (
        <Callout.Root color="red" size={size}>
          <Callout.Icon>
            <AlertCircle style={{ width: '16px', height: '16px' }} />
          </Callout.Icon>
          <Callout.Text>
            {error.description}
          </Callout.Text>
        </Callout.Root>
      )}

      {/* Retry After Information */}
      {error.retryAfter && (
        <Callout.Root color="orange" size={size}>
          <Callout.Text>
            Please wait {Math.ceil(error.retryAfter / 60)} minutes before trying again.
          </Callout.Text>
        </Callout.Root>
      )}

      {/* Recovery Actions */}
      {error.actions && error.actions.length > 0 && (
        <Flex 
          direction="column" 
          gap={size === '3' ? '3' : '2'}
          align="center"
        >
          <Text size={size === '3' ? '3' : '2'} color="gray" weight="medium">
            What would you like to do?
          </Text>
          
          <Flex 
            gap="2" 
            wrap="wrap" 
            justify="center"
            style={{ maxWidth: '400px' }}
          >
            {error.actions.map((action, index) => (
              <Button
                key={index}
                variant={index === 0 ? 'solid' : 'soft'}
                color={getActionColor(action.type)}
                size={size === '3' ? '3' : '2'}
                onClick={() => handleActionClick(action)}
                disabled={!error.retryable && action.type === 'retry'}
              >
                {getActionIcon(action.type)}
                {action.label}
              </Button>
            ))}
          </Flex>
        </Flex>
      )}

      {/* Navigation Actions */}
      <Flex gap="2" justify="center">
        {onBack && (
          <Button 
            variant="ghost" 
            color="gray" 
            size={size === '3' ? '3' : '2'}
            onClick={onBack}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Back
          </Button>
        )}
        
        {error.retryable && onRetry && !error.retryAfter && (
          <Button 
            variant="soft" 
            color="blue" 
            size={size === '3' ? '3' : '2'}
            onClick={onRetry}
          >
            <RefreshCw style={{ width: '16px', height: '16px' }} />
            Try Again
          </Button>
        )}
      </Flex>

      {/* Technical Details (Development Mode) */}
      {showDetails && (
        <details>
          <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
            <Text size="2" color="gray">Technical Details</Text>
          </summary>
          <Card 
            p="3" 
            style={{ 
              backgroundColor: 'var(--gray-2)',
              fontFamily: 'monospace'
            }}
          >
            <Flex direction="column" gap="2">
              <div>
                <Text size="1" weight="bold">Error Code:</Text>{' '}
                <Code>{error.code}</Code>
              </div>
              <div>
                <Text size="1" weight="bold">Message:</Text>{' '}
                <Code>{error.message}</Code>
              </div>
              {error.field && (
                <div>
                  <Text size="1" weight="bold">Field:</Text>{' '}
                  <Code>{error.field}</Code>
                </div>
              )}
              {error.context && (
                <div>
                  <Text size="1" weight="bold">Context:</Text>
                  <Code style={{ whiteSpace: 'pre-wrap', fontSize: '11px' }}>
                    {JSON.stringify(error.context, null, 2)}
                  </Code>
                </div>
              )}
            </Flex>
          </Card>
        </details>
      )}
    </Flex>
  )

  // Apply variant styling
  if (variant === 'callout') {
    return (
      <Callout.Root color="red" size={size}>
        <Callout.Icon>
          <AlertCircle style={{ width: '16px', height: '16px' }} />
        </Callout.Icon>
        <Callout.Text>
          <Flex direction="column" gap="2">
            <Text weight="bold">{error.userMessage}</Text>
            {error.description && <Text size="1">{error.description}</Text>}
          </Flex>
        </Callout.Text>
      </Callout.Root>
    )
  }

  if (variant === 'card') {
    return (
      <Card 
        size={size}
        style={{ 
          minHeight: '300px',
          borderColor: 'var(--red-6)'
        }}
        role="alert"
        aria-live="assertive"
      >
        {content}
      </Card>
    )
  }

  // inline variant
  return (
    <div role="alert" aria-live="assertive">
      {content}
    </div>
  )
}

/**
 * Get appropriate color for error type
 */
function getErrorColor(errorCode: string): string {
  const colorMap: Record<string, string> = {
    NetworkError: 'var(--orange-9)',
    ServerError: 'var(--red-9)',
    Configuration: 'var(--yellow-9)',
    ValidationError: 'var(--blue-9)',
    TooManyAttempts: 'var(--red-9)',
    AccountLocked: 'var(--red-9)',
  }
  
  return colorMap[errorCode] || 'var(--red-9)'
}

/**
 * Get appropriate color for action type
 */
function getActionColor(actionType: string): 'blue' | 'red' | 'gray' | 'green' {
  const colorMap: Record<string, 'blue' | 'red' | 'gray' | 'green'> = {
    retry: 'blue',
    reset: 'gray',
    redirect: 'blue',
    contact_support: 'gray',
    change_password: 'green',
  }
  
  return colorMap[actionType] || 'gray'
}

/**
 * Get appropriate icon for action type
 */
function getActionIcon(actionType: string) {
  const icons: Record<string, React.ReactNode> = {
    retry: <RefreshCw style={{ width: '16px', height: '16px', marginRight: '8px' }} />,
    contact_support: <Mail style={{ width: '16px', height: '16px', marginRight: '8px' }} />,
  }
  
  return icons[actionType] || null
}

/**
 * Specific error displays for common scenarios
 */

export function NetworkErrorDisplay({ onRetry }: { onRetry?: () => void }) {
  return (
    <AuthErrorDisplay
      error={{
        code: 'NetworkError',
        message: 'Network connection failed',
        userMessage: 'Connection failed. Please check your internet connection and try again.',
        retryable: true,
        actions: [
          { type: 'retry', label: 'Try Again' }
        ]
      }}
      onRetry={onRetry}
      variant="card"
      size="2"
    />
  )
}

export function ConfigurationErrorDisplay() {
  return (
    <AuthErrorDisplay
      error={{
        code: 'Configuration',
        message: 'Authentication service misconfigured',
        userMessage: 'Authentication service is temporarily unavailable.',
        description: 'Please try again later or contact support if the problem persists.',
        retryable: true,
        retryAfter: 300,
        actions: [
          { type: 'contact_support', label: 'Contact Support' }
        ]
      }}
      variant="card"
      size="2"
    />
  )
}