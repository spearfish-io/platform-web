"use client";

import * as React from "react";
import { 
  Container, 
  Heading, 
  Text, 
  Grid, 
  Flex, 
  Box, 
  Card,
  Separator,
  Badge,
  Button,
  TextField,
  Switch
} from "@radix-ui/themes";
import { AppShell } from "@/components/layout/app-shell";
import { 
  AccessibilityTest, 
  WCAGChecklist,
  CodeExample 
} from "@/components/test-pages";
import { 
  AccessibleForm,
  ColorContrastDemo,
  KeyboardNavigationDemo
} from "@/components/test-pages/interactive-examples";
import { 
  EyeOpenIcon,
  KeyboardIcon,
  SpeakerLoudIcon,
  PersonIcon,
  CheckCircledIcon,
  CrossCircledIcon
} from "@radix-ui/react-icons";

// Interactive components imported from interactive-examples.tsx

export default function AccessibilityPage() {
  const formTests = [
    {
      name: "Form Labels",
      status: "pass" as const,
      description: "All form inputs have proper labels",
      impact: "critical" as const
    },
    {
      name: "ARIA Descriptions",
      status: "pass" as const,
      description: "Help text properly associated with inputs",
      impact: "serious" as const
    },
    {
      name: "Required Field Indication",
      status: "pass" as const,
      description: "Required fields are clearly marked",
      impact: "moderate" as const
    },
    {
      name: "Error Messages",
      status: "manual" as const,
      description: "Error messages need manual testing",
      impact: "critical" as const
    }
  ];

  const keyboardTests = [
    {
      name: "Tab Order",
      status: "pass" as const,
      description: "Logical tab order through interactive elements",
      impact: "critical" as const
    },
    {
      name: "Focus Indicators",
      status: "pass" as const,
      description: "Visible focus indicators on all focusable elements",
      impact: "serious" as const
    },
    {
      name: "Keyboard Shortcuts",
      status: "pass" as const,
      description: "Standard keyboard shortcuts work as expected",
      impact: "moderate" as const
    },
    {
      name: "Skip Links",
      status: "warning" as const,
      description: "Skip to content link should be added",
      impact: "moderate" as const
    }
  ];

  const colorTests = [
    {
      name: "Text Contrast",
      status: "pass" as const,
      description: "All text meets WCAG AA contrast requirements",
      impact: "critical" as const
    },
    {
      name: "Interactive Element Contrast",
      status: "pass" as const,
      description: "Buttons and links have sufficient contrast",
      impact: "serious" as const
    },
    {
      name: "Color-Only Information",
      status: "pass" as const,
      description: "Information not conveyed by color alone",
      impact: "moderate" as const
    }
  ];

  const wcagChecks = [
    {
      criterion: "1.1.1 Non-text Content",
      description: "All images have appropriate alt text",
      status: "pass" as const,
    },
    {
      criterion: "1.3.1 Info and Relationships",
      description: "Content structure is conveyed through markup",
      status: "pass" as const,
    },
    {
      criterion: "1.4.3 Contrast (Minimum)",
      description: "Text has a contrast ratio of at least 4.5:1",
      status: "pass" as const,
    },
    {
      criterion: "2.1.1 Keyboard",
      description: "All functionality available via keyboard",
      status: "pass" as const,
    },
    {
      criterion: "2.4.3 Focus Order",
      description: "Focus order is logical and intuitive",
      status: "pass" as const,
    },
    {
      criterion: "3.2.2 On Input",
      description: "Changing form controls doesn't cause unexpected changes",
      status: "pass" as const,
    },
    {
      criterion: "4.1.2 Name, Role, Value",
      description: "UI components have accessible names and roles",
      status: "pass" as const,
    }
  ];

  const accessibilityCodeExamples = `// Proper semantic HTML structure
<main>
  <section aria-labelledby="features-heading">
    <Heading id="features-heading" size="6">
      Platform Features
    </Heading>
    <Text>Description of features...</Text>
  </section>
</main>

// Form accessibility
<Box>
  <Text as="label" htmlFor="email">Email Address</Text>
  <TextField
    id="email"
    type="email"
    required
    aria-describedby="email-help"
    aria-invalid={hasError}
  />
  <Text id="email-help" size="1">
    Help text for the email field
  </Text>
  {hasError && (
    <Text role="alert" color="red">
      Please enter a valid email address
    </Text>
  )}
</Box>

// Interactive elements
<Button
  aria-label="Close dialog"
  onClick={handleClose}
>
  <CrossIcon />
</Button>

// Focus management
const dialogRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (isOpen) {
    dialogRef.current?.focus();
  }
}, [isOpen]);`;

  const screenReaderCode = `// Screen reader announcements
import { VisuallyHidden } from '@/components/ui/visually-hidden';

function StatusUpdate({ status }: { status: string }) {
  return (
    <>
      <Text>Current status: {status}</Text>
      <VisuallyHidden>
        <div aria-live="polite" aria-atomic="true">
          Status updated to {status}
        </div>
      </VisuallyHidden>
    </>
  );
}

// Loading states for screen readers
function LoadingButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button disabled={isLoading}>
      {isLoading ? (
        <>
          <span aria-hidden="true">⏳</span>
          <VisuallyHidden>Loading</VisuallyHidden>
          Please wait...
        </>
      ) : (
        "Submit"
      )}
    </Button>
  );
}`;

  const testingCode = `// Accessibility testing with jest-axe
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

test('Component should not have accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Cypress accessibility testing
describe('Accessibility', () => {
  it('should not have accessibility violations', () => {
    cy.visit('/');
    cy.injectAxe();
    cy.checkA11y();
  });
  
  it('should be keyboard navigable', () => {
    cy.visit('/');
    cy.tab().tab().tab(); // Navigate with keyboard
    cy.focused().should('have.attr', 'role', 'button');
  });
});`;

  return (
    <AppShell>
      <Container size="4" p="6">
        {/* Header */}
        <Box mb="8">
          <Heading size="9" mb="3">
            Accessibility Standards
          </Heading>
          <Text size="4" color="gray" mb="4">
            WCAG AA compliance demonstration with interactive accessibility testing tools
          </Text>
          
          <Flex align="center" gap="2" wrap="wrap">
            <Badge variant="soft" color="blue" size="2">
              WCAG AA Compliant
            </Badge>
            <Badge variant="soft" color="green" size="2">
              Keyboard Navigation
            </Badge>
            <Badge variant="soft" color="purple" size="2">
              Screen Reader Ready
            </Badge>
            <Badge variant="soft" color="orange" size="2">
              Color Contrast Verified
            </Badge>
          </Flex>
        </Box>

        {/* Accessibility Principles */}
        <Box mb="8">
          <Heading size="6" mb="4">Accessibility Principles</Heading>
          
          <Grid columns={{ initial: "1", md: "2" }} gap="4" mb="6">
            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--blue-9)" }}>
                  <EyeOpenIcon style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">Perceivable</Heading>
                  <Text size="2" color="gray">
                    Information and UI components must be presentable in ways users can perceive. 
                    This includes proper color contrast, alternative text, and adaptable content.
                  </Text>
                </Box>
              </Flex>
            </Card>

            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--green-9)" }}>
                  <KeyboardIcon style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">Operable</Heading>
                  <Text size="2" color="gray">
                    UI components and navigation must be operable by all users. 
                    This includes keyboard accessibility and sufficient time limits.
                  </Text>
                </Box>
              </Flex>
            </Card>

            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--purple-9)" }}>
                  <SpeakerLoudIcon style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">Understandable</Heading>
                  <Text size="2" color="gray">
                    Information and UI operation must be understandable. 
                    This includes readable text and predictable functionality.
                  </Text>
                </Box>
              </Flex>
            </Card>

            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--orange-9)" }}>
                  <PersonIcon style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">Robust</Heading>
                  <Text size="2" color="gray">
                    Content must be robust enough for interpretation by assistive technologies. 
                    This includes valid code and compatibility.
                  </Text>
                </Box>
              </Flex>
            </Card>
          </Grid>
        </Box>

        <Separator size="4" mb="8" />

        {/* Interactive Accessibility Tests */}
        <Box mb="8">
          <Heading size="6" mb="4">Interactive Accessibility Tests</Heading>
          
          <Grid columns={{ initial: "1" }} gap="6">
            {/* Form Accessibility */}
            <AccessibilityTest
              title="Form Accessibility"
              description="Proper labels, ARIA descriptions, and semantic form structure"
              tests={formTests}
              category="semantic"
            >
              <AccessibleForm />
            </AccessibilityTest>

            {/* Keyboard Navigation */}
            <AccessibilityTest
              title="Keyboard Navigation"
              description="Full keyboard accessibility with logical tab order and focus management"
              tests={keyboardTests}
              category="keyboard"
            >
              <KeyboardNavigationDemo />
            </AccessibilityTest>

            {/* Color Contrast */}
            <AccessibilityTest
              title="Color Contrast"
              description="WCAG AA compliant color contrast ratios for all text and interactive elements"
              tests={colorTests}
              category="color-contrast"
            >
              <ColorContrastDemo />
            </AccessibilityTest>
          </Grid>
        </Box>

        <Separator size="4" mb="8" />

        {/* WCAG Compliance */}
        <Box mb="8">
          <Heading size="6" mb="4">WCAG AA Compliance</Heading>
          <WCAGChecklist level="AA" checks={wcagChecks} />
        </Box>

        <Separator size="4" mb="8" />

        {/* Implementation Examples */}
        <Box mb="8">
          <Heading size="6" mb="4">Implementation Examples</Heading>
          
          <Grid columns={{ initial: "1" }} gap="6">
            <CodeExample
              title="Semantic HTML and ARIA"
              description="Proper semantic structure with ARIA attributes for enhanced accessibility"
              code={accessibilityCodeExamples}
            />

            <CodeExample
              title="Screen Reader Support"
              description="Live regions and announcements for dynamic content"
              code={screenReaderCode}
            />

            <CodeExample
              title="Accessibility Testing"
              description="Automated accessibility testing with jest-axe and Cypress"
              code={testingCode}
            />
          </Grid>
        </Box>

        <Separator size="4" mb="8" />

        {/* Accessibility Checklist */}
        <Box mb="8">
          <Heading size="6" mb="4">Development Checklist</Heading>
          
          <Grid columns={{ initial: "1", lg: "2" }} gap="4">
            <Card size="3" style={{ background: "var(--green-2)", border: "1px solid var(--green-6)" }}>
              <Heading size="4" color="green" mb="3">✅ Required Practices</Heading>
              <Flex direction="column" gap="2">
                <Flex align="center" gap="2">
                  <CheckCircledIcon style={{ color: "var(--green-9)" }} />
                  <Text size="2" color="green">Semantic HTML elements</Text>
                </Flex>
                <Flex align="center" gap="2">
                  <CheckCircledIcon style={{ color: "var(--green-9)" }} />
                  <Text size="2" color="green">Proper heading hierarchy</Text>
                </Flex>
                <Flex align="center" gap="2">
                  <CheckCircledIcon style={{ color: "var(--green-9)" }} />
                  <Text size="2" color="green">Alternative text for images</Text>
                </Flex>
                <Flex align="center" gap="2">
                  <CheckCircledIcon style={{ color: "var(--green-9)" }} />
                  <Text size="2" color="green">Keyboard navigation support</Text>
                </Flex>
                <Flex align="center" gap="2">
                  <CheckCircledIcon style={{ color: "var(--green-9)" }} />
                  <Text size="2" color="green">WCAG AA color contrast</Text>
                </Flex>
                <Flex align="center" gap="2">
                  <CheckCircledIcon style={{ color: "var(--green-9)" }} />
                  <Text size="2" color="green">Form labels and descriptions</Text>
                </Flex>
              </Flex>
            </Card>

            <Card size="3" style={{ background: "var(--blue-2)", border: "1px solid var(--blue-6)" }}>
              <Heading size="4" color="blue" mb="3">🧪 Testing Methods</Heading>
              <Flex direction="column" gap="2">
                <Text size="2" color="blue">• Automated testing with jest-axe</Text>
                <Text size="2" color="blue">• Screen reader testing (NVDA, JAWS)</Text>
                <Text size="2" color="blue">• Keyboard-only navigation testing</Text>
                <Text size="2" color="blue">• Color contrast verification tools</Text>
                <Text size="2" color="blue">• Focus management validation</Text>
                <Text size="2" color="blue">• Cypress accessibility integration</Text>
              </Flex>
            </Card>
          </Grid>
        </Box>

        {/* Quick Actions */}
        <Box>
          <Heading size="5" mb="4">Accessibility Tools</Heading>
          <Flex gap="3" wrap="wrap">
            <Button variant="solid" onClick={() => window.open('https://www.w3.org/WAI/WCAG21/quickref/', '_blank')}>
              WCAG Quick Reference
            </Button>
            <Button variant="soft" onClick={() => window.open('https://webaim.org/resources/contrastchecker/', '_blank')}>
              Contrast Checker
            </Button>
            <Button variant="soft" asChild>
              <a href="/components">Test Components</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/design-system">Design System</a>
            </Button>
          </Flex>
        </Box>
      </Container>
    </AppShell>
  );
}