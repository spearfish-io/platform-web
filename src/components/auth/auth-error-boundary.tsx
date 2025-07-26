"use client"

import { Component, ReactNode, ErrorInfo } from "react"
import { Card, Heading, Text, Button, Flex, Callout } from "@radix-ui/themes"
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons"

/**
 * Authentication Error Boundary
 * 
 * Provides graceful error handling for authentication components
 * with user-friendly recovery options and comprehensive error reporting.
 * 
 * Implements enterprise principle #8: Error Handling & Monitoring
 */

interface AuthErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
}

interface AuthErrorBoundaryProps {
  children: ReactNode
  /** Custom fallback component */
  fallback?: (error: Error, retry: () => void) => ReactNode
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  /** Enable automatic error reporting */
  enableErrorReporting?: boolean
}

export class AuthErrorBoundary extends Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props)
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId(),
    }
  }

  static getDerivedStateFromError(error: Error): Partial<AuthErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: AuthErrorBoundary.prototype.generateErrorId(),
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo)
    
    // Report error to monitoring service
    if (this.props.enableErrorReporting !== false) {
      this.reportError(error, errorInfo)
    }

    // Log error for debugging
    console.error("Authentication Error Boundary caught an error:", {
      error,
      errorInfo,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    })
  }

  generateErrorId = (): string => {
    return `auth-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // Report to error tracking service (Bugsnag, Sentry, etc.)
      if (window.Bugsnag) {
        window.Bugsnag.notify(error, (event) => {
          event.context = "Authentication"
          event.addMetadata("errorBoundary", {
            componentStack: errorInfo.componentStack,
            errorId: this.state.errorId,
          })
        })
      }

      // Report to analytics if available
      if (window.gtag) {
        window.gtag("event", "exception", {
          description: error.message,
          fatal: false,
          error_id: this.state.errorId,
        })
      }
    } catch (reportingError) {
      console.error("Failed to report error:", reportingError)
    }
  }

  retry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId(),
    })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.retry)
      }

      // Default error UI
      return (
        <AuthErrorFallback
          error={this.state.error!}
          errorId={this.state.errorId}
          onRetry={this.retry}
        />
      )
    }

    return this.props.children
  }
}

/**
 * Default Error Fallback Component
 */
interface AuthErrorFallbackProps {
  error: Error
  errorId: string
  onRetry: () => void
}

function AuthErrorFallback({ error, errorId, onRetry }: AuthErrorFallbackProps) {
  const isNetworkError = error.message.includes("fetch") || 
                        error.message.includes("network") ||
                        error.message.includes("Failed to fetch")

  const isAuthError = error.message.includes("auth") ||
                     error.message.includes("credential") ||
                     error.message.includes("session")

  const getErrorTitle = () => {
    if (isNetworkError) return "Connection Problem"
    if (isAuthError) return "Authentication Error"
    return "Something Went Wrong"
  }

  const getErrorMessage = () => {
    if (isNetworkError) {
      return "We're having trouble connecting to our servers. Please check your internet connection and try again."
    }
    if (isAuthError) {
      return "There was a problem with authentication. Please try signing in again."
    }
    return "An unexpected error occurred. Our team has been notified and is working to fix the issue."
  }

  const getActionButton = () => {
    if (isNetworkError || isAuthError) {
      return (
        <Button onClick={onRetry} size="3">
          <ReloadIcon />
          Try Again
        </Button>
      )
    }
    return (
      <Flex gap="3">
        <Button onClick={onRetry} size="3">
          <ReloadIcon />
          Try Again
        </Button>
        <Button 
          variant="outline" 
          size="3"
          onClick={() => window.location.href = "/"}
        >
          Go Home
        </Button>
      </Flex>
    )
  }

  return (
    <Card size="4" style={{ maxWidth: "500px", margin: "0 auto" }}>
      <Flex direction="column" gap="4" align="center">
        <Callout.Root color="red" style={{ width: "100%" }}>
          <Callout.Icon>
            <ExclamationTriangleIcon />
          </Callout.Icon>
          <Callout.Text>{getErrorTitle()}</Callout.Text>
        </Callout.Root>

        <Flex direction="column" gap="3" align="center" style={{ textAlign: "center" }}>
          <Heading size="5">{getErrorTitle()}</Heading>
          
          <Text size="3" color="gray">
            {getErrorMessage()}
          </Text>

          {getActionButton()}

          <details style={{ marginTop: "var(--space-4)", width: "100%" }}>
            <summary style={{ cursor: "pointer", fontSize: "var(--font-size-1)" }}>
              <Text size="1" color="gray">Technical Details</Text>
            </summary>
            <Card style={{ marginTop: "var(--space-2)", padding: "var(--space-3)" }}>
              <Text size="1" family="mono" color="gray">
                Error ID: {errorId}
                <br />
                Type: {error.name}
                <br />
                Message: {error.message}
                <br />
                Time: {new Date().toLocaleString()}
              </Text>
            </Card>
          </details>

          <Text size="1" color="gray">
            If this problem persists, please contact support with Error ID: {errorId}
          </Text>
        </Flex>
      </Flex>
    </Card>
  )
}

/**
 * Higher-order component for wrapping authentication components
 */
export function withAuthErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<AuthErrorBoundaryProps, "children">
) {
  const WrappedComponent = (props: P) => (
    <AuthErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </AuthErrorBoundary>
  )

  WrappedComponent.displayName = `withAuthErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

/**
 * Hook for manual error reporting
 */
export function useAuthErrorReporting() {
  const reportError = (error: Error, context?: Record<string, any>) => {
    const errorId = `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    try {
      // Report to error tracking service
      if (window.Bugsnag) {
        window.Bugsnag.notify(error, (event) => {
          event.context = "Authentication (Manual)"
          event.addMetadata("manual", { ...context, errorId })
        })
      }

      // Log locally
      console.error("Manual error report:", {
        error,
        context,
        errorId,
        timestamp: new Date().toISOString(),
      })

      return errorId
    } catch (reportingError) {
      console.error("Failed to report error:", reportingError)
      return null
    }
  }

  return { reportError }
}

// Global error types for window extensions
declare global {
  interface Window {
    Bugsnag?: {
      notify: (error: Error, callback?: (event: any) => void) => void
    }
    gtag?: (...args: any[]) => void
  }
}