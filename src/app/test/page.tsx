import * as React from "react";
import {
  Container,
  Heading,
  Text,
  Grid,
  Flex,
  Box,
  Card,
  Badge,
} from "@radix-ui/themes";
import { AppShell } from "@/components/layout/app-shell";
import {
  Palette,
  Package,
  Layers,
  Rocket,
  Eye,
  Lock,
  ArrowRight,
} from "lucide-react";

const testPages = [
  {
    title: "Design System",
    href: "/test/design-system",
    icon: Palette,
    description:
      "Core design system showcase with Pure Radix UI Themes. Color palettes, typography scale, spacing system, and implementation guidelines.",
    badges: ["Design Tokens", "Pure Radix", "WCAG AA"],
  },
  {
    title: "Components",
    href: "/test/components",
    icon: Package,
    description: "Interactive component library with live demonstrations.",
    badges: ["Interactive", "TypeScript"],
  },
  {
    title: "Patterns",
    href: "/test/patterns",
    icon: Layers,
    description:
      "Architecture and development patterns. Server vs Client components, state management, form handling, and feature flags.",
    badges: ["Next.js 15", "React 19", "Best Practices"],
  },
  {
    title: "Performance",
    href: "/test/performance",
    icon: Rocket,
    description:
      "Performance monitoring and optimization showcase. Real-time Core Web Vitals, bundle analysis, and optimization techniques.",
    badges: ["Core Web Vitals", "Bundle Analysis", "OpenTelemetry"],
  },
  {
    title: "Accessibility",
    href: "/test/accessibility",
    icon: Eye,
    description:
      "WCAG AA compliance demonstration with interactive testing tools. Keyboard navigation, screen reader support, and color contrast validation.",
    badges: ["WCAG AA", "Keyboard Nav", "Screen Reader"],
  },
  {
    title: "Auth Demo",
    href: "/test/auth-demo",
    icon: Lock,
    description:
      "Authentication integration demonstration. Auth.js with Spearfish platform, role-based access control, and multi-tenant support.",
    badges: ["Auth.js", "JWT", "Multi-Tenant"],
  },
];

