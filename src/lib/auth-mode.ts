/**
 * Authentication Mode Utilities
 * 
 * Helper functions to determine whether the application is using
 * mock authentication or real platform-api authentication.
 */

/**
 * Check if the application is configured to use mock authentication
 * @returns true if NEXT_PUBLIC_USE_MOCK_AUTH=true, false otherwise
 */
export function isUsingMockAuth(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true'
}

/**
 * Check if the application is configured to use real platform-api
 * @returns true if NEXT_PUBLIC_USE_MOCK_AUTH is not set to 'true'
 */
export function isUsingRealApi(): boolean {
  return !isUsingMockAuth()
}

/**
 * Get a descriptive string for the current authentication mode
 * @returns 'mock' or 'real-api'
 */
export function getAuthMode(): 'mock' | 'real-api' {
  return isUsingMockAuth() ? 'mock' : 'real-api'
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
      console.log('      admin@spearfish.io / password123')
      console.log('      user@spearfish.io / user123456')
      console.log('      test@example.com / test12345')
    } else {
      console.log('   🔗 Connecting to real platform-api')
      console.log('   💡 Set NEXT_PUBLIC_USE_MOCK_AUTH=true to use mocks')
    }
  }
}