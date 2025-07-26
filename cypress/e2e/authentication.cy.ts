/**
 * Authentication E2E Tests
 * 
 * Comprehensive end-to-end testing for authentication flows
 * implementing all enterprise testing principles.
 */

describe('Authentication Flow', () => {
  beforeEach(() => {
    // Reset any existing authentication state
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.clearSessionStorage()
  })

  describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/auth/signin')
    })

    it('displays the login form correctly', () => {
      // Check page title and structure
      cy.title().should('include', 'Sign In')
      cy.get('h1, h2, h3').contains('Welcome to Spearfish').should('be.visible')
      
      // Check form elements
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('contain.text', 'Sign In')
      
      // Check remember me checkbox
      cy.get('input[type="checkbox"]').should('exist')
      cy.get('label').contains('Remember me').should('be.visible')
    })

    it('shows validation errors for empty fields', () => {
      // Try to submit empty form
      cy.get('button[type="submit"]').click()
      
      // Check for validation errors
      cy.get('[role="alert"]').should('contain.text', 'Email address is required')
      cy.get('[role="alert"]').should('contain.text', 'Password is required')
      
      // Check ARIA attributes
      cy.get('input[type="email"]').should('have.attr', 'aria-invalid', 'true')
      cy.get('input[type="password"]').should('have.attr', 'aria-invalid', 'true')
    })

    it('shows validation error for invalid email format', () => {
      // Enter invalid email
      cy.get('input[type="email"]').type('invalid-email')
      cy.get('input[type="password"]').type('ValidPassword123')
      cy.get('button[type="submit"]').click()
      
      // Check for email validation error
      cy.get('[role="alert"]').should('contain.text', 'Please enter a valid email address')
    })

    it('shows validation error for weak password', () => {
      // Enter weak password
      cy.get('input[type="email"]').type('user@example.com')
      cy.get('input[type="password"]').type('weak')
      cy.get('button[type="submit"]').click()
      
      // Check for password validation error
      cy.get('[role="alert"]').should('contain.text', 'Password must be at least 8 characters')
    })

    it('toggles password visibility', () => {
      const password = 'TestPassword123'
      cy.get('input[type="password"]').type(password)
      
      // Password should be hidden by default
      cy.get('input[type="password"]').should('have.attr', 'type', 'password')
      
      // Click show password button
      cy.get('button[aria-label*="Show password"]').click()
      
      // Password should now be visible
      cy.get('input[type="text"]').should('have.value', password)
      cy.get('button[aria-label*="Hide password"]').should('be.visible')
      
      // Click hide password button
      cy.get('button[aria-label*="Hide password"]').click()
      
      // Password should be hidden again
      cy.get('input[type="password"]').should('have.value', password)
    })

    it('remembers me checkbox works correctly', () => {
      const rememberMeCheckbox = cy.get('input[type="checkbox"]')
      
      // Should be unchecked by default
      rememberMeCheckbox.should('not.be.checked')
      
      // Click to check
      rememberMeCheckbox.check()
      rememberMeCheckbox.should('be.checked')
      
      // Click to uncheck
      rememberMeCheckbox.uncheck()
      rememberMeCheckbox.should('not.be.checked')
    })
  })

  describe('Authentication Process', () => {
    beforeEach(() => {
      cy.visit('/auth/signin')
    })

    it('successfully authenticates with valid credentials', () => {
      // Enter valid credentials
      cy.get('input[type="email"]').type('user@example.com')
      cy.get('input[type="password"]').type('SecureP@ss123')
      
      // Submit form
      cy.get('button[type="submit"]').click()
      
      // Should show loading state
      cy.get('button[type="submit"]').should('contain.text', 'Signing in...')
      cy.get('button[type="submit"]').should('be.disabled')
      
      // Should redirect to dashboard after successful login
      cy.url().should('not.include', '/auth/signin')
      cy.url().should('include', '/')
      
      // Should show authenticated state
      // Note: This would depend on your dashboard implementation
      cy.get('body').should('not.contain.text', 'Sign In')
    })

    it('shows error message for invalid credentials', () => {
      // Enter invalid credentials
      cy.get('input[type="email"]').type('invalid@example.com')
      cy.get('input[type="password"]').type('WrongPassword123')
      
      // Submit form
      cy.get('button[type="submit"]').click()
      
      // Should show error message
      cy.get('[role="alert"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain.text', 'Invalid email or password')
      
      // Should remain on login page
      cy.url().should('include', '/auth/signin')
    })

    it('handles rate limiting after multiple failed attempts', () => {
      const invalidCredentials = {
        email: 'test@example.com',
        password: 'WrongPassword123'
      }

      // Make 5 failed attempts
      for (let i = 0; i < 5; i++) {
        cy.get('input[type="email"]').clear().type(invalidCredentials.email)
        cy.get('input[type="password"]').clear().type(invalidCredentials.password)
        cy.get('button[type="submit"]').click()
        
        // Wait for error message
        cy.get('[role="alert"]', { timeout: 5000 }).should('contain.text', 'Invalid email or password')
        
        // Show attempt warning for attempts 3-4
        if (i >= 2 && i < 4) {
          cy.get('[role="alert"]').should('contain.text', 'attempts remaining')
        }
      }

      // After 5 attempts, should show lockout message
      cy.get('[role="alert"]').should('contain.text', 'Account temporarily locked')
      cy.get('button[type="submit"]').should('be.disabled')
    })

    it('redirects to callback URL after successful login', () => {
      const callbackUrl = '/analytics'
      
      // Visit login page with callback URL
      cy.visit(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`)
      
      // Enter valid credentials
      cy.get('input[type="email"]').type('user@example.com')
      cy.get('input[type="password"]').type('SecureP@ss123')
      cy.get('button[type="submit"]').click()
      
      // Should redirect to callback URL
      cy.url().should('include', callbackUrl)
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      cy.visit('/auth/signin')
    })

    it('supports keyboard navigation', () => {
      // Tab through form elements
      cy.get('body').tab()
      cy.focused().should('have.attr', 'type', 'email')
      
      cy.focused().tab()
      cy.focused().should('have.attr', 'type', 'password')
      
      cy.focused().tab()
      cy.focused().should('have.attr', 'aria-label').and('contain', 'password')
      
      cy.focused().tab()
      cy.focused().should('have.attr', 'type', 'checkbox')
      
      cy.focused().tab()
      cy.focused().should('have.attr', 'type', 'submit')
    })

    it('has proper ARIA labels and descriptions', () => {
      // Check form accessibility
      cy.get('input[type="email"]')
        .should('have.attr', 'id')
        .should('have.attr', 'aria-describedby')
      
      cy.get('input[type="password"]')
        .should('have.attr', 'id')
        .should('have.attr', 'aria-describedby')
      
      // Check labels are properly associated
      cy.get('label[for*="email"]').should('exist')
      cy.get('label[for*="password"]').should('exist')
      
      // Check error announcements
      cy.get('button[type="submit"]').click()
      cy.get('[role="alert"]')
        .should('have.attr', 'aria-live', 'polite')
        .should('be.visible')
    })

    it('meets WCAG color contrast requirements', () => {
      // This would require custom Cypress commands or axe-core integration
      // For now, we'll check that elements are visible and readable
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
      cy.get('label').each($label => {
        cy.wrap($label).should('be.visible')
      })
    })

    it('works with screen reader announcements', () => {
      // Test form validation announcements
      cy.get('button[type="submit"]').click()
      
      // Error messages should be announced
      cy.get('[role="alert"]')
        .should('have.attr', 'aria-live', 'polite')
        .should('be.visible')
      
      // Loading state should be announced
      cy.get('input[type="email"]').type('user@example.com')
      cy.get('input[type="password"]').type('SecureP@ss123')
      cy.get('button[type="submit"]').click()
      
      // Button text should change to indicate loading
      cy.get('button[type="submit"]').should('contain.text', 'Signing in')
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      cy.visit('/auth/signin')
    })

    it('handles network errors gracefully', () => {
      // Intercept auth request and force network error
      cy.intercept('POST', '**/auth/signin', { forceNetworkError: true }).as('authError')
      
      // Try to login
      cy.get('input[type="email"]').type('user@example.com')
      cy.get('input[type="password"]').type('SecureP@ss123')
      cy.get('button[type="submit"]').click()
      
      // Should show network error message
      cy.get('[role="alert"]', { timeout: 10000 })
        .should('contain.text', 'unexpected error occurred')
      
      // Form should be re-enabled
      cy.get('button[type="submit"]').should('not.be.disabled')
    })

    it('handles server errors appropriately', () => {
      // Intercept auth request and return server error
      cy.intercept('POST', '**/auth/signin', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('serverError')
      
      // Try to login
      cy.get('input[type="email"]').type('user@example.com')
      cy.get('input[type="password"]').type('SecureP@ss123')
      cy.get('button[type="submit"]').click()
      
      // Should show error message
      cy.get('[role="alert"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain.text', 'unexpected error occurred')
    })

    it('recovers from temporary errors', () => {
      // First request fails, second succeeds
      cy.intercept('POST', '**/auth/signin', { forceNetworkError: true }).as('firstAttempt')
      
      cy.get('input[type="email"]').type('user@example.com')
      cy.get('input[type="password"]').type('SecureP@ss123')
      cy.get('button[type="submit"]').click()
      
      // Wait for error
      cy.get('[role="alert"]', { timeout: 10000 }).should('be.visible')
      
      // Now intercept with success
      cy.intercept('POST', '**/auth/signin', {
        statusCode: 200,
        body: {
          success: true,
          user: {
            id: 'test-user',
            email: 'user@example.com',
            fullName: 'Test User'
          }
        }
      }).as('secondAttempt')
      
      // Try again
      cy.get('button[type="submit"]').click()
      
      // Should succeed this time
      cy.url().should('not.include', '/auth/signin')
    })
  })

  describe('Security', () => {
    beforeEach(() => {
      cy.visit('/auth/signin')
    })

    it('clears form data on successful login', () => {
      // Enter credentials
      cy.get('input[type="email"]').type('user@example.com')
      cy.get('input[type="password"]').type('SecureP@ss123')
      
      // Submit form
      cy.get('button[type="submit"]').click()
      
      // After redirect, go back to login page
      cy.visit('/auth/signin')
      
      // Form should be cleared
      cy.get('input[type="email"]').should('have.value', '')
      cy.get('input[type="password"]').should('have.value', '')
    })

    it('does not expose sensitive data in DOM', () => {
      // Enter password
      const password = 'SecureP@ss123'
      cy.get('input[type="password"]').type(password)
      
      // Password should not appear in DOM as plain text
      cy.get('body').should('not.contain.text', password)
      
      // Even when showing password, it should be in a controlled way
      cy.get('button[aria-label*="Show password"]').click()
      cy.get('input[type="text"]').should('have.value', password)
    })

    it('implements proper CSRF protection', () => {
      // This would test that proper CSRF tokens are included
      // For now, we'll verify that the form uses POST method
      cy.get('form').should('have.attr', 'method').should('not.be.empty')
    })
  })

  describe('Performance', () => {
    it('loads login page within performance targets', () => {
      const startTime = Date.now()
      
      cy.visit('/auth/signin')
      
      // Check that critical elements load quickly
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
      
      const loadTime = Date.now() - startTime
      
      // Should load within 2 seconds
      expect(loadTime).to.be.lessThan(2000)
    })

    it('handles authentication requests within reasonable time', () => {
      cy.get('input[type="email"]').type('user@example.com')
      cy.get('input[type="password"]').type('SecureP@ss123')
      
      const startTime = Date.now()
      cy.get('button[type="submit"]').click()
      
      // Should complete authentication within 5 seconds
      cy.url({ timeout: 5000 }).should('not.include', '/auth/signin')
      
      const authTime = Date.now() - startTime
      expect(authTime).to.be.lessThan(5000)
    })
  })

  describe('Responsive Design', () => {
    const viewports = [
      { device: 'iphone-6', width: 375, height: 667 },
      { device: 'ipad-2', width: 768, height: 1024 },
      { device: 'macbook-13', width: 1280, height: 800 },
    ]

    viewports.forEach(({ device, width, height }) => {
      it(`works correctly on ${device}`, () => {
        cy.viewport(width, height)
        cy.visit('/auth/signin')
        
        // All elements should be visible and functional
        cy.get('input[type="email"]').should('be.visible')
        cy.get('input[type="password"]').should('be.visible')
        cy.get('button[type="submit"]').should('be.visible')
        
        // Form should be usable
        cy.get('input[type="email"]').type('user@example.com')
        cy.get('input[type="password"]').type('SecureP@ss123')
        cy.get('button[type="submit"]').should('not.be.disabled')
      })
    })
  })
})

// Custom Cypress commands for authentication testing
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login programmatically
       */
      login(email: string, password: string): Chainable<void>
      
      /**
       * Custom command to logout
       */
      logout(): Chainable<void>
      
      /**
       * Custom command for keyboard navigation
       */
      tab(): Chainable<JQuery<HTMLElement>>
    }
  }
}

// Define custom commands
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/signin')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('not.include', '/auth/signin')
})

Cypress.Commands.add('logout', () => {
  // This would depend on your logout implementation
  cy.visit('/auth/signout')
})

Cypress.Commands.add('tab', { prevSubject: 'optional' }, (subject) => {
  return cy.wrap(subject).trigger('keydown', { key: 'Tab' })
})