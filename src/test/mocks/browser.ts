import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// Setup MSW worker for browser (Cypress/development) testing
export const worker = setupWorker(...handlers)

// Note: Worker is started manually via MSWProvider component