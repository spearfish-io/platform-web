import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Setup MSW server for Node.js (Vitest) testing
export const server = setupServer(...handlers)

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers()
})

// Close server after all tests
afterAll(() => {
  server.close()
})