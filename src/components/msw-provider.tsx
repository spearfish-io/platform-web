'use client'

import { useEffect, useState } from 'react'
import { isUsingMockAuth, logAuthConfig } from '@/lib/auth-mode'

/**
 * MSW Provider Component
 * 
 * Conditionally initializes Mock Service Worker based on NEXT_PUBLIC_USE_MOCK_AUTH.
 * - If NEXT_PUBLIC_USE_MOCK_AUTH=true: Uses MSW mocks for authentication
 * - If NEXT_PUBLIC_USE_MOCK_AUTH=false or undefined: Uses real platform-api
 */
export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false)
  const shouldUseMocks = isUsingMockAuth()

  useEffect(() => {
    const initMSW = async () => {
      // Log configuration for debugging
      logAuthConfig()

      if (process.env.NODE_ENV === 'development' && shouldUseMocks) {
        try {
          console.log('🔧 Initializing MSW for mock authentication...')
          
          // Dynamic import to avoid including MSW in production bundle
          const { worker } = await import('@/test/mocks/browser')
          
          await worker.start({
            onUnhandledRequest: 'bypass',
            serviceWorker: {
              url: '/mockServiceWorker.js',
            },
            quiet: true, // Reduce console noise
          })
          
          console.log('✅ MSW initialized - authentication requests will be mocked')
        } catch (error) {
          console.warn('❌ Failed to initialize MSW:', error)
          // Continue without MSW if it fails to load
        }
      } else if (shouldUseMocks) {
        console.log('🔧 MSW skipped in production mode')
      } else {
        console.log('🔧 Using real API endpoints (MSW disabled)')
      }
      
      setMswReady(true)
    }

    initMSW()
  }, [shouldUseMocks])

  // In development, wait for MSW setup to complete before rendering
  // In production, render immediately since MSW won't be used
  if (process.env.NODE_ENV === 'development' && !mswReady) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
        color: '#666'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '8px' }}>
            {shouldUseMocks ? '🔧' : '🔗'}
          </div>
          <div>
            {shouldUseMocks 
              ? 'Initializing mock authentication...' 
              : 'Connecting to platform-api...'
            }
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}