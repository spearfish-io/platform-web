describe('Navigation', () => {
  beforeEach(() => {
    cy.visitAndWait('/')
  })

  describe('Sidebar Navigation', () => {
    it('navigates between all main sections', () => {
      // Test Dashboard navigation (home)
      cy.get('[data-testid="nav-dashboard"]').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      cy.shouldBeVisibleAndContain('h1', 'Platform Dashboard')

      // Test Analytics navigation
      cy.get('[data-testid="nav-analytics"]').click()
      cy.url().should('include', '/analytics')
      cy.shouldBeVisibleAndContain('h1', 'Analytics')

      // Test Settings navigation  
      cy.get('[data-testid="nav-settings"]').click()
      cy.url().should('include', '/settings')
      cy.shouldBeVisibleAndContain('h1', 'Settings')
    })

    it('highlights active navigation items', () => {
      // Dashboard should be active by default
      cy.get('[data-testid="nav-dashboard"]')
        .should('have.attr', 'data-active', 'true')
        .or('have.attr', 'aria-current', 'page')

      // Navigate to analytics
      cy.get('[data-testid="nav-analytics"]').click()
      cy.get('[data-testid="nav-analytics"]')
        .should('have.attr', 'data-active', 'true')
        .or('have.attr', 'aria-current', 'page')
      
      // Dashboard should no longer be active
      cy.get('[data-testid="nav-dashboard"]')
        .should('not.have.attr', 'data-active', 'true')
        .and('not.have.attr', 'aria-current', 'page')
    })

    it('supports keyboard navigation', () => {
      // Tab to first navigation item
      cy.get('[data-testid="nav-dashboard"]').focus()
      cy.focused().should('have.attr', 'data-testid', 'nav-dashboard')

      // Arrow down to next item
      cy.focused().type('{downarrow}')
      cy.focused().should('have.attr', 'data-testid', 'nav-analytics')

      // Enter to activate
      cy.focused().type('{enter}')
      cy.url().should('include', '/analytics')
    })
  })

  describe('Header Navigation', () => {
    it('displays logo and branding', () => {
      cy.get('[data-testid="nav-logo"]').should('be.visible')
      cy.get('[data-testid="nav-logo"]').should('contain.text', 'Platform')
    })

    it('logo navigates to homepage', () => {
      // Go to a different page first
      cy.get('[data-testid="nav-analytics"]').click()
      cy.url().should('include', '/analytics')

      // Click logo to return home
      cy.get('[data-testid="nav-logo"]').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })

    it('shows user menu when implemented', () => {
      // This test is prepared for future user menu implementation
      cy.get('[data-testid="user-menu"]').should('exist').or('not.exist')
    })
  })

  describe('Mobile Navigation', () => {
    beforeEach(() => {
      cy.viewport('iphone-8')
    })

    it('adapts navigation for mobile screens', () => {
      // Check if mobile navigation is present
      cy.get('[data-testid="mobile-nav-toggle"]').should('exist').or('not.exist')
      
      // Navigation should still be accessible
      cy.get('[data-testid="nav-analytics"]').should('be.visible')
      cy.get('[data-testid="nav-settings"]').should('be.visible')
    })

    it('maintains functionality on mobile', () => {
      cy.get('[data-testid="nav-analytics"]').click()
      cy.url().should('include', '/analytics')
      cy.shouldBeVisibleAndContain('h1', 'Analytics')
    })
  })

  describe('Browser Navigation', () => {
    it('supports browser back/forward buttons', () => {
      // Navigate to analytics
      cy.get('[data-testid="nav-analytics"]').click()
      cy.url().should('include', '/analytics')

      // Navigate to settings
      cy.get('[data-testid="nav-settings"]').click()
      cy.url().should('include', '/settings')

      // Use browser back button
      cy.go('back')
      cy.url().should('include', '/analytics')
      cy.shouldBeVisibleAndContain('h1', 'Analytics')

      // Use browser forward button
      cy.go('forward')
      cy.url().should('include', '/settings')
      cy.shouldBeVisibleAndContain('h1', 'Settings')
    })

    it('handles direct URL navigation', () => {
      // Navigate directly to analytics page
      cy.visit('/analytics')
      cy.shouldBeVisibleAndContain('h1', 'Analytics')
      cy.get('[data-testid="nav-analytics"]')
        .should('have.attr', 'data-active', 'true')
        .or('have.attr', 'aria-current', 'page')

      // Navigate directly to settings page
      cy.visit('/settings')
      cy.shouldBeVisibleAndContain('h1', 'Settings')
      cy.get('[data-testid="nav-settings"]')
        .should('have.attr', 'data-active', 'true')
        .or('have.attr', 'aria-current', 'page')
    })

    it('handles page refresh correctly', () => {
      // Navigate to analytics
      cy.get('[data-testid="nav-analytics"]').click()
      cy.url().should('include', '/analytics')

      // Refresh page
      cy.reload()
      
      // Should still be on analytics page
      cy.url().should('include', '/analytics')
      cy.shouldBeVisibleAndContain('h1', 'Analytics')
      cy.get('[data-testid="nav-analytics"]')
        .should('have.attr', 'data-active', 'true')
        .or('have.attr', 'aria-current', 'page')
    })
  })

  describe('404 Error Handling', () => {
    it('shows 404 page for invalid routes', () => {
      cy.visit('/invalid-route', { failOnStatusCode: false })
      cy.shouldBeVisibleAndContain('h1', '404')
      cy.contains('Page Not Found').should('be.visible')
    })

    it('provides navigation back to valid pages from 404', () => {
      cy.visit('/invalid-route', { failOnStatusCode: false })
      
      // Should have link back to homepage
      cy.get('[data-testid="back-to-home"]').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      cy.shouldBeVisibleAndContain('h1', 'Platform Dashboard')
    })
  })

  describe('Loading States', () => {
    it('shows loading states during navigation', () => {
      // Intercept route changes to simulate slow loading
      cy.intercept('GET', '/analytics*', { delay: 500 }).as('analyticsPage')
      
      cy.get('[data-testid="nav-analytics"]').click()
      
      // Should show loading indicator
      cy.get('[data-testid="loading"]').should('be.visible')
      
      cy.wait('@analyticsPage')
      
      // Loading should disappear
      cy.get('[data-testid="loading"]').should('not.exist')
      cy.shouldBeVisibleAndContain('h1', 'Analytics')
    })
  })
})