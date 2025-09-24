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
} from "@radix-ui/themes";
import { AppShell } from "@/components/layout/app-shell";
import { ComponentShowcase, CodeExample } from "@/components/test-pages";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Plus, Download, User, BarChart3, Heart, Star } from "lucide-react";

export default function ComponentsPage() {
  const sampleMetric = {
    id: "1",
    title: "Total Users",
    value: 12345,
    change: { value: 12.5, type: "increase" as const },
    icon: User,
  };

  const buttonCode = `import { Button } from "@radix-ui/themes";

// Basic button variants
<Button variant="solid">Solid</Button>
<Button variant="soft">Soft</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// With icons and colors
<Button color="green">
  <Plus />
  Add Item
</Button>`;

  const cardCode = `import { Card, Flex, Text, Heading } from "@radix-ui/themes";

<Card size="3">
  <Flex direction="column" gap="2">
    <Heading size="4">Card Title</Heading>
    <Text size="2" color="gray">
      Card content with proper spacing and typography
    </Text>
  </Flex>
</Card>`;

  const metricCardCode = `import { MetricCard } from "@/components/dashboard/metric-card";

const metric = {
  id: "1",
  title: "Active Users",
  value: 12345,
  change: { value: 12.5, type: "increase" },
  icon: PersonIcon,
};

<MetricCard metric={metric} />`;

  return (
    <AppShell>
      <Container size="4" p="6">
        {/* Header */}
        <Box mb="8">
          <Heading size="9" mb="3">
            Component Library
          </Heading>
          <Text size="4" color="gray" mb="4">
            Interactive showcase of all Platform Web components built with Pure
            Radix UI Themes
          </Text>

          <Flex align="center" gap="2" wrap="wrap">
            <Badge variant="soft" color="blue" size="2">
              Interactive Examples
            </Badge>
            <Badge variant="soft" color="green" size="2">
              Live Component Demos
            </Badge>
            <Badge variant="soft" color="purple" size="2">
              Copy-Paste Ready
            </Badge>
            <Badge variant="soft" color="orange" size="2">
              TypeScript Included
            </Badge>
          </Flex>
        </Box>

        {/* Basic Components */}
        <Box mb="8">
          <Heading size="6" mb="4">
            Basic Components
          </Heading>

          <Grid columns={{ initial: "1" }} gap="6">
            {/* Button Component */}
            <ComponentShowcase
              title="Button"
              description="Interactive buttons with multiple variants, colors, and states"
              code={buttonCode}
              variants={[
                {
                  name: "Variants",
                  component: (
                    <Flex gap="3" wrap="wrap">
                      <Button variant="solid">Solid</Button>
                      <Button variant="soft">Soft</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                    </Flex>
                  ),
                  props: { variant: ["solid", "soft", "outline", "ghost"] },
                },
                {
                  name: "Colors",
                  component: (
                    <Flex gap="3" wrap="wrap">
                      <Button color="blue">Blue</Button>
                      <Button color="green">Green</Button>
                      <Button color="red">Red</Button>
                      <Button color="orange">Orange</Button>
                    </Flex>
                  ),
                  props: { color: ["blue", "green", "red", "orange"] },
                },
                {
                  name: "With Icons",
                  component: (
                    <Flex gap="3" wrap="wrap">
                      <Button>
                        <Plus />
                        Add Item
                      </Button>
                      <Button color="green">
                        <Download />
                        Download
                      </Button>
                      <Button variant="soft" color="red">
                        <Heart />
                        Like
                      </Button>
                    </Flex>
                  ),
                },
                {
                  name: "Sizes",
                  component: (
                    <Flex gap="3" align="center" wrap="wrap">
                      <Button size="1">Small</Button>
                      <Button size="2">Medium</Button>
                      <Button size="3">Large</Button>
                      <Button size="4">Extra Large</Button>
                    </Flex>
                  ),
                  props: { size: ["1", "2", "3", "4"] },
                },
              ]}
            >
              <Button variant="solid">Default Button</Button>
            </ComponentShowcase>

            {/* Card Component */}
            <ComponentShowcase
              title="Card"
              description="Flexible container component with consistent styling and spacing"
              code={cardCode}
              variants={[
                {
                  name: "Card Sizes",
                  component: (
                    <Grid
                      columns={{ initial: "1", sm: "3" }}
                      gap="3"
                      style={{ width: "100%" }}
                    >
                      <Card size="1">
                        <Text size="2">Size 1 - Compact</Text>
                      </Card>
                      <Card size="2">
                        <Text size="2">Size 2 - Standard</Text>
                      </Card>
                      <Card size="3">
                        <Text size="2">Size 3 - Spacious</Text>
                      </Card>
                    </Grid>
                  ),
                  props: { size: ["1", "2", "3"] },
                },
                {
                  name: "Card Content",
                  component: (
                    <Card size="3" style={{ maxWidth: "300px" }}>
                      <Flex direction="column" gap="3">
                        <Flex align="center" gap="2">
                          <Star style={{ color: "var(--orange-9)" }} />
                          <Heading size="4">Featured Content</Heading>
                        </Flex>
                        <Text size="2" color="gray">
                          This card demonstrates proper content structure with
                          icons, headings, and descriptive text.
                        </Text>
                        <Button variant="soft" size="2">
                          Learn More
                        </Button>
                      </Flex>
                    </Card>
                  ),
                },
              ]}
            >
              <Card size="2" p="4" style={{ minWidth: "200px" }}>
                <Heading size="3" mb="2">
                  Sample Card
                </Heading>
                <Text size="2" color="gray">
                  Card content example
                </Text>
              </Card>
            </ComponentShowcase>
          </Grid>
        </Box>

        <Separator size="4" mb="8" />

        {/* Dashboard Components */}
        <Box mb="8">
          <Heading size="6" mb="4">
            Dashboard Components
          </Heading>

          <Grid columns={{ initial: "1" }} gap="6">
            {/* MetricCard Component */}
            <ComponentShowcase
              title="MetricCard"
              description="Specialized cards for displaying KPI metrics with trend indicators"
              code={metricCardCode}
              variants={[
                {
                  name: "Different Metrics",
                  component: (
                    <Grid
                      columns={{ initial: "1", sm: "2", lg: "3" }}
                      gap="4"
                      style={{ width: "100%" }}
                    >
                      <MetricCard
                        metric={{
                          id: "1",
                          title: "Total Users",
                          value: 12345,
                          change: { value: 12.5, type: "increase" },
                          icon: User,
                        }}
                      />
                      <MetricCard
                        metric={{
                          id: "2",
                          title: "Revenue",
                          value: "$45,678",
                          change: { value: 8.2, type: "increase" },
                          icon: BarChart3,
                        }}
                      />
                      <MetricCard
                        metric={{
                          id: "3",
                          title: "Conversion Rate",
                          value: "3.2%",
                          change: { value: -2.1, type: "decrease" },
                          icon: BarChart3,
                        }}
                      />
                    </Grid>
                  ),
                },
                {
                  name: "Without Trend",
                  component: (
                    <Box style={{ maxWidth: "200px" }}>
                      <MetricCard
                        metric={{
                          id: "4",
                          title: "Active Sessions",
                          value: 1234,
                          icon: User,
                        }}
                      />
                    </Box>
                  ),
                },
              ]}
            >
              <Box style={{ maxWidth: "200px" }}>
                <MetricCard metric={sampleMetric} />
              </Box>
            </ComponentShowcase>
          </Grid>
        </Box>

        <Separator size="4" mb="8" />

        {/* Component Guidelines */}
        <Box mb="8">
          <Heading size="6" mb="4">
            Component Development Guidelines
          </Heading>

          <Grid columns={{ initial: "1", lg: "2" }} gap="4" mb="6">
            <Card size="3">
              <Heading size="4" mb="3">
                Pure Radix UI Approach
              </Heading>
              <Flex direction="column" gap="2">
                <Text size="2" color="gray">
                  • Use ONLY Radix UI Themes components
                </Text>
                <Text size="2" color="gray">
                  • Style through component props (variant, color, size)
                </Text>
                <Text size="2" color="gray">
                  • Leverage CSS variables for custom values
                </Text>
                <Text size="2" color="gray">
                  • No custom CSS classes for visual styling
                </Text>
                <Text size="2" color="gray">
                  • Maintain consistent spacing with space props
                </Text>
              </Flex>
            </Card>

            <Card size="3">
              <Heading size="4" mb="3">
                TypeScript Integration
              </Heading>
              <Flex direction="column" gap="2">
                <Text size="2" color="gray">
                  • Define comprehensive prop interfaces
                </Text>
                <Text size="2" color="gray">
                  • Use React.forwardRef for ref forwarding
                </Text>
                <Text size="2" color="gray">
                  • Export component types for consumers
                </Text>
                <Text size="2" color="gray">
                  • Include proper displayName for debugging
                </Text>
                <Text size="2" color="gray">
                  • Support asChild prop when appropriate
                </Text>
              </Flex>
            </Card>
          </Grid>

          <CodeExample
            title="Component Template"
            description="Standard template for creating new components"
            language="tsx"
            code={`import * as React from "react";
import { Box, Flex, Text } from "@radix-ui/themes";

interface MyComponentProps {
  title: string;
  variant?: "surface" | "classic" | "soft";
  size?: "1" | "2" | "3";
  children?: React.ReactNode;
}

export const MyComponent = React.forwardRef<
  HTMLDivElement,
  MyComponentProps
>(({ title, variant = "surface", size = "2", children, ...props }, ref) => {
  return (
    <Box
      ref={ref}
      p={size}
      style={{ 
        background: variant === "surface" ? "var(--gray-2)" : undefined 
      }}
      {...props}
    >
      <Text size={size} weight="bold" mb="2">
        {title}
      </Text>
      {children}
    </Box>
  );
});

MyComponent.displayName = "MyComponent";`}
          />
        </Box>
      </Container>
    </AppShell>
  );
}