export default function TestIndexPage() {
  return (
    <AppShell>
      <Container size="4" p="6">
        {/* Header */}
        <Box mb="8">
          <Heading size="9" mb="3">
            Platform Web Test Suite
          </Heading>
          <Text size="4" color="gray" mb="4">
            Comprehensive design system documentation, component library, and
            testing tools
          </Text>

          <Flex align="center" gap="2" wrap="wrap">
            <Badge variant="soft" color="blue" size="2">
              Design System Documentation
            </Badge>
            <Badge variant="soft" color="green" size="2">
              Interactive Component Demos
            </Badge>
            <Badge variant="soft" color="purple" size="2">
              Architecture Patterns
            </Badge>
            <Badge variant="soft" color="orange" size="2">
              Canary Testing Tools
            </Badge>
          </Flex>
        </Box>

        {/* Overview Cards */}
        <Grid columns={{ initial: "1", md: "2" }} gap="4" mb="8">
          <Card
            size="3"
            style={{
              background: "var(--blue-2)",
              border: "1px solid var(--blue-6)",
            }}
          >
            <Flex align="start" gap="3">
              <Box style={{ color: "var(--blue-9)" }}>
                <Package style={{ width: "24px", height: "24px" }} />
              </Box>
              <Box>
                <Heading size="4" color="blue" mb="2">
                  For Developers
                </Heading>
                <Text size="2" color="blue">
                  Complete onboarding resource with live examples, interactive
                  playground for testing components, and reference
                  implementation following all platform principles.
                </Text>
              </Box>
            </Flex>
          </Card>

          <Card
            size="3"
            style={{
              background: "var(--green-2)",
              border: "1px solid var(--green-6)",
            }}
          >
            <Flex align="start" gap="3">
              <Box style={{ color: "var(--green-9)" }}>
                <Eye style={{ width: "24px", height: "24px" }} />
              </Box>
              <Box>
                <Heading size="4" color="green" mb="2">
                  For QA/Testing
                </Heading>
                <Text size="2" color="green">
                  Comprehensive canary tests to detect breakages, accessibility
                  validation tools, performance regression detection, and
                  cross-browser compatibility verification.
                </Text>
              </Box>
            </Flex>
          </Card>
        </Grid>

        {/* Test Pages Grid */}
        <Box mb="8">
          <Heading size="6" mb="4">
            Test Pages
          </Heading>

          <Grid columns={{ initial: "1", lg: "2" }} gap="4">
            {testPages.map((page) => {
              const Icon = page.icon;

              return (
                <Card key={page.href} size="3" asChild>
                  <a
                    href={page.href}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <Flex direction="column" gap="4" height="100%">
                      <Flex align="start" gap="3">
                        <Box style={{ color: "var(--purple-9)" }}>
                          <Icon style={{ width: "20px", height: "20px" }} />
                        </Box>
                        <Box style={{ flex: 1 }}>
                          <Flex align="center" justify="between" mb="2">
                            <Heading size="4">{page.title}</Heading>
                            <ArrowRight style={{ color: "var(--gray-9)" }} />
                          </Flex>
                          <Text
                            size="2"
                            color="gray"
                            mb="3"
                            style={{ lineHeight: "1.5" }}
                          >
                            {page.description}
                          </Text>
                        </Box>
                      </Flex>

                      <Flex gap="2" wrap="wrap" style={{ marginTop: "auto" }}>
                        {page.badges.map((badge) => (
                          <Badge
                            key={badge}
                            variant="soft"
                            size="1"
                            color="purple"
                          >
                            {badge}
                          </Badge>
                        ))}
                      </Flex>
                    </Flex>
                  </a>
                </Card>
              );
            })}
          </Grid>
        </Box>

        {/* Development Tools */}
        <Box mb="8">
          <Heading size="6" mb="4">
            Development Tools
          </Heading>
        </Box>

        {/* Platform Principles */}
        <Box mb="8">
          <Heading size="6" mb="4">
            Platform Principles Demonstrated
          </Heading>

          <Grid columns={{ initial: "1", sm: "2", lg: "3" }} gap="3">
            <Card
              size="2"
              style={{
                background: "var(--blue-2)",
                border: "1px solid var(--blue-6)",
              }}
            >
              <Text size="2" weight="medium" color="blue" mb="1">
                Pure Radix UI Themes
              </Text>
              <Text size="1" color="blue">
                Zero custom CSS classes, all styling through component props
              </Text>
            </Card>

            <Card
              size="2"
              style={{
                background: "var(--green-2)",
                border: "1px solid var(--green-6)",
              }}
            >
              <Text size="2" weight="medium" color="green" mb="1">
                Accessibility-First
              </Text>
              <Text size="1" color="green">
                WCAG AA compliance with comprehensive testing tools
              </Text>
            </Card>

            <Card
              size="2"
              style={{
                background: "var(--purple-2)",
                border: "1px solid var(--purple-6)",
              }}
            >
              <Text size="2" weight="medium" color="purple" mb="1">
                Component-Driven
              </Text>
              <Text size="1" color="purple">
                Reusable, composable components with TypeScript interfaces
              </Text>
            </Card>

            <Card
              size="2"
              style={{
                background: "var(--orange-2)",
                border: "1px solid var(--orange-6)",
              }}
            >
              <Text size="2" weight="medium" color="orange" mb="1">
                Performance-First
              </Text>
              <Text size="1" color="orange">
                Real metrics monitoring and optimization techniques
              </Text>
            </Card>

            <Card
              size="2"
              style={{
                background: "var(--red-2)",
                border: "1px solid var(--red-6)",
              }}
            >
              <Text size="2" weight="medium" color="red" mb="1">
                Type Safety
              </Text>
              <Text size="1" color="red">
                Comprehensive TypeScript with runtime validation
              </Text>
            </Card>

            <Card
              size="2"
              style={{
                background: "var(--yellow-2)",
                border: "1px solid var(--yellow-6)",
              }}
            >
              <Text size="2" weight="medium" color="yellow" mb="1">
                Feature-Flag-Driven
              </Text>
              <Text size="1" color="yellow">
                Server-side evaluation patterns and gradual rollouts
              </Text>
            </Card>
          </Grid>
        </Box>

        {/* Environment Info */}
        <Card size="3" style={{ background: "var(--gray-2)" }}>
          <Flex align="center" gap="3">
            <Box style={{ color: "var(--gray-9)" }}>
              <Lock style={{ width: "20px", height: "20px" }} />
            </Box>
            <Box>
              <Heading size="4" mb="2">
                Environment Notice
              </Heading>
              <Text size="2" color="gray">
                These test pages are only available in local development
                environments. They are automatically blocked in Azure dev/prod
                deployments for security.
              </Text>
            </Box>
          </Flex>
        </Card>
      </Container>
    </AppShell>
  );
}
