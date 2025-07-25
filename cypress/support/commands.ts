/// <reference types="cypress" />

// Custom commands for E2E testing

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to visit a page and wait for it to load
       * @example cy.visitAndWait('/dashboard')
       */
      visitAndWait(url: string): Chainable<Element>
      
      /**
       * Custom command to check if an element is visible and contains text
       * @example cy.shouldBeVisibleAndContain('[data-testid="title"]', 'Dashboard')
       */
      shouldBeVisibleAndContain(selector: string, text: string): Chainable<Element>
      
      /**
       * Custom command to test accessibility
       * @example cy.checkA11y()
       */
      checkA11y(context?: string, options?: any): Chainable<Element>
    }
  }
}

Cypress.Commands.add('visitAndWait', (url: string) => {
  cy.visit(url)
  cy.get('body').should('be.visible')
  // Wait for any loading indicators to disappear
  cy.get('[data-testid="loading"]').should('not.exist')
  cy.wait(500) // Small buffer for animations
})

Cypress.Commands.add('shouldBeVisibleAndContain', (selector: string, text: string) => {
  cy.get(selector).should('be.visible').and('contain.text', text)
})

Cypress.Commands.add('checkA11y', (context = null, options = {}) => {
  // Basic accessibility checks
  cy.get('body').should('have.attr', 'role').or('not.have.attr', 'role')
  
  // Check for proper heading structure
  cy.get('h1, h2, h3, h4, h5, h6').should('exist')
  
  // Check for alt text on images
  cy.get('img').each(($img) => {
    cy.wrap($img).should('have.attr', 'alt')
  })
  
  // Check for proper button and link labels
  cy.get('button, a').each(($el) => {
    const text = $el.text().trim()
    const ariaLabel = $el.attr('aria-label')
    const title = $el.attr('title')
    
    expect(text || ariaLabel || title).to.not.be.empty
  })
})

export {}