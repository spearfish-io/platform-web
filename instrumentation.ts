import { registerOTel } from '@vercel/otel'

// Environment variables for Dash0 configuration
const DASH0_TRACE_ENDPOINT = process.env.DASH0_TRACE_ENDPOINT || 'https://api.dash0.com/v1/traces'
const DASH0_METRICS_ENDPOINT = process.env.DASH0_METRICS_ENDPOINT || 'https://api.dash0.com/v1/metrics'
const DASH0_LOGS_ENDPOINT = process.env.DASH0_LOGS_ENDPOINT || 'https://api.dash0.com/v1/logs'
const DASH0_AUTH_TOKEN = process.env.DASH0_AUTH_TOKEN
const DASH0_DATASET = process.env.DASH0_DATASET || 'dev'

export function register() {
  // Check if Dash0 is configured
  const isDash0Configured = !!DASH0_AUTH_TOKEN

  if (!isDash0Configured) {
    console.warn('DASH0_AUTH_TOKEN not found. Using default OpenTelemetry configuration.')
    
    // Use Vercel's default OpenTelemetry setup
    registerOTel({
      serviceName: 'platform-web',
      instrumentationConfig: {
        fetch: {
          propagateContextUrls: ['*'],
        },
      },
    })
    return
  }

  // Custom headers for Dash0
  const dash0Headers = {
    'Authorization': `Bearer ${DASH0_AUTH_TOKEN}`,
    'Dash0-Dataset': DASH0_DATASET,
    'Content-Type': 'application/json',
  }

  try {
    // Configure Vercel's OpenTelemetry with Dash0 endpoints
    registerOTel({
      serviceName: 'platform-web',
      traceExporter: 'otlp',
      instrumentationConfig: {
        fetch: {
          propagateContextUrls: ['*'],
        },
      },
    })

    // Set Dash0 configuration via environment variables that Vercel OTel will pick up
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT = DASH0_TRACE_ENDPOINT
    process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT = DASH0_METRICS_ENDPOINT
    process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT = DASH0_LOGS_ENDPOINT
    
    // Set headers - this is a bit tricky with Vercel OTel, so we'll rely on the configuration above
    process.env.OTEL_EXPORTER_OTLP_HEADERS = Object.entries(dash0Headers)
      .map(([key, value]) => `${key}=${value}`)
      .join(',')

    // Set resource attributes
    process.env.OTEL_RESOURCE_ATTRIBUTES = [
      `service.name=platform-web`,
      `service.version=${process.env.npm_package_version || '0.1.0'}`,
      `deployment.environment=${process.env.NODE_ENV || 'development'}`,
      `dash0.dataset=${DASH0_DATASET}`,
    ].join(',')

    console.log('OpenTelemetry with Dash0 initialized successfully')
    console.log(`Dataset: ${DASH0_DATASET}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`Trace Endpoint: ${DASH0_TRACE_ENDPOINT}`)

  } catch (error) {
    console.error('Failed to initialize OpenTelemetry with Dash0:', error)
    
    // Fallback to default configuration
    registerOTel({
      serviceName: 'platform-web',
      instrumentationConfig: {
        fetch: {
          propagateContextUrls: ['*'],
        },
      },
    })
  }
}