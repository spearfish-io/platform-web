/**
 * Authentication Monitoring and Analytics
 * 
 * Implements comprehensive monitoring for authentication flows
 * with OpenTelemetry tracing and error tracking integration.
 * 
 * Enterprise Principle #8: Error Handling & Monitoring
 */

import { trace, context, SpanStatusCode, SpanKind } from '@opentelemetry/api'

/**
 * Authentication Event Types
 */
export type AuthEventType = 
  | 'login_attempt'
  | 'login_success' 
  | 'login_failure'
  | 'login_rate_limited'
  | 'validation_error'
  | 'security_violation'
  | 'session_created'
  | 'session_expired'
  | 'logout'

/**
 * Authentication Event Data
 */
export interface AuthEvent {
  type: AuthEventType
  userId?: string
  email?: string
  tenantId?: number
  provider?: string
  error?: string
  errorCode?: string
  duration?: number
  attemptCount?: number
  ipAddress?: string
  userAgent?: string
  timestamp: number
  metadata?: Record<string, any>
}

/**
 * Authentication Metrics
 */
export interface AuthMetrics {
  totalAttempts: number
  successfulLogins: number
  failedLogins: number
  rateLimitedAttempts: number
  averageLoginDuration: number
  uniqueUsers: number
  sessionDuration: number
  errorRate: number
}

/**
 * Authentication Monitoring Service
 */
class AuthMonitoringService {
  private tracer = trace.getTracer('platform-web-auth', '1.0.0')
  private events: AuthEvent[] = []
  private metrics: AuthMetrics = {
    totalAttempts: 0,
    successfulLogins: 0,
    failedLogins: 0,
    rateLimitedAttempts: 0,
    averageLoginDuration: 0,
    uniqueUsers: 0,
    sessionDuration: 0,
    errorRate: 0,
  }

