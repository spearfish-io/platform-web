describe('Homepage', () => {
  beforeEach(() => {
    cy.visitAndWait('/')
  })

  it('displays the main dashboard', () => {
    cy.shouldBeVisibleAndContain('h1', 'Platform Dashboard')
    cy.get('[data-testid="dashboard-overview"]').should('be.visible')
  })

  it('shows metric cards with proper data', () => {
    // Check that metric cards are present
    cy.get('[data-testid="metric-card"]').should('have.length.at.least', 3)
    
    // Verify metric cards contain numeric values
    cy.get('[data-testid="metric-card"]').each(($card) => {
      cy.wrap($card).should('contain.text', /\d+/)
      cy.wrap($card).should('be.visible')
    })
  })

  it('navigates to analytics page', () => {
    cy.get('[data-testid="nav-analytics"]').click()
    cy.url().should('include', '/analytics')
    cy.shouldBeVisibleAndContain('h1', 'Analytics')
  })

  it('navigates to settings page', () => {
    cy.get('[data-testid="nav-settings"]').click()
    cy.url().should('include', '/settings')
    cy.shouldBeVisibleAndContain('h1', 'Settings')
  })

  it('has proper page title and meta tags', () => {
    cy.title().should('contain', 'Platform Web')
    cy.get('meta[name="description"]').should('exist')
    cy.get('meta[name="viewport"]').should('exist')
  })

  it('displays header navigation', () => {
    cy.get('[data-testid="header"]').should('be.visible')
    cy.get('[data-testid="nav-logo"]').should('be.visible')
    cy.get('[data-testid="nav-menu"]').should('be.visible')
  })

  it('displays sidebar navigation', () => {
    cy.get('[data-testid="sidebar"]').should('be.visible')
    cy.get('[data-testid="nav-analytics"]').should('be.visible')
    cy.get('[data-testid="nav-settings"]').should('be.visible')
  })

  it('is responsive on mobile devices', () => {
    // Test on mobile viewport
    cy.viewport('iphone-8')
    
    cy.get('[data-testid="dashboard-overview"]').should('be.visible')
    cy.get('[data-testid="metric-card"]').should('be.visible')
    
    // Navigation should still be accessible
    cy.get('[data-testid="header"]').should('be.visible')
  })

  it('is responsive on tablet devices', () => {
    // Test on tablet viewport
    cy.viewport('ipad-2')
    
    cy.get('[data-testid="dashboard-overview"]').should('be.visible')
    cy.get('[data-testid="metric-card"]').should('be.visible')
    cy.get('[data-testid="sidebar"]').should('be.visible')
  })

  it('has proper accessibility features', () => {
    cy.checkA11y()
    
    // Check for proper heading hierarchy
    cy.get('h1').should('exist')
    
    // Check that interactive elements have proper roles
    cy.get('button, a[href]').each(($el) => {
      // Each interactive element should have text or aria-label
      cy.wrap($el).should(($element) => {
        const text = $element.text().trim()
        const ariaLabel = $element.attr('aria-label')
        expect(text || ariaLabel).to.not.be.empty
      })
    })
  })

  it('loads within performance targets', () => {
    // Check that page loads quickly
    cy.window().its('performance').invoke('getEntriesByType', 'navigation')
      .then((entries: any) => {
        const navigationEntry = entries[0]
        const loadTime = navigationEntry.loadEventEnd - navigationEntry.navigationStart
        
        // Should load within 3 seconds
        expect(loadTime).to.be.lessThan(3000)
      })
  })

  it('handles keyboard navigation', () => {
    // Test tab navigation
    cy.get('body').tab()
    cy.focused().should('be.visible')
    
    // Test Enter key on navigation items
    cy.get('[data-testid="nav-analytics"]').focus().type('{enter}')
    cy.url().should('include', '/analytics')
  })

  it('shows proper loading states', () => {
    // Intercept API calls to simulate slow loading
    cy.intercept('GET', '/api/**', { delay: 1000 }).as('apiCall')
    
    cy.visit('/')
    
    // Should show loading indicator during API calls
    cy.get('[data-testid="loading"]').should('be.visible')
    
    cy.wait('@apiCall')
    
    // Loading should disappear after API call completes
    cy.get('[data-testid="loading"]').should('not.exist')
  })
})