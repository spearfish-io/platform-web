/**
 * MSW (Mock Service Worker) Initialization
 * 
 * Conditionally initializes MSW in development mode for mocking API requests.
 * This allows us to test authentication flows without needing the platform-api running.
 */

export async function initMsw() {
  if (typeof window === 'undefined') {
    // Server-side: use Node.js server for SSR/SSG
    const { server } = await import('@/test/mocks/server')
    server.listen({ onUnhandledRequest: 'bypass' })
    console.log('🔧 MSW server started for SSR')
  } else {
    // Client-side: use service worker  
    const { worker } = await import('@/test/mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    })
    console.log('🔧 MSW service worker started for client')
  }
}

export async function initMswIfNeeded() {
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_MSW !== 'false') {
    try {
      await initMsw()
    } catch (error) {
      console.warn('Failed to initialize MSW:', error)
    }
  }
}