  /**
   * Track authentication event with OpenTelemetry tracing
   */
  trackEvent = (event: Omit<AuthEvent, 'timestamp'>) => {
    const fullEvent: AuthEvent = {
      ...event,
      timestamp: Date.now(),
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent(),
    }

    // Add to local events store
    this.events.push(fullEvent)
    this.updateMetrics(fullEvent)

    // Create OpenTelemetry span
    const span = this.tracer.startSpan(`auth.${event.type}`, {
      kind: SpanKind.CLIENT,
      attributes: {
        'auth.event_type': event.type,
        'auth.user_id': event.userId || 'anonymous',
        'auth.email': event.email || 'unknown',
        'auth.tenant_id': event.tenantId?.toString() || 'unknown',
        'auth.provider': event.provider || 'credentials',
        'auth.attempt_count': event.attemptCount || 0,
        'user.ip_address': fullEvent.ipAddress,
        'user.agent': fullEvent.userAgent,
      },
    })

    // Set span status based on event type
    if (event.type.includes('failure') || event.type.includes('error')) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: event.error || 'Authentication failed',
      })
      span.recordException(new Error(event.error || 'Authentication error'))
    } else {
      span.setStatus({ code: SpanStatusCode.OK })
    }

    // Add custom attributes for specific events
    if (event.duration) {
      span.setAttribute('auth.duration_ms', event.duration)
    }

    if (event.errorCode) {
      span.setAttribute('auth.error_code', event.errorCode)
    }

    // Add metadata as attributes
    if (event.metadata) {
      Object.entries(event.metadata).forEach(([key, value]) => {
        span.setAttribute(`auth.metadata.${key}`, String(value))
      })
    }

    span.end()

    // Send to external monitoring services
    this.sendToMonitoringServices(fullEvent)

    // Log for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth Event:', fullEvent)
    }
  }

  /**
   * Start authentication timing
   */
  startTimer = (operationType: string) => {
    const span = this.tracer.startSpan(`auth.${operationType}`, {
      kind: SpanKind.CLIENT,
      attributes: {
        'auth.operation': operationType,
        'auth.start_time': Date.now(),
      },
    })

    const startTime = performance.now()

    return {
      end: (event?: Partial<AuthEvent>) => {
        const duration = performance.now() - startTime
        
        span.setAttribute('auth.duration_ms', duration)
        span.setStatus({ code: SpanStatusCode.OK })
        span.end()

        if (event) {
          this.trackEvent({
            ...event,
            duration,
          })
        }

        return duration
      },
      error: (error: Error, event?: Partial<AuthEvent>) => {
        span.recordException(error)
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        })
        span.end()

        if (event) {
          this.trackEvent({
            ...event,
            error: error.message,
            duration: performance.now() - startTime,
          })
        }
      }
    }
  }

  /**
   * Track login attempt with comprehensive context
   */
  trackLoginAttempt = (email: string, provider: string = 'credentials') => {
    return this.startTimer('login_attempt').end({
      type: 'login_attempt',
      email,
      provider,
    })
  }

  /**
   * Track successful login
   */
  trackLoginSuccess = (user: {
    id: string
    email: string
    tenantId: number
    provider?: string
  }, duration?: number) => {
    this.trackEvent({
      type: 'login_success',
      userId: user.id,
      email: user.email,
      tenantId: user.tenantId,
      provider: user.provider || 'credentials',
      duration,
    })
  }

  /**
   * Track login failure
   */
  trackLoginFailure = (
    email: string,
    error: string,
    errorCode?: string,
    attemptCount?: number
  ) => {
    this.trackEvent({
      type: 'login_failure',
      email,
      error,
      errorCode,
      attemptCount,
    })
  }

  /**
   * Track rate limiting
   */
  trackRateLimit = (email: string, attemptCount: number) => {
    this.trackEvent({
      type: 'login_rate_limited',
      email,
      attemptCount,
      error: 'Rate limit exceeded',
    })
  }

  /**
   * Track validation errors
   */
  trackValidationError = (field: string, error: string, email?: string) => {
    this.trackEvent({
      type: 'validation_error',
      email,
      error,
      metadata: { field },
    })
  }

  /**
   * Track security violations
   */
  trackSecurityViolation = (
    type: string,
    details: string,
    email?: string
  ) => {
    this.trackEvent({
      type: 'security_violation',
      email,
      error: details,
      metadata: { violation_type: type },
    })

    // Immediately report security events
    if (window.Bugsnag) {
      window.Bugsnag.notify(new Error(`Security violation: ${type}`), (event) => {
        event.severity = 'error'
        event.context = 'Authentication Security'
        event.addMetadata('security', {
          type,
          details,
          email,
          timestamp: new Date().toISOString(),
        })
      })
    }
  }

  /**
   * Get current authentication metrics
   */
  getMetrics = (): AuthMetrics => {
    return { ...this.metrics }
  }

  /**
   * Get recent authentication events
   */
  getRecentEvents = (limit: number = 100): AuthEvent[] => {
    return this.events
      .slice(-limit)
      .sort((a, b) => b.timestamp - a.timestamp)
  }

  /**
   * Clear event history (for privacy compliance)
   */
  clearEvents = () => {
    this.events = []
    this.resetMetrics()
  }

  /**
   * Update metrics based on events
   */
  private updateMetrics = (event: AuthEvent) => {
    this.metrics.totalAttempts++

    switch (event.type) {
      case 'login_success':
        this.metrics.successfulLogins++
        if (event.duration) {
          this.updateAverageLoginDuration(event.duration)
        }
        break
      case 'login_failure':
        this.metrics.failedLogins++
        break
      case 'login_rate_limited':
        this.metrics.rateLimitedAttempts++
        break
    }

    // Calculate error rate
    this.metrics.errorRate = 
      (this.metrics.failedLogins + this.metrics.rateLimitedAttempts) / 
      this.metrics.totalAttempts
  }

  /**
   * Update average login duration
   */
  private updateAverageLoginDuration = (newDuration: number) => {
    const currentAverage = this.metrics.averageLoginDuration
    const successCount = this.metrics.successfulLogins
    
    this.metrics.averageLoginDuration = 
      (currentAverage * (successCount - 1) + newDuration) / successCount
  }

  /**
   * Reset metrics
   */
  private resetMetrics = () => {
    this.metrics = {
      totalAttempts: 0,
      successfulLogins: 0,
      failedLogins: 0,
      rateLimitedAttempts: 0,
      averageLoginDuration: 0,
      uniqueUsers: 0,
      sessionDuration: 0,
      errorRate: 0,
    }
  }

  /**
   * Get client IP address
   */
  private getClientIP = (): string => {
    // In browser environment, we can't directly get the real IP
    // This would typically be handled by the server
    return 'client-side-unknown'
  }

  /**
   * Get user agent
   */
  private getUserAgent = (): string => {
    return typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
  }

  /**
   * Send events to external monitoring services
   */
  private sendToMonitoringServices = (event: AuthEvent) => {
    // Send to Bugsnag
    if (window.Bugsnag && (event.type.includes('failure') || event.type.includes('error'))) {
      window.Bugsnag.leaveBreadcrumb('Authentication Event', {
        type: event.type,
        email: event.email,
        error: event.error,
      })
    }

    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'auth_event', {
        event_category: 'Authentication',
        event_label: event.type,
        value: event.duration || 0,
        custom_map: {
          auth_provider: event.provider,
          tenant_id: event.tenantId,
        },
      })
    }

    // Send to custom analytics endpoint
    if (typeof fetch !== 'undefined' && process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'auth_event',
          properties: event,
        }),
      }).catch(error => {
        console.warn('Failed to send analytics event:', error)
      })
    }
  }
}

// Export singleton instance
export const authMonitoring = new AuthMonitoringService()

/**
 * React hook for authentication monitoring
 */
export function useAuthMonitoring() {
  return {
    trackEvent: authMonitoring.trackEvent,
    trackLoginAttempt: authMonitoring.trackLoginAttempt,
    trackLoginSuccess: authMonitoring.trackLoginSuccess,
    trackLoginFailure: authMonitoring.trackLoginFailure,
    trackRateLimit: authMonitoring.trackRateLimit,
    trackValidationError: authMonitoring.trackValidationError,
    trackSecurityViolation: authMonitoring.trackSecurityViolation,
    startTimer: authMonitoring.startTimer,
    getMetrics: authMonitoring.getMetrics,
    getRecentEvents: authMonitoring.getRecentEvents,
  }
}

// Global error types for window extensions
declare global {
  interface Window {
    Bugsnag?: {
      notify: (error: Error, callback?: (event: any) => void) => void
      leaveBreadcrumb: (name: string, metadata?: any) => void
    }
    gtag?: (...args: any[]) => void
  }
}