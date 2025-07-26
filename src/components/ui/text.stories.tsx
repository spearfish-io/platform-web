import type { StoryDefault, Story } from "@ladle/react"
import { Text, Flex } from "@radix-ui/themes"

/**
 * Text Component Stories
 * 
 * Demonstrates Radix UI Themes Text component with all variants
 */

export default {
  title: "UI Components/Text",
} satisfies StoryDefault

/**
 * Text Sizes
 */
export const Sizes: Story = () => (
  <Flex direction="column" gap="3">
    <Text size="1">Text size 1 - Caption text</Text>
    <Text size="2">Text size 2 - Body text (default)</Text>
    <Text size="3">Text size 3 - Lead text</Text>
    <Text size="4">Text size 4 - Large text</Text>
    <Text size="5">Text size 5 - XL text</Text>
    <Text size="6">Text size 6 - XXL text</Text>
    <Text size="7">Text size 7 - XXXL text</Text>
    <Text size="8">Text size 8 - Display text</Text>
    <Text size="9">Text size 9 - Hero text</Text>
  </Flex>
)

/**
 * Text Colors
 */
export const Colors: Story = () => (
  <Flex direction="column" gap="2">
    <Text color="blue">Blue text with Radix theme color</Text>
    <Text color="red">Red text with Radix theme color</Text>
    <Text color="green">Green text with Radix theme color</Text>
    <Text color="orange">Orange text with Radix theme color</Text>
    <Text color="purple">Purple text with Radix theme color</Text>
    <Text color="gray">Gray text with Radix theme color</Text>
  </Flex>
)

/**
 * Text Weights
 */
export const Weights: Story = () => (
  <Flex direction="column" gap="2">
    <Text weight="light">Light weight text</Text>
    <Text weight="regular">Regular weight text (default)</Text>
    <Text weight="medium">Medium weight text</Text>
    <Text weight="bold">Bold weight text</Text>
  </Flex>
)

/**
 * Combined Example
 */
export const CombinedExample: Story = () => (
  <Flex direction="column" gap="4" style={{ maxWidth: "500px" }}>
    <Text size="6" weight="bold" color="blue">
      Platform Web Design System
    </Text>
    <Text size="3" weight="medium" color="gray">
      Pure Radix UI Themes Implementation
    </Text>
    <Text size="2">
      This demonstrates how text components work with Pure Radix UI Themes. 
      All styling is achieved through component props without any custom CSS classes.
    </Text>
    <Text size="1" color="gray">
      Zero custom CSS • Accessibility-first • TypeScript-safe
    </Text>
  </Flex>
)