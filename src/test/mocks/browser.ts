import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// Setup MSW worker for browser (Cypress/development) testing
export const worker = setupWorker(...handlers)

// Start the worker only in development/test environments
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })
}