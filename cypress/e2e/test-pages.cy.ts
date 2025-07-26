/**
 * E2E tests for Platform Web test pages
 * 
 * These tests verify that all design system test pages are functioning
 * correctly and serve as canary tests for architecture breakages.
 */

describe('Design System Test Pages', () => {
  const testPages = [
    {
      name: 'Test Suite',
      path: '/test',
      expectedElements: ['h1']
    },
    {
      name: 'Design System',
      path: '/test/design-system',
      expectedElements: ['[data-testid="design-system-principles"]', 'h1']
    },
    {
      name: 'Components',
      path: '/test/components',
      expectedElements: ['[data-testid="component-showcase"]', 'h1']
    },
    {
      name: 'Patterns',
      path: '/test/patterns',
      expectedElements: ['[data-testid="patterns-demo"]', 'h1']
    },
    {
      name: 'Performance',
      path: '/test/performance',
      expectedElements: ['[data-testid="performance-metrics"]', 'h1']
    },
    {
      name: 'Accessibility',
      path: '/test/accessibility',
      expectedElements: ['[data-testid="a11y-tests"]', 'h1']
    },
    {
      name: 'Auth Demo',
      path: '/test/auth-demo',
      expectedElements: ['[data-testid="auth-demo"]', 'h1']
    }
  ];

  beforeEach(() => {
    // Skip authentication for test pages
    cy.visit('/');
  });

  context('Navigation', () => {
    it('should display test page navigation in sidebar', () => {
      cy.get('[data-testid="sidebar"]').should('be.visible');
      
      // Check main navigation exists
      cy.get('[data-testid="nav-dashboard"]').should('be.visible');
      
      // Check test page navigation exists
      cy.contains('Design System').should('be.visible');
      cy.get('[data-testid="nav-test-suite"]').should('be.visible');
      cy.get('[data-testid="nav-design-system"]').should('be.visible');
      cy.get('[data-testid="nav-components"]').should('be.visible');
      cy.get('[data-testid="nav-patterns"]').should('be.visible');
      cy.get('[data-testid="nav-performance"]').should('be.visible');
      cy.get('[data-testid="nav-accessibility"]').should('be.visible');
      cy.get('[data-testid="nav-auth-demo"]').should('be.visible');
    });

    it('should navigate to test pages via sidebar', () => {
      testPages.forEach((page) => {
        cy.get(`[data-testid="nav-${page.name.toLowerCase().replace(' ', '-')}"]`)
          .click();
        
        cy.url().should('include', page.path);
        cy.get('h1').should('contain.text', page.name);
      });
    });

    it('should highlight active navigation items', () => {
      cy.get('[data-testid="nav-design-system"]').click();
      cy.get('[data-testid="nav-design-system"]')
        .should('have.attr', 'data-active', 'true');
      
      cy.get('[data-testid="nav-components"]').click();
      cy.get('[data-testid="nav-components"]')
        .should('have.attr', 'data-active', 'true');
      cy.get('[data-testid="nav-design-system"]')
        .should('have.attr', 'data-active', 'false');
    });
  });

  context('Page Content and Functionality', () => {
    testPages.forEach((page) => {
      describe(`${page.name} Page`, () => {
        beforeEach(() => {
          cy.visit(page.path);
        });

        it('should load successfully', () => {
          cy.get('h1').should('contain.text', page.name);
          
          // Check for expected elements if specified
          if (page.expectedElements) {
            page.expectedElements.forEach((selector) => {
              cy.get(selector).should('exist');
            });
          }
        });

        it('should have proper page structure', () => {
          // Check for main heading
          cy.get('h1').should('be.visible');
          
          // Check for description text
          cy.get('p').should('exist');
          
          // Check for at least one section or card
          cy.get('section, [role="region"], .card, [data-testid*="card"]')
            .should('have.length.at.least', 1);
        });

        it('should be responsive', () => {
          // Test mobile viewport
          cy.viewport(375, 667);
          cy.get('h1').should('be.visible');
          
          // Test tablet viewport
          cy.viewport(768, 1024);
          cy.get('h1').should('be.visible');
          
          // Test desktop viewport
          cy.viewport(1200, 800);
          cy.get('h1').should('be.visible');
        });

        it('should have no console errors', () => {
          cy.window().then((win) => {
            cy.stub(win.console, 'error').as('consoleError');
          });
          
          cy.wait(1000); // Wait for any async operations
          cy.get('@consoleError').should('not.have.been.called');
        });
      });
    });
  });

  context('Design System Page Specific Tests', () => {
    beforeEach(() => {
      cy.visit('/test/design-system');
    });

    it('should display design tokens', () => {
      cy.contains('Color System').should('be.visible');
      cy.contains('Typography System').should('be.visible');
      cy.contains('Spacing System').should('be.visible');
    });

    it('should show implementation guidelines', () => {
      cy.contains('Best Practices').should('be.visible');
      cy.contains('Pure Radix UI Themes').should('be.visible');
    });
  });

  context('Components Page Specific Tests', () => {
    beforeEach(() => {
      cy.visit('/test/components');
    });

    it('should display interactive component demos', () => {
      cy.get('button').should('have.length.at.least', 3);
      
      // Test button interactions
      cy.get('button').first().click();
    });

    it('should have Ladle integration link', () => {
      cy.contains('Ladle').should('be.visible');
      cy.get('a[href*="61000"]').should('exist');
    });
  });

  context('Performance Page Specific Tests', () => {
    beforeEach(() => {
      cy.visit('/test/performance');
    });

    it('should display performance metrics', () => {
      cy.contains('Core Web Vitals').should('be.visible');
      cy.contains('Bundle Analysis').should('be.visible');
    });

    it('should show optimization techniques', () => {
      cy.contains('Server Components').should('be.visible');
      cy.contains('Image Optimization').should('be.visible');
    });
  });

  context('Accessibility Page Specific Tests', () => {
    beforeEach(() => {
      cy.visit('/test/accessibility');
    });

    it('should display accessibility principles', () => {
      cy.contains('Perceivable').should('be.visible');
      cy.contains('Operable').should('be.visible');
      cy.contains('Understandable').should('be.visible');
      cy.contains('Robust').should('be.visible');
    });

    it('should have interactive accessibility demos', () => {
      // Check for form elements
      cy.get('input[type="email"]').should('exist');
      cy.get('label').should('exist');
      
      // Check for keyboard navigation demo
      cy.get('button').should('have.length.at.least', 2);
    });

    it('should meet basic accessibility standards', () => {
      // Check for proper heading hierarchy
      cy.get('h1').should('have.length', 1);
      cy.get('h2, h3, h4, h5, h6').should('have.length.at.least', 1);
      
      // Check for form labels
      cy.get('label').each(($label) => {
        cy.wrap($label).should('have.attr', 'for');
      });
      
      // Check for alt text on images (if any)
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt');
      });
    });
  });

  context('Auth Demo Page Specific Tests', () => {
    beforeEach(() => {
      cy.visit('/test/auth-demo');
    });

    it('should display authentication information', () => {
      cy.contains('Authentication Integration').should('be.visible');
      cy.contains('Auth.js').should('be.visible');
    });

    it('should show session status', () => {
      // Should show either authenticated or unauthenticated state
      cy.get('body').should('contain.text', 'Session');
    });
  });

  context('Cross-Page Functionality', () => {
    it('should maintain consistent navigation across all pages', () => {
      testPages.forEach((page) => {
        cy.visit(page.path);
        
        // Check that sidebar exists and is consistent
        cy.get('[data-testid="sidebar"]').should('be.visible');
        cy.contains('Platform Web').should('be.visible');
        
        // Check that all navigation links are present
        cy.get('[data-testid^="nav-"]').should('have.length.at.least', 10);
      });
    });

    it('should have consistent page layout', () => {
      testPages.forEach((page) => {
        cy.visit(page.path);
        
        // Check for consistent header structure
        cy.get('h1').should('be.visible');
        
        // Check for consistent badge/tag structure
        cy.get('[data-testid*="badge"], .badge, span').should('exist');
        
        // Check for consistent container/layout
        cy.get('main, [role="main"], .container').should('exist');
      });
    });

    it('should support keyboard navigation', () => {
      cy.visit('/test/design-system');
      
      // Test tab navigation
      cy.get('body').tab();
      cy.focused().should('exist');
      
      // Test navigation links are reachable
      cy.get('[data-testid="nav-components"]').focus().should('be.focused');
      cy.focused().type('{enter}');
      cy.url().should('include', '/test/components');
    });
  });
});