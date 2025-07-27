/**
 * Authentication Mode Utilities
 * 
 * Helper functions to determine which authentication mode the application is using:
 * - mock: MSW mocks with test credentials
 * - oauth: Modern platform-api OAuth 2.0 (default)
 * - legacy: Legacy cookie-based authentication (portal-spearfish style)
 */

export type AuthMode = 'mock' | 'oauth' | 'legacy'

/**
 * Get the current authentication mode from environment variable
 * @returns 'mock', 'oauth', or 'legacy' (defaults to 'oauth')
 */
export function getAuthMode(): AuthMode {
  const mode = process.env.NEXT_PUBLIC_AUTH_MODE?.toLowerCase()
  
  // Support legacy environment variables for backward compatibility
  if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') return 'mock'
  if (process.env.NEXT_PUBLIC_USE_LEGACY_AUTH === 'true') return 'legacy'
  
  // Use new single environment variable
  if (mode === 'mock' || mode === 'legacy' || mode === 'oauth') {
    return mode as AuthMode
  }
  
  // Default to oauth if not specified
  return 'oauth'
}

/**
 * Check if the application is configured to use mock authentication
 * @returns true if auth mode is 'mock'
 */
export function isUsingMockAuth(): boolean {
  return getAuthMode() === 'mock'
}

/**
 * Check if the application is configured to use legacy authentication
 * @returns true if auth mode is 'legacy'
 */
export function isUsingLegacyAuth(): boolean {
  return getAuthMode() === 'legacy'
}

/**
 * Check if the application is configured to use OAuth platform-api
 * @returns true if auth mode is 'oauth'
 */
export function isUsingOAuthApi(): boolean {
  return getAuthMode() === 'oauth'
}

/**
 * Get the appropriate API URL based on authentication mode
 * @returns The API URL to use for authentication requests
 */
export function getApiUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/'
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
}

/**
 * Get the legacy API URL for cookie-based authentication
 * @returns The legacy API URL (same as getApiUrl for now, but allows for future separation)
 */
export function getLegacyApiUrl(): string {
  return getApiUrl()
}

/**
 * Log the current authentication configuration to console
 * Useful for debugging and understanding the current setup
 */
export function logAuthConfig(): void {
  if (process.env.NODE_ENV === 'development') {
    const mode = getAuthMode()
    const apiUrl = getApiUrl()
    
    console.log('🔧 Authentication Configuration:')
    console.log(`   Mode: ${mode}`)
    console.log(`   API URL: ${apiUrl}`)
    console.log(`   Environment: ${process.env.NODE_ENV}`)
    
    if (mode === 'mock') {
      console.log('   📝 Test credentials:')
      console.log('      admin@spearfish.io / Password123!')
      console.log('      user@spearfish.io / UserPass123!')
      console.log('      test@example.com / TestPass123!')
    } else if (mode === 'legacy') {
      console.log('   🍪 Using legacy cookie-based authentication')
      console.log('   💡 Set NEXT_PUBLIC_USE_MOCK_AUTH=true to use mocks')
    } else {
      console.log('   🔗 Using OAuth 2.0 platform-api')
      console.log('   💡 Set NEXT_PUBLIC_USE_MOCK_AUTH=true to use mocks')
      console.log('   💡 Set NEXT_PUBLIC_USE_LEGACY_AUTH=true to use legacy auth')
    }
  }
}