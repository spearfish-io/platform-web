// cypress/support/e2e.ts
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests in command log
Cypress.on('window:before:load', (win) => {
  cy.stub(win.console, 'error').callThrough()
  cy.stub(win.console, 'warn').callThrough()
})

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing the test on uncaught exceptions
  // that we don't care about (like React development warnings)
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false
  }
  return true
})