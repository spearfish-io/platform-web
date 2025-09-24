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
} from "@radix-ui/themes";
import { AppShell } from "@/components/layout/app-shell";
import {
  ColorToken,
  SpaceToken,
  TypographyToken,
  DesignToken,
  CodeExample,
} from "@/components/test-pages";
import { Palette, Move, Type, Sparkles } from "lucide-react";

export default function DesignSystemPage() {
  return (
    <AppShell>
      <Container size="4" p="6">
        {/* Header */}
        <Box mb="8">
          <Heading size="9" mb="3">
            Design System
          </Heading>
          <Text size="4" color="gray" mb="4">
            Comprehensive showcase of Platform Web's design principles using
            Pure Radix UI Themes
          </Text>

          <Flex align="center" gap="2" wrap="wrap">
            <Badge variant="soft" color="blue" size="2">
              Pure Radix UI Themes
            </Badge>
            <Badge variant="soft" color="green" size="2">
              Zero Custom CSS
            </Badge>
            <Badge variant="soft" color="purple" size="2">
              WCAG AA Compliant
            </Badge>
            <Badge variant="soft" color="orange" size="2">
              Component-Driven
            </Badge>
          </Flex>
        </Box>

        {/* Design Principles */}
        <Box mb="8">
          <Heading size="6" mb="4">
            Design Principles
          </Heading>

          <Grid columns={{ initial: "1", md: "2" }} gap="4" mb="6">
            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--blue-9)" }}>
                  <Palette style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">
                    Pure Radix UI Themes
                  </Heading>
                  <Text size="2" color="gray" mb="3">
                    All styling achieved exclusively through Radix UI Themes
                    component props. Zero custom CSS classes or Tailwind
                    utilities in components.
                  </Text>
                  <Badge variant="soft" color="blue" size="1">
                    Mandatory Principle
                  </Badge>
                </Box>
              </Flex>
            </Card>

            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--green-9)" }}>
                  <Type style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">
                    Accessibility-First
                  </Heading>
                  <Text size="2" color="gray" mb="3">
                    WCAG AA compliance mandatory. Semantic HTML, proper ARIA
                    labels, keyboard navigation, and screen reader
                    compatibility.
                  </Text>
                  <Badge variant="soft" color="green" size="1">
                    Core Requirement
                  </Badge>
                </Box>
              </Flex>
            </Card>

            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--purple-9)" }}>
                  <Move style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">
                    Component-Driven
                  </Heading>
                  <Text size="2" color="gray" mb="3">
                    Reusable, composable components following Radix design
                    system. Each component includes TypeScript interfaces and
                    proper accessibility.
                  </Text>
                  <Badge variant="soft" color="purple" size="1">
                    Architecture
                  </Badge>
                </Box>
              </Flex>
            </Card>

            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--orange-9)" }}>
                  <Sparkles style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">
                    Performance-First
                  </Heading>
                  <Text size="2" color="gray" mb="3">
                    Server Components, code splitting, optimized bundles, and
                    comprehensive performance monitoring with Core Web Vitals.
                  </Text>
                  <Badge variant="soft" color="orange" size="1">
                    Optimization
                  </Badge>
                </Box>
              </Flex>
            </Card>
          </Grid>
        </Box>

        <Separator size="4" mb="8" />

        {/* Color System */}
        <Box mb="8">
          <Heading size="6" mb="4">
            Color System
          </Heading>
          <Text size="3" color="gray" mb="6">
            Radix UI Themes provides a comprehensive color system with semantic
            color scales. All colors are accessible and work in both light and
            dark themes.
          </Text>

          <Box mb="6">
            <Heading size="4" mb="3">
              Primary Colors
            </Heading>
            <Grid columns={{ initial: "2", sm: "3", lg: "6" }} gap="3">
              <ColorToken name="Blue 9" cssVar="--blue-9" scale={9} />
              <ColorToken name="Green 9" cssVar="--green-9" scale={9} />
              <ColorToken name="Red 9" cssVar="--red-9" scale={9} />
              <ColorToken name="Orange 9" cssVar="--orange-9" scale={9} />
              <ColorToken name="Purple 9" cssVar="--purple-9" scale={9} />
              <ColorToken name="Gray 9" cssVar="--gray-9" scale={9} />
            </Grid>
          </Box>

          <Box mb="6">
            <Heading size="4" mb="3">
              Surface Colors
            </Heading>
            <Grid columns={{ initial: "2", sm: "4" }} gap="3">
              <ColorToken name="Gray 1" cssVar="--gray-1" scale={1} />
              <ColorToken name="Gray 2" cssVar="--gray-2" scale={2} />
              <ColorToken name="Gray 3" cssVar="--gray-3" scale={3} />
              <ColorToken name="Gray 4" cssVar="--gray-4" scale={4} />
            </Grid>
          </Box>

          <CodeExample
            title="Color Usage Example"
            language="tsx"
            code={`// ✅ CORRECT - Use Radix color props
<Button color="blue" variant="solid">Primary Action</Button>
<Text color="gray">Subtle text</Text>
<Box style={{ background: "var(--blue-2)" }}>Surface</Box>

// ❌ INCORRECT - No custom CSS classes
<button className="bg-blue-500 text-white">Button</button>`}
          />
        </Box>

        <Separator size="4" mb="8" />

        {/* Typography System */}
        <Box mb="8">
          <Heading size="6" mb="4">
            Typography System
          </Heading>
          <Text size="3" color="gray" mb="6">
            Radix UI Themes provides a structured typography scale with
            consistent sizing, line heights, and spacing relationships.
          </Text>

          <Box mb="6">
            <Heading size="4" mb="3">
              Heading Scale
            </Heading>
            <Grid columns={{ initial: "1", sm: "2", lg: "3" }} gap="3">
              <TypographyToken name="Display" size="9" />
              <TypographyToken name="Heading 1" size="8" />
              <TypographyToken name="Heading 2" size="7" />
              <TypographyToken name="Heading 3" size="6" />
              <TypographyToken name="Heading 4" size="5" />
              <TypographyToken name="Heading 5" size="4" />
            </Grid>
          </Box>

          <Box mb="6">
            <Heading size="4" mb="3">
              Text Sizes
            </Heading>
            <Card size="3" p="4">
              <Flex direction="column" gap="3">
                <Text size="4">
                  Large text (size 4) - For prominent descriptions
                </Text>
                <Text size="3">
                  Body text (size 3) - Standard paragraph text
                </Text>
                <Text size="2">
                  Small text (size 2) - UI labels and secondary content
                </Text>
                <Text size="1">
                  Caption text (size 1) - Fine print and metadata
                </Text>
              </Flex>
            </Card>
          </Box>

          <CodeExample
            title="Typography Usage"
            language="tsx"
            code={`// Headings with semantic hierarchy
<Heading size="8">Page Title</Heading>
<Heading size="6">Section Title</Heading>
<Heading size="4">Subsection</Heading>

// Text with appropriate sizing
<Text size="3">Main content and descriptions</Text>
<Text size="2" color="gray">Labels and secondary info</Text>
<Text size="1" color="gray">Metadata and captions</Text>

// Typography with semantic weight
<Text weight="bold">Important content</Text>
<Text weight="medium">Emphasized content</Text>`}
          />
        </Box>

        <Separator size="4" mb="8" />

        {/* Spacing System */}
        <Box mb="8">
          <Heading size="6" mb="4">
            Spacing System
          </Heading>
          <Text size="3" color="gray" mb="6">
            Consistent spacing scale using Radix UI Themes space tokens. All
            spacing follows the 4px baseline grid for visual harmony.
          </Text>

          <Grid columns={{ initial: "2", sm: "3", lg: "4" }} gap="3" mb="6">
            <SpaceToken name="Space 1" cssVar="--space-1" pixelValue="4px" />
            <SpaceToken name="Space 2" cssVar="--space-2" pixelValue="8px" />
            <SpaceToken name="Space 3" cssVar="--space-3" pixelValue="12px" />
            <SpaceToken name="Space 4" cssVar="--space-4" pixelValue="16px" />
            <SpaceToken name="Space 5" cssVar="--space-5" pixelValue="20px" />
            <SpaceToken name="Space 6" cssVar="--space-6" pixelValue="24px" />
            <SpaceToken name="Space 7" cssVar="--space-7" pixelValue="28px" />
            <SpaceToken name="Space 8" cssVar="--space-8" pixelValue="32px" />
          </Grid>

          <CodeExample
            title="Spacing Usage"
            language="tsx"
            code={`// Padding and margins with space props
<Box p="4">Padding on all sides</Box>
<Box px="6" py="4">Horizontal and vertical padding</Box>
<Box m="3">Margin on all sides</Box>

// Gap in Flex and Grid layouts
<Flex gap="3">...</Flex>
<Grid gap="4">...</Grid>

// Using CSS variables for custom spacing
<Box style={{ padding: "var(--space-5)" }}>Custom spacing</Box>`}
          />
        </Box>

        <Separator size="4" mb="8" />

        {/* Radius and Shadows */}
        <Box mb="8">
          <Heading size="6" mb="4">
            Radius & Elevation
          </Heading>

          <Grid columns={{ initial: "1", md: "2" }} gap="6">
            <Box>
              <Heading size="4" mb="3">
                Border Radius
              </Heading>
              <Flex direction="column" gap="3">
                <DesignToken
                  name="Radius 1"
                  value="--radius-1 (2px)"
                  category="radius"
                  description="Small radius for tight components"
                  preview={
                    <Box
                      style={{
                        width: "24px",
                        height: "24px",
                        background: "var(--blue-9)",
                        borderRadius: "var(--radius-1)",
                      }}
                    />
                  }
                />
                <DesignToken
                  name="Radius 3"
                  value="--radius-3 (6px)"
                  category="radius"
                  description="Standard radius for most components"
                  preview={
                    <Box
                      style={{
                        width: "24px",
                        height: "24px",
                        background: "var(--green-9)",
                        borderRadius: "var(--radius-3)",
                      }}
                    />
                  }
                />
                <DesignToken
                  name="Radius 6"
                  value="--radius-6 (12px)"
                  category="radius"
                  description="Large radius for prominent elements"
                  preview={
                    <Box
                      style={{
                        width: "24px",
                        height: "24px",
                        background: "var(--purple-9)",
                        borderRadius: "var(--radius-6)",
                      }}
                    />
                  }
                />
              </Flex>
            </Box>

            <Box>
              <Heading size="4" mb="3">
                Card Sizes
              </Heading>
              <Flex direction="column" gap="3">
                <Card size="1" p="3">
                  <Text size="2">Card size="1" - Compact content</Text>
                </Card>
                <Card size="2" p="3">
                  <Text size="2">Card size="2" - Standard content</Text>
                </Card>
                <Card size="3" p="3">
                  <Text size="2">Card size="3" - Spacious content</Text>
                </Card>
              </Flex>
            </Box>
          </Grid>
        </Box>

        {/* Implementation Guidelines */}
        <Box mb="8">
          <Heading size="6" mb="4">
            Implementation Guidelines
          </Heading>

          <Grid columns={{ initial: "1", lg: "2" }} gap="4">
            <Card
              size="3"
              style={{
                background: "var(--green-2)",
                border: "1px solid var(--green-6)",
              }}
            >
              <Heading size="4" color="green" mb="3">
                ✅ Best Practices
              </Heading>
              <Flex direction="column" gap="2">
                <Text size="2" color="green">
                  • Use ONLY Radix UI Themes components and props
                </Text>
                <Text size="2" color="green">
                  • Leverage color, size, variant props for styling
                </Text>
                <Text size="2" color="green">
                  • Use CSS variables for custom values when needed
                </Text>
                <Text size="2" color="green">
                  • Follow semantic HTML structure
                </Text>
                <Text size="2" color="green">
                  • Test with keyboard navigation and screen readers
                </Text>
              </Flex>
            </Card>

            <Card
              size="3"
              style={{
                background: "var(--red-2)",
                border: "1px solid var(--red-6)",
              }}
            >
              <Heading size="4" color="red" mb="3">
                ❌ Avoid These
              </Heading>
              <Flex direction="column" gap="2">
                <Text size="2" color="red">
                  • Custom CSS classes for visual styling
                </Text>
                <Text size="2" color="red">
                  • Tailwind utility classes in component JSX
                </Text>
                <Text size="2" color="red">
                  • Inline styles for color and spacing
                </Text>
                <Text size="2" color="red">
                  • Non-semantic HTML structure
                </Text>
                <Text size="2" color="red">
                  • Missing accessibility attributes
                </Text>
              </Flex>
            </Card>
          </Grid>
        </Box>

        {/* Quick Actions */}
        <Box>
          <Heading size="5" mb="4">
            Explore More
          </Heading>
          <Flex gap="3" wrap="wrap">
            <Button variant="solid" asChild>
              <a href="/components">View Components</a>
            </Button>
            <Button variant="soft" asChild>
              <a href="/patterns">Development Patterns</a>
            </Button>
            <Button variant="soft" asChild>
              <a href="/accessibility">Accessibility Guide</a>
            </Button>
          </Flex>
        </Box>
      </Container>
    </AppShell>
  );
}
