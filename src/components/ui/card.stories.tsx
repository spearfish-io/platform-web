import type { Story } from "@ladle/react"
import { Card } from "./card"
import { Button, Text, Heading, Flex, Badge } from "@radix-ui/themes"
import { PersonIcon, GearIcon, StarIcon } from "@radix-ui/react-icons"

/**
 * Card Component Stories
 * 
 * Demonstrates different card layouts and content types
 * for consistent design system implementation.
 */

export default {
  title: "UI Components/Card",
  component: Card,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["surface", "classic", "soft"],
      defaultValue: "surface",
    },
    size: {
      control: { type: "select" },
      options: ["1", "2", "3", "4", "5"],
      defaultValue: "3",
    },
  },
}

/**
 * Default Card
 */
export const Default: Story = (args) => (
  <Card {...args}>
    <Text>This is a basic card with some content inside.</Text>
  </Card>
)

Default.args = {
  variant: "surface",
  size: "3",
}

/**
 * Card Variants
 */
export const Variants: Story = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
    <Card variant="surface">
      <Text weight="bold">Surface Card</Text>
      <Text size="2" color="gray">Default card variant with subtle background</Text>
    </Card>
    
    <Card variant="classic">
      <Text weight="bold">Classic Card</Text>
      <Text size="2" color="gray">Traditional card with border and shadow</Text>
    </Card>
    
    <Card variant="soft">
      <Text weight="bold">Soft Card</Text>
      <Text size="2" color="gray">Gentle card with soft appearance</Text>
    </Card>
  </div>
)

/**
 * Card Sizes
 */
export const Sizes: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <Card size="1">
      <Text size="1">Size 1 - Compact card</Text>
    </Card>
    
    <Card size="2">
      <Text size="2">Size 2 - Small card</Text>
    </Card>
    
    <Card size="3">
      <Text size="3">Size 3 - Medium card (default)</Text>
    </Card>
    
    <Card size="4">
      <Text size="4">Size 4 - Large card</Text>
    </Card>
    
    <Card size="5">
      <Text size="5">Size 5 - Extra large card</Text>
    </Card>
  </div>
)

/**
 * Profile Card Example
 */
export const ProfileCard: Story = () => (
  <Card size="3" style={{ maxWidth: "300px" }}>
    <Flex direction="column" gap="3">
      <Flex align="center" gap="3">
        <div style={{ 
          width: "48px", 
          height: "48px", 
          borderRadius: "50%", 
          background: "var(--blue-9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white"
        }}>
          <PersonIcon width="24" height="24" />
        </div>
        
        <Flex direction="column" gap="1">
          <Text weight="bold" size="3">John Doe</Text>
          <Text size="2" color="gray">Software Engineer</Text>
        </Flex>
      </Flex>
      
      <Text size="2">
        Full-stack developer with 5+ years of experience building scalable web applications.
      </Text>
      
      <Flex gap="2" align="center">
        <Badge color="blue">React</Badge>
        <Badge color="green">Node.js</Badge>
        <Badge color="purple">TypeScript</Badge>
      </Flex>
      
      <Flex gap="2" mt="2">
        <Button variant="soft" size="2" style={{ flex: 1 }}>
          Message
        </Button>
        <Button size="2" style={{ flex: 1 }}>
          View Profile
        </Button>
      </Flex>
    </Flex>
  </Card>
)

/**
 * Settings Card Example
 */
export const SettingsCard: Story = () => (
  <Card size="4" style={{ maxWidth: "400px" }}>
    <Flex direction="column" gap="4">
      <Flex align="center" gap="3">
        <GearIcon width="20" height="20" />
        <Heading size="4">Account Settings</Heading>
      </Flex>
      
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Flex direction="column" gap="1">
            <Text weight="medium">Email Notifications</Text>
            <Text size="2" color="gray">Receive updates about your account</Text>
          </Flex>
          <Button variant="soft" size="1">
            Enabled
          </Button>
        </Flex>
        
        <Flex justify="between" align="center">
          <Flex direction="column" gap="1">
            <Text weight="medium">Two-Factor Authentication</Text>
            <Text size="2" color="gray">Add an extra layer of security</Text>
          </Flex>
          <Button variant="outline" size="1">
            Setup
          </Button>
        </Flex>
        
        <Flex justify="between" align="center">
          <Flex direction="column" gap="1">
            <Text weight="medium">Data Export</Text>
            <Text size="2" color="gray">Download your account data</Text>
          </Flex>
          <Button variant="ghost" size="1">
            Export
          </Button>
        </Flex>
      </Flex>
    </Flex>
  </Card>
)

/**
 * Feature Card Example
 */
export const FeatureCard: Story = () => (
  <Card size="3" style={{ maxWidth: "320px" }}>
    <Flex direction="column" gap="3">
      <Flex align="center" gap="2">
        <StarIcon width="18" height="18" color="var(--yellow-9)" />
        <Badge color="yellow" size="1">Premium</Badge>
      </Flex>
      
      <Flex direction="column" gap="2">
        <Heading size="5">Advanced Analytics</Heading>
        <Text size="2" color="gray">
          Get detailed insights into your application performance with advanced metrics,
          custom dashboards, and real-time monitoring.
        </Text>
      </Flex>
      
      <Flex direction="column" gap="2">
        <Text size="2" weight="medium">Features included:</Text>
        <ul style={{ margin: 0, paddingLeft: "var(--space-4)" }}>
          <li><Text size="2">Custom dashboards</Text></li>
          <li><Text size="2">Real-time alerts</Text></li>
          <li><Text size="2">Export capabilities</Text></li>
          <li><Text size="2">API access</Text></li>
        </ul>
      </Flex>
      
      <Button style={{ marginTop: "var(--space-2)" }}>
        Upgrade Now
      </Button>
    </Flex>
  </Card>
)

/**
 * Card Grid Layout
 */
export const CardGrid: Story = () => (
  <div style={{ 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
    gap: "var(--space-4)",
    maxWidth: "800px"
  }}>
    <Card>
      <Flex direction="column" gap="2">
        <Text weight="bold">Total Users</Text>
        <Text size="6" weight="bold" color="blue">12,345</Text>
        <Text size="2" color="green">+12% from last month</Text>
      </Flex>
    </Card>
    
    <Card>
      <Flex direction="column" gap="2">
        <Text weight="bold">Revenue</Text>
        <Text size="6" weight="bold" color="green">$45,678</Text>
        <Text size="2" color="green">+8% from last month</Text>
      </Flex>
    </Card>
    
    <Card>
      <Flex direction="column" gap="2">
        <Text weight="bold">Conversion Rate</Text>
        <Text size="6" weight="bold" color="purple">3.4%</Text>
        <Text size="2" color="red">-2% from last month</Text>
      </Flex>
    </Card>
  </div>
